# API for Verifications Orchestration (Hot/Cold paths)
from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List, Any

from api.deps import get_db
from schemas.verification import (
    VerificationCreate,
    VerificationCreateFromTrending,
    VerificationResponse,
    VerificationDetail,
    VerificationEventSchema,
)

router = APIRouter()

# Background task for Cold Path processing
async def run_background_verification(verification_id: int, db: Session):
    # This represents the background orchestration engine
    pass

@router.post("", response_model=VerificationResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_verification(
    payload: VerificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Any:
    # Cold Path: save PENDING state and trigger background tasks
    # Mock returning schema
    return {
        "id": 1,
        "status": "PENDING",
        "created_at": "2026-07-01T12:00:00Z",
        "updated_at": "2026-07-01T12:00:00Z"
    }

@router.post("/from-trending", response_model=VerificationResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_verification_from_trending(
    payload: VerificationCreateFromTrending,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Any:
    return {
        "id": 2,
        "status": "PENDING",
        "created_at": "2026-07-01T12:00:00Z",
        "updated_at": "2026-07-01T12:00:00Z"
    }

@router.get("", response_model=List[VerificationResponse])
async def list_verifications(db: Session = Depends(get_db)) -> Any:
    return [
        {
            "id": 1,
            "status": "COMPLETED",
            "created_at": "2026-07-01T12:00:00Z",
            "updated_at": "2026-07-01T12:30:00Z"
        }
    ]

@router.get("/{id}", response_model=VerificationDetail)
async def get_verification_detail(id: int, db: Session = Depends(get_db)) -> Any:
    return {
        "id": id,
        "status": "COMPLETED",
        "raw_content": "Nội dung cần xác minh...",
        "source_url": "https://example.com/source",
        "trust_score": 0.85,
        "impact_score": 0.72,
        "risk_score": 0.15,
        "claims": [{"id": 1, "text": "Claim description"}],
        "evidences": [{"id": 1, "title": "Evidence supporting claim"}],
        "editorial_outline": {
            "outline": ["1. Intro", "2. Core claims vs evidences", "3. Summary"]
        },
        "events": [
            {
                "id": 101,
                "status": "PENDING",
                "message": "Created verification task",
                "created_at": "2026-07-01T12:00:00Z"
            },
            {
                "id": 102,
                "status": "COMPLETED",
                "message": "Analyses finalized",
                "created_at": "2026-07-01T12:05:00Z"
            }
        ],
        "created_at": "2026-07-01T12:00:00Z",
        "updated_at": "2026-07-01T12:05:00Z"
    }

@router.get("/{id}/events", response_model=List[VerificationEventSchema])
async def get_verification_events(id: int, db: Session = Depends(get_db)) -> Any:
    return [
        {
            "id": 101,
            "status": "PENDING",
            "message": "Created verification task",
            "created_at": "2026-07-01T12:00:00Z"
        }
    ]
