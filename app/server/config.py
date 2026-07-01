# Config module using pydantic-settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HypeRoom"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./hyproom.db"
    
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

settings = Settings()
