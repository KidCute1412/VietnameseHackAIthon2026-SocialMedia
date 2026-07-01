# Database connection and session configurations
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings


def _connect_args() -> dict[str, bool]:
    if settings.DATABASE_URL.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


engine = create_engine(
    settings.DATABASE_URL,
    connect_args=_connect_args(),
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from modules.verification.models import Verification, Source, VerificationJob, VerificationEvent  # noqa: F401
    from modules.feedback.models import Feedback  # noqa: F401
    from modules.auth.models import User, OTPCode  # noqa: F401

    Base.metadata.create_all(bind=engine)
