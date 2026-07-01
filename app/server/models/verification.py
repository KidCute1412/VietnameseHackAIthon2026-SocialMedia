# Database model for Verifications
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="PENDING")  # PENDING, PROCESSING, COMPLETED, FAILED
    raw_content = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    
    # Store scores
    trust_score = Column(Float, nullable=True)
    impact_score = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)
    
    # Store complex JSON payloads
    claims = Column(JSON, nullable=True)
    evidences = Column(JSON, nullable=True)
    editorial_outline = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    events = relationship("VerificationEvent", back_populates="verification")

class VerificationEvent(Base):
    __tablename__ = "verification_events"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verifications.id"))
    status = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    verification = relationship("Verification", back_populates="events")
