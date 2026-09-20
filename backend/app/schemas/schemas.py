from pydantic import BaseModel
from typing import List, Optional, Any

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str

class MemberBase(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    relation: str
    aadhaar_ref: str

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    id: str
    family_id: str
    beneficiary_member_id: str
    scheme_id: str
    submitted_at: str
    current_stage: str
    status: str
    pending_days: int
    
    class Config:
        from_attributes = True

class BenefitBase(BaseModel):
    id: str
    family_id: str
    beneficiary_member_id: str
    scheme_id: str
    application_id: Optional[str] = None
    status: str
    sanctioned_amount: int
    paid_amount: int
    last_transaction: Optional[str] = None
    
    class Config:
        from_attributes = True

class DataConflictBase(BaseModel):
    id: str
    family_id: str
    type: str
    status: str
    department: str
    district: str
    match_score: int
    confidence: str
    factors: Any
    records: Any
    
    class Config:
        from_attributes = True

class FamilyEventBase(BaseModel):
    id: str
    family_id: str
    event_type: str
    affected_member_id: Optional[str] = None
    effective_date: str
    source: str
    supporting_reference: str
    reported_by: str
    status: str
    
    class Config:
        from_attributes = True

class FamilyBase(BaseModel):
    id: str
    head_name: str
    district: str
    taluka: str
    village: str
    pincode: Optional[str] = None
    address: Optional[str] = None
    ration_card_type: Optional[str] = None
    annual_income: Optional[int] = None
    household_status: Optional[str] = None
    ration_card_status: Optional[str] = None
    
    class Config:
        from_attributes = True

class FamilyDetail(FamilyBase):
    members: List[MemberBase] = []


class UserResponse(BaseModel):
    username: str
    role: str
    district: Optional[str] = None
    taluka: Optional[str] = None
    department: Optional[str] = None
    linked_family_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class AuditLogBase(BaseModel):
    id: int
    user_id: int
    action: str
    entity_type: str
    entity_id: str
    details: Any
    timestamp: str

    class Config:
        from_attributes = True

class FamilyCreate(BaseModel):
    head_name: str
    district: str
    taluka: str
    village: str
    pincode: str
    address: str
    ration_card_type: str
    annual_income: int
