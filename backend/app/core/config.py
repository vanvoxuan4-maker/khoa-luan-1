from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

# Xác định đường dẫn tuyệt đối của file .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "BIKE STORE"
    API_V1_STR: str = "/api/v1"
    
    # Kết nối Database - ĐỌC TỪ .env
    DATABASE_URL: str
    
    # Security - ĐỌC TỪ .env
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 1 day (default)
    
    # pgAdmin (optional)
    PGADMIN_EMAIL: Optional[str] = None
    PGADMIN_PASSWORD: Optional[str] = None
    
    # VNPay Configuration
    VNP_TMN_CODE: Optional[str] = None
    VNP_HASH_SECRET: Optional[str] = None
    VNP_URL: Optional[str] = None
    VNP_RETURN_URL: Optional[str] = None
    
    # AI Chatbot
    GOOGLE_API_KEY: str
    
    class Config:
        case_sensitive = False
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'
        extra = 'ignore' # Bỏ qua các biến dư thừa trong .env

settings = Settings()

