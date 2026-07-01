# Config module using pydantic-settings
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "HypeRoom"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./hyproom.db"
    UPLOAD_DIR: str = str(Path("storage") / "uploads")

    # Queue / Redis
    REDIS_URL: str = ""
    REDIS_QUEUE_NAME: str = "manual-ingestion"
    REDIS_DEFAULT_TIMEOUT_SECONDS: int = 300

    # vnSocial API configuration
    VNSOCIAL_LOGIN_URL: str = "https://api-vnsocialplus.vnpt.vn/social-api/v1/login"
    VNSOCIAL_USERNAME: str = ""
    VNSOCIAL_PASSWORD: str = ""
    VNSOCIAL_TOKEN: str = ""
    VNSOCIAL_PROJECTS_URL: str = "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects"
    VNSOCIAL_TIMEOUT_SECONDS: float = 10.0

    # Tavily Search API key
    TAVILY_API_KEY: str = ""

    # VNPT SmartBot API settings
    VNPT_SMARTBOT_API_URL: str = "https://api.vnpt.vn/smartbot/v2/chat"
    VNPT_SMARTBOT_TOKEN: str = ""
    VNPT_SMARTBOT_ID: str = ""

    # VNPT SmartReader / SmartVoice auth
    VNPT_TOKEN_ID: str = ""
    VNPT_TOKEN_KEY: str = ""
    VNPT_AUTHORIZATION: str = ""
    VNPT_MAC_ADDRESS: str = "EGOV-DIGDOC-WEB-API"
    VNPT_CLIENT_SESSION: str = "hyperoom-manual-ingestion"
    VNPT_TIMEOUT_SECONDS: float = 60.0

    VNPT_SMARTREADER_UPLOAD_URL: str = "https://api.idg.vnpt.vn/file-service/v1/addFile"
    VNPT_SMARTREADER_OCR_URL: str = "https://api.idg.vnpt.vn/rpa-service/aidigdoc/v1/ocr/scan"
    VNPT_SMARTREADER_BODY_TOKEN: str = ""
    VNPT_SMARTVOICE_STT_URL: str = "https://api.idg.vnpt.vn/stt-service/v1/grpc/async/standard"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
