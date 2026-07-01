# API for Human-in-the-Loop Feedbacks and Audit Log
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any
from modules.deps import get_db
from modules.feedback.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
async def create_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db)
) -> Any:
    # Prototype: Return mock created feedback
    return {
        "id": 1,
        "verification_id": payload.verification_id,
        "editor_name": payload.editor_name,
        "comments": payload.comments,
        "adjusted_trust_score": payload.adjusted_trust_score,
        "adjusted_impact_score": payload.adjusted_impact_score,
        "adjusted_risk_score": payload.adjusted_risk_score,
        "created_at": "2026-07-01T12:10:00Z"
    }

@router.get("/history", response_model=List[FeedbackResponse])
async def get_feedback_history(db: Session = Depends(get_db)) -> Any:
    return [
        {
            "id": 1,
            "verification_id": 1,
            "editor_name": "Editor A",
            "comments": "Reviewed verification, adjusted scores.",
            "adjusted_trust_score": 0.90,
            "adjusted_impact_score": 0.70,
            "adjusted_risk_score": 0.10,
            "created_at": "2026-07-01T12:10:00Z"
        }
    ]
