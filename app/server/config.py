# Config module using pydantic-settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HypeRoom"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/mydb"
    CORS_ALLOW_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:8000"

    # Auth configuration
    JWT_SECRET_KEY: str = "change-this-secret-in-env"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24
    AUTH_COOKIE_NAME: str = "hyperoom_jwt"
    AUTH_COOKIE_SECURE: bool = False
    AUTH_COOKIE_SAMESITE: str = "lax"
    OTP_EXPIRE_MINUTES: int = 15
    OTP_CLEANUP_INTERVAL_MINUTES: int = 1

    # SMTP email settings
    SMTP_ENABLED: bool = False
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "HypeRoom"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    SMTP_TIMEOUT_SECONDS: float = 10.0
    
    # vnSocial API configuration
    VNSOCIAL_LOGIN_URL: str = "https://api-vnsocialplus.vnpt.vn/social-api/v1/login"
    VNSOCIAL_USERNAME: str = ""
    VNSOCIAL_PASSWORD: str = ""
    VNSOCIAL_TOKEN: str = ""
    VNSOCIAL_PROJECTS_URL: str = "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects"
    VNSOCIAL_HOT_POSTS_URL: str = "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts"
    VNSOCIAL_TIMEOUT_SECONDS: float = 10.0

    # Tavily Search API key
    TAVILY_API_KEY: str = ""

    # VNPT SmartBot API settings
    VNPT_SMARTBOT_API_URL: str = "https://api.vnpt.vn/smartbot/v2/chat"
    VNPT_SMARTBOT_TOKEN: str = ""
    VNPT_SMARTBOT_ID: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_allow_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ALLOW_ORIGINS.split(",")
            if origin.strip()
        ]

settings = Settings()
