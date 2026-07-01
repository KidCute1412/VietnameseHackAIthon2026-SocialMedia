# Pydantic schemas for verification input/output validation
from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel

class VerificationCreate(BaseModel):
    title: Optional[str] = None
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

class VerificationJobResponse(BaseModel):
    id: int
    job_type: str
    status: str
    provider: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SourceResponse(BaseModel):
    id: int
    kind: str
    title: Optional[str] = None
    raw_text: Optional[str] = None
    file_name: Optional[str] = None
    mime_type: Optional[str] = None
    external_ref: Optional[str] = None
    metadata: dict = {}

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    id: int
    task_id: Optional[int] = None
    source_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VerificationDetail(VerificationResponse):
    title: Optional[str] = None
    raw_content: Optional[str] = None
    source_url: Optional[str] = None
    error_message: Optional[str] = None
    trust_score: Optional[float] = None
    impact_score: Optional[float] = None
    risk_score: Optional[float] = None
    claims: Optional[List[Any]] = None
    evidences: Optional[List[Any]] = None
    editorial_outline: Optional[dict] = None
    source: Optional[SourceResponse] = None
    jobs: List[VerificationJobResponse] = []
    events: List[VerificationEventSchema] = []

    class Config:
        from_attributes = True
