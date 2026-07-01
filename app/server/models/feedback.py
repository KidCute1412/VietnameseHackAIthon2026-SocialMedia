# Database model for Feedbacks and Audit Logs
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verifications.id"), nullable=False)
    editor_name = Column(String, nullable=True)
    comments = Column(Text, nullable=True)
    
    # Optional manual score adjustments (Human-in-the-Loop)
    adjusted_trust_score = Column(Float, nullable=True)
    adjusted_impact_score = Column(Float, nullable=True)
    adjusted_risk_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
