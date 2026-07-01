# Database model for Verifications
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="queued")  # queued, processing, completed, failed
    raw_content = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    title = Column(String, nullable=True)
    pipeline_version = Column(String, nullable=False, default="manual-ingestion-v1")
    error_message = Column(Text, nullable=True)

    trust_score = Column(Float, nullable=True)
    impact_score = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)

    claims = Column(JSON, nullable=True)
    evidences = Column(JSON, nullable=True)
    editorial_outline = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    source = relationship("Source", back_populates="verification", uselist=False)
    events = relationship(
        "VerificationEvent",
        back_populates="verification",
        cascade="all, delete-orphan",
    )
    jobs = relationship(
        "VerificationJob",
        back_populates="verification",
        cascade="all, delete-orphan",
    )


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verifications.id"), nullable=False, unique=True)
    kind = Column(String, nullable=False)
    title = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)
    file_name = Column(String, nullable=True)
    mime_type = Column(String, nullable=True)
    storage_path = Column(String, nullable=True)
    external_ref = Column(String, nullable=True)
    metadata_json = Column("metadata", JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    verification = relationship("Verification", back_populates="source")


class VerificationJob(Base):
    __tablename__ = "verification_jobs"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verifications.id"), nullable=False)
    job_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="queued")
    attempt_count = Column(Integer, nullable=False, default=0)
    provider = Column(String, nullable=True)
    payload = Column(JSON, nullable=False, default=dict)
    result = Column(JSON, nullable=False, default=dict)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    verification = relationship("Verification", back_populates="jobs")


class VerificationEvent(Base):
    __tablename__ = "verification_events"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verifications.id"))
    status = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    verification = relationship("Verification", back_populates="events")
