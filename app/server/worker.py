from database import SessionLocal
from modules.verification.orchestrator import process_manual_ingestion_job


def run_manual_ingestion_job(verification_job_id: int) -> None:
    db = SessionLocal()
    try:
        process_manual_ingestion_job(db, verification_job_id)
    finally:
        db.close()
