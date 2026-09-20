import sys
import os
import random
import uuid
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import SessionLocal
from app.models.models import User, Family, Member, Scheme, Application, Benefit, DataConflict, FamilyEvent, AuditLog
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # Clean DB
    db.query(AuditLog).delete()
    db.query(Benefit).delete()
    db.query(Application).delete()
    db.query(Scheme).delete()
    db.query(DataConflict).delete()
    db.query(FamilyEvent).delete()
    db.query(Member).delete()
    db.query(Family).delete()
    db.query(User).delete()

    # Create RBAC Users
    pw = get_password_hash("demo")
    users = [
        User(username="admin", hashed_password=pw, role="STATE_ADMIN"),
        User(username="officer_ahmedabad", hashed_password=pw, role="DISTRICT_OFFICER", district="Ahmedabad"),
        User(username="officer_surat", hashed_password=pw, role="DISTRICT_OFFICER", district="Surat"),
        User(username="field_sanand", hashed_password=pw, role="FIELD_WORKER", taluka="Sanand"),
        User(username="auditor", hashed_password=pw, role="AUDITOR"),
        User(username="citizen_ravi", hashed_password=pw, role="CITIZEN", linked_family_id="GJ-F-10293")
    ]
    for u in users:
        db.add(u)

    # Create Schemes
    schemes_data = [
        {"id": "SCH-PDS-01", "name": "Antyodaya Anna Yojana", "department": "PDS"},
        {"id": "SCH-EDU-01", "name": "Higher Education Scholarship", "department": "Education"},
        {"id": "SCH-HOU-01", "name": "Housing Upgrade Grant", "department": "Housing"},
        {"id": "SCH-PEN-01", "name": "Senior Citizen Pension", "department": "Pension"},
        {"id": "SCH-WCD-01", "name": "Maternal Health Support", "department": "WCD"},
        {"id": "SCH-HLT-01", "name": "Mukhyamantri Amrutam", "department": "Health"}
    ]
    db_schemes = []
    for s in schemes_data:
        sch = Scheme(**s)
        db.add(sch)
        db_schemes.append(sch)
    
    # Create 10 Families
    for i in range(1, 51):
        fid = f"GJ-F-10293" if i == 1 else f"FAM-2026-{i:03}"
        fam = Family(
            id=fid,
            head_name="Ravi Sharma" if i == 1 else f"Head {i}",
            district="Ahmedabad" if i == 1 else random.choice(["Surat", "Rajkot", "Vadodara"]),
            taluka="Sanand",
            village="Modasar",
            pincode="382220",
            address=f"House {i}, Main Road",
            ration_card_type="BPL",
            annual_income=85000 + i * 1000,
            household_status="Active",
            ration_card_status="Active"
        )
        db.add(fam)
        
        
        # Members
        members = []
        if i == 1:
            ravi_members = [
                {"id": f"MEM-{fid}-1", "name": "Ravi Sharma", "age": 42, "gender": "M", "relation": "Head"},
                {"id": f"MEM-{fid}-2", "name": "Anita Sharma", "age": 39, "gender": "F", "relation": "Spouse"},
                {"id": f"MEM-{fid}-3", "name": "Rahul Sharma", "age": 16, "gender": "M", "relation": "Son"},
                {"id": f"MEM-{fid}-4", "name": "Priya Sharma", "age": 14, "gender": "F", "relation": "Daughter"}
            ]
            for m in ravi_members:
                mem = Member(
                    id=m["id"], family_id=fid, name=m["name"], age=m["age"], gender=m["gender"], 
                    relation=m["relation"], aadhaar_ref=f"AADHAAR-{random.randint(1000, 9999)}"
                )
                db.add(mem)
                members.append(mem)
                
            # Applications for Ravi
            app1 = Application(id=f"APP-{fid}-HOU", family_id=fid, beneficiary_member_id=f"MEM-{fid}-1", scheme_id="SCH-HOU-01", submitted_at="2026-08-01", current_stage="Document Verification", status="Delayed", pending_days=42)
            app2 = Application(id=f"APP-{fid}-EDU", family_id=fid, beneficiary_member_id=f"MEM-{fid}-4", scheme_id="SCH-EDU-01", submitted_at="2026-08-15", current_stage="Approved", status="Normal", pending_days=0)
            app3 = Application(id=f"APP-{fid}-WCD", family_id=fid, beneficiary_member_id=f"MEM-{fid}-2", scheme_id="SCH-WCD-01", submitted_at="2026-09-01", current_stage="Delivered", status="Normal", pending_days=0)
            db.add_all([app1, app2, app3])
            
            # Benefits for Ravi
            ben1 = Benefit(id=f"BEN-{fid}-1", family_id=fid, beneficiary_member_id=f"MEM-{fid}-4", scheme_id="SCH-EDU-01", application_id=app2.id, status="Disbursed", sanctioned_amount=12000, paid_amount=12000, last_transaction="2026-09-10")
            ben2 = Benefit(id=f"BEN-{fid}-2", family_id=fid, beneficiary_member_id=f"MEM-{fid}-2", scheme_id="SCH-WCD-01", application_id=app3.id, status="Pending", sanctioned_amount=5000, paid_amount=0, last_transaction=None)
            db.add_all([ben1, ben2])
            
            # Skip the random generation for Ravi
            continue
            
        mem_id_base = f"MEM-{fid}"
        for m_idx in range(1, random.randint(3, 6)):
            mem = Member(
                id=f"{mem_id_base}-{m_idx}",
                family_id=fid,
                name=f"Member {m_idx} of {fid}",
                age=random.randint(5, 65),
                gender=random.choice(["M", "F"]),
                relation="Head" if m_idx == 1 else "Child",
                aadhaar_ref=f"AADHAAR-{random.randint(1000, 9999)}"
            )
            db.add(mem)
            members.append(mem)

        # Applications (handled above for Ravi)
        
        for b_idx in range(1, 3):
            sch = random.choice(db_schemes)
            mem = random.choice(members)
            app = Application(
                id=f"APP-{fid}-{b_idx}",
                family_id=fid,
                beneficiary_member_id=mem.id,
                scheme_id=sch.id,
                submitted_at="2026-08-01",
                current_stage=random.choice(["Submitted", "Document Verification", "Approved", "Delivered"]),
                status=random.choice(["Normal", "Delayed"]),
                pending_days=random.randint(5, 45)
            )
            db.add(app)
            
            if app.current_stage in ["Approved", "Delivered"]:
                ben = Benefit(
                    id=f"BEN-{fid}-{b_idx}",
                    family_id=fid,
                    beneficiary_member_id=mem.id,
                    scheme_id=sch.id,
                    application_id=app.id,
                    status="Disbursed",
                    sanctioned_amount=15000,
                    paid_amount=15000,
                    last_transaction="2026-09-01"
                )
                db.add(ben)
                
        # Data Conflicts
        conf = DataConflict(
            id=f"CON-{fid}",
            family_id=fid,
            type=random.choice(["NAME_MISMATCH", "DOB_MISMATCH", "ADDRESS_MISMATCH"]),
            status="OPEN",
            department="Cross-Department",
            district=fam.district,
            match_score=random.randint(60, 95),
            confidence="HIGH",
            factors={"nameSimilarity": {"score": 15}},
            records=[{"system": "PDS", "data": {"Name": "Test"}}]
        )
        db.add(conf)
        
        # Events
        evt = FamilyEvent(
            id=f"EVT-{fid}",
            family_id=fid,
            event_type=random.choice(["BIRTH", "DEATH", "MIGRATION"]),
            affected_member_id=members[0].id,
            effective_date="2026-09-10",
            source="Officer Report",
            supporting_reference="REF-001",
            reported_by="System",
            status="REVIEW_REQUIRED"
        )
        db.add(evt)

    db.commit()
    db.close()
    print("Database seeded successfully with RBAC users and 50 synthetic families!")

if __name__ == "__main__":
    seed_db()
