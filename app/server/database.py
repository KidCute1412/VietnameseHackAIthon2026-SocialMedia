# Database connection and session configurations
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

# For SQLite, check_same_thread needs to be False
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
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

    Base.metadata.create_all(bind=engine)
