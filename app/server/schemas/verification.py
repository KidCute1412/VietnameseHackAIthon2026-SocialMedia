# Pydantic schemas for verification input/output validation
from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel

class VerificationCreate(BaseModel):
    raw_content: Optional[str] = None
    source_url: Optional[str] = None

class VerificationCreateFromTrending(BaseModel):
    post_id: str
    source_url: Optional[str] = None

class VerificationEventSchema(BaseModel):
    id: int
    status: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VerificationDetail(VerificationResponse):
    raw_content: Optional[str] = None
    source_url: Optional[str] = None
    trust_score: Optional[float] = None
    impact_score: Optional[float] = None
    risk_score: Optional[float] = None
    claims: Optional[List[Any]] = None
    evidences: Optional[List[Any]] = None
    editorial_outline: Optional[dict] = None
    events: List[VerificationEventSchema] = []

    class Config:
        from_attributes = True
