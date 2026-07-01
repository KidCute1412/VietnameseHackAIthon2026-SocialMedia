import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from modules.deps import get_db, get_job_dispatcher
from config import settings
from database import Base
from main import app
from modules.verification.models import Verification
from modules.verification.orchestrator import JobDispatcher


class StubDispatcher(JobDispatcher):
    def __init__(self) -> None:
        self.job_ids: list[int] = []

    def enqueue_manual_ingestion(self, verification_job_id: int) -> str:
        self.job_ids.append(verification_job_id)
        return f"stub-{verification_job_id}"


@pytest.fixture()
def client(tmp_path: Path):
    os.environ["UPLOAD_DIR"] = str(tmp_path / "uploads")
    settings.UPLOAD_DIR = str(tmp_path / "uploads")
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    testing_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    dispatcher = StubDispatcher()

    def override_get_db():
        db = testing_session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_job_dispatcher] = lambda: dispatcher

    # Create a real JWT token so that main.py require_jwt_cookie middleware can decode it successfully
    db = testing_session()
    from modules.auth.models import User
    from modules.auth.services import create_access_token
    test_user = db.query(User).filter(User.id == 1).first()
    if not test_user:
        test_user = User(id=1, email="test@example.com", password_hash="dummy")
        db.add(test_user)
        db.commit()
    token = create_access_token(test_user)
    db.close()

    with TestClient(app) as test_client:
        test_client.cookies.set(settings.AUTH_COOKIE_NAME, token)
        yield test_client, testing_session, dispatcher
    app.dependency_overrides.clear()


def test_rejects_large_pdf_upload(client):
    test_client, _, _ = client
    payload = b"x" * (10 * 1024 * 1024 + 1)
    response = test_client.post(
        "/api/v1/verifications",
        files={"file": ("large.pdf", payload, "application/pdf")},
    )
    assert response.status_code == 413
    assert response.json()["detail"]["code"] == "payload_too_large"


def test_rejects_unsupported_media_type(client):
    test_client, _, _ = client
    response = test_client.post(
        "/api/v1/verifications",
        files={"file": ("notes.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 415
    assert response.json()["detail"]["code"] == "unsupported_media_type"


def test_accepts_text_and_enqueues_job(client):
    test_client, testing_session, dispatcher = client
    response = test_client.post(
        "/api/v1/verifications",
        json={"title": "Manual text", "raw_content": "Noi dung can xac minh"},
    )
    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "queued"
    assert body["task_id"] is not None
    assert dispatcher.job_ids == [body["task_id"]]

    db = testing_session()
    try:
        verification = db.query(Verification).filter(Verification.id == body["id"]).first()
        assert verification is not None
        assert verification.status == "queued"
        assert verification.source is not None
        assert verification.source.raw_text == "Noi dung can xac minh"
    finally:
        db.close()
