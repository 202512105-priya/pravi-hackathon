from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="OFFICER")
    district = Column(String, nullable=True)
    taluka = Column(String, nullable=True)
    department = Column(String, nullable=True)
    linked_family_id = Column(String, nullable=True)

class Family(Base):
    __tablename__ = "families"
    id = Column(String, primary_key=True, index=True)
    head_name = Column(String)
    district = Column(String)
    taluka = Column(String)
    village = Column(String)
    pincode = Column(String)
    address = Column(String)
    ration_card_type = Column(String)
    annual_income = Column(Integer)
    household_status = Column(String)
    ration_card_status = Column(String)
    
    members = relationship("Member", back_populates="family")
    applications = relationship("Application", back_populates="family")
    benefits = relationship("Benefit", back_populates="family")
    conflicts = relationship("DataConflict", back_populates="family")
    events = relationship("FamilyEvent", back_populates="family")

class Member(Base):
    __tablename__ = "members"
    id = Column(String, primary_key=True, index=True)
    family_id = Column(String, ForeignKey("families.id"))
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    relation = Column(String)
    aadhaar_ref = Column(String)
    
    family = relationship("Family", back_populates="members")
    applications = relationship("Application", back_populates="member")
    benefits = relationship("Benefit", back_populates="member")

class Scheme(Base):
    __tablename__ = "schemes"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    department = Column(String)

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True, index=True)
    family_id = Column(String, ForeignKey("families.id"))
    beneficiary_member_id = Column(String, ForeignKey("members.id"))
    scheme_id = Column(String, ForeignKey("schemes.id"))
    submitted_at = Column(String)
    current_stage = Column(String)
    status = Column(String)
    pending_days = Column(Integer)
    
    family = relationship("Family", back_populates="applications")
    member = relationship("Member", back_populates="applications")
    scheme = relationship("Scheme")

class Benefit(Base):
    __tablename__ = "benefits"
    id = Column(String, primary_key=True, index=True)
    family_id = Column(String, ForeignKey("families.id"))
    beneficiary_member_id = Column(String, ForeignKey("members.id"))
    scheme_id = Column(String, ForeignKey("schemes.id"))
    application_id = Column(String, ForeignKey("applications.id"), nullable=True)
    status = Column(String)
    sanctioned_amount = Column(Integer)
    paid_amount = Column(Integer)
    last_transaction = Column(String, nullable=True)
    
    family = relationship("Family", back_populates="benefits")
    member = relationship("Member", back_populates="benefits")
    scheme = relationship("Scheme")
    application = relationship("Application")

class DataConflict(Base):
    __tablename__ = "data_conflicts"
    id = Column(String, primary_key=True, index=True)
    family_id = Column(String, ForeignKey("families.id"))
    type = Column(String)
    status = Column(String)
    department = Column(String)
    district = Column(String)
    match_score = Column(Integer)
    confidence = Column(String)
    factors = Column(JSON)
    records = Column(JSON)
    
    family = relationship("Family", back_populates="conflicts")

class FamilyEvent(Base):
    __tablename__ = "family_events"
    id = Column(String, primary_key=True, index=True)
    family_id = Column(String, ForeignKey("families.id"))
    event_type = Column(String)
    affected_member_id = Column(String, nullable=True)
    effective_date = Column(String)
    source = Column(String)
    supporting_reference = Column(String)
    reported_by = Column(String)
    status = Column(String)
    
    family = relationship("Family", back_populates="events")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    entity_type = Column(String)
    entity_id = Column(String)
    details = Column(JSON)
    timestamp = Column(String)
    
    user = relationship("User")

