from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import datetime
from app.db.database import get_db
from app.core.config import settings
from app.core.security import create_access_token, get_current_user, require_officer_role
from app.models.models import Family, Benefit, Application, FamilyEvent, DataConflict, Member, AuditLog, User
from app.schemas.schemas import TokenResponse, FamilyDetail, BenefitBase, ApplicationBase, FamilyEventBase, DataConflictBase, AuditLogBase

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # In a real app we verify hashed passwords. For demo, we just look up the user by username to bypass strict password checks.
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "role": user.role,
            "district": user.district,
            "taluka": user.taluka,
            "department": user.department
        }
    }

def log_audit(db: Session, user: User, action: str, entity_type: str, entity_id: str, details: dict):
    log = AuditLog(
        user_id=user.id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        timestamp=datetime.datetime.utcnow().isoformat()
    )
    db.add(log)

@router.get("/families/{family_id}", response_model=FamilyDetail)
def read_family(family_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = db.query(Family).filter(Family.id == family_id).first()
    if family is None:
        raise HTTPException(status_code=404, detail="Family not found")
        
    # Data Scoping Logic
    if current_user.role == "DISTRICT_OFFICER" and current_user.district and family.district != current_user.district:
        raise HTTPException(status_code=403, detail="Permission Denied: Family belongs to another district")
    if current_user.role == "TALUKA_OFFICER" and current_user.taluka and family.taluka != current_user.taluka:
        raise HTTPException(status_code=403, detail="Permission Denied: Family belongs to another taluka")
        
    return family

@router.get("/families/{family_id}/benefits", response_model=list[BenefitBase])
def read_family_benefits(family_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Department Scoping
    query = db.query(Benefit).filter(Benefit.family_id == family_id)
    if current_user.role == "DEPARTMENT_OFFICER" and current_user.department:
        # We need scheme join to filter by department
        from app.models.models import Scheme
        query = query.join(Scheme).filter(Scheme.department == current_user.department)
    return query.all()

@router.get("/families/{family_id}/applications", response_model=list[ApplicationBase])
def read_family_applications(family_id: str, db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.family_id == family_id).all()

@router.get("/families/{family_id}/events", response_model=list[FamilyEventBase])
def read_family_events(family_id: str, db: Session = Depends(get_db)):
    return db.query(FamilyEvent).filter(FamilyEvent.family_id == family_id).all()

@router.get("/families/{family_id}/conflicts", response_model=list[DataConflictBase])
def read_family_conflicts(family_id: str, db: Session = Depends(get_db)):
    return db.query(DataConflict).filter(DataConflict.family_id == family_id).all()

@router.get("/applications", response_model=list[ApplicationBase])
def read_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Application)
    if current_user.role == "DISTRICT_OFFICER" and current_user.district:
        query = query.join(Family).filter(Family.district == current_user.district)
    return query.all()

@router.patch("/applications/{app_id}/status")
def update_application_status(app_id: str, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    old_stage = app.current_stage
    app.current_stage = payload.get("status", old_stage)
    
    log_audit(db, current_user, "UPDATE_APP_STATUS", "Application", app.id, {"old": old_stage, "new": app.current_stage})
    db.commit()
    return {"message": "Status updated successfully"}

@router.post("/events", response_model=FamilyEventBase)
def create_event(event: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    import uuid
    new_evt = FamilyEvent(id=str(uuid.uuid4()), **event)
    db.add(new_evt)
    log_audit(db, current_user, "REPORT_EVENT", "FamilyEvent", new_evt.id, event)
    db.commit()
    db.refresh(new_evt)
    return new_evt

@router.get("/conflicts", response_model=list[DataConflictBase])
def read_conflicts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(DataConflict)
    if current_user.role == "DISTRICT_OFFICER" and current_user.district:
        query = query.filter(DataConflict.district == current_user.district)
    return query.all()

@router.patch("/conflicts/{conflict_id}")
def update_conflict(conflict_id: str, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conf = db.query(DataConflict).filter(DataConflict.id == conflict_id).first()
    if not conf:
        raise HTTPException(status_code=404, detail="Conflict not found")
    if "status" in payload:
        old_status = conf.status
        conf.status = payload["status"]
        log_audit(db, current_user, "UPDATE_CONFLICT", "DataConflict", conf.id, {"old": old_status, "new": conf.status})
    db.commit()
    return {"message": "Conflict updated"}

@router.get("/analytics/statewide")
def get_statewide_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fam_count = db.query(Family).count()
    app_count = db.query(Application).count()
    conf_count = db.query(DataConflict).filter(DataConflict.status == "OPEN").count()
    return {
        "uniqueFamilies": fam_count,
        "totalApps": app_count,
        "dataConflicts": conf_count
    }

from app.schemas.schemas import FamilyCreate

@router.post("/families", response_model=FamilyDetail)
def create_family(fam_data: FamilyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    import uuid
    import random
    
    # Generate ID
    fid = f"FAM-{datetime.datetime.now().year}-{random.randint(1000, 9999)}"
    
    new_fam = Family(
        id=fid,
        head_name=fam_data.head_name,
        district=fam_data.district,
        taluka=fam_data.taluka,
        village=fam_data.village,
        pincode=fam_data.pincode,
        address=fam_data.address,
        ration_card_type=fam_data.ration_card_type,
        annual_income=fam_data.annual_income,
        household_status="Active",
        ration_card_status="Active"
    )
    db.add(new_fam)
    
    # Auto-add the head as a member
    head_mem = Member(
        id=f"MEM-{fid}-1",
        family_id=fid,
        name=fam_data.head_name,
        age=35, # Default placeholder
        gender="M",
        relation="Head",
        aadhaar_ref=f"AADHAAR-{random.randint(1000, 9999)}"
    )
    db.add(head_mem)
    
    log_audit(db, current_user, "CREATE_FAMILY", "Family", new_fam.id, fam_data.dict())
    
    db.commit()
    db.refresh(new_fam)
    return new_fam
