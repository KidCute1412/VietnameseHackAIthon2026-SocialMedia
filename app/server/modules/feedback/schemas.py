# Pydantic schemas for feedback validation
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FeedbackCreate(BaseModel):
    verification_id: int
    editor_name: Optional[str] = None
    comments: Optional[str] = None
    adjusted_trust_score: Optional[float] = None
    adjusted_impact_score: Optional[float] = None
    adjusted_risk_score: Optional[float] = None

class FeedbackResponse(BaseModel):
    id: int
    verification_id: int
    editor_name: Optional[str] = None
    comments: Optional[str] = None
    adjusted_trust_score: Optional[float] = None
    adjusted_impact_score: Optional[float] = None
    adjusted_risk_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
