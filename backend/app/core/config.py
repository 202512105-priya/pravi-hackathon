import os
import shutil
from pydantic_settings import BaseSettings

is_vercel = os.environ.get("VERCEL") == "1"

if is_vercel:
    db_path = "/tmp/family_id_360.db"
    source_db = os.path.join(os.path.dirname(__file__), "..", "..", "family_id_360.db")
    if not os.path.exists(db_path):
        if os.path.exists(source_db):
            shutil.copy2(source_db, db_path)
    db_uri = f"sqlite:///{db_path}"
else:
    db_uri = os.environ.get("DATABASE_URL", "sqlite:///./family_id_360.db")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Family ID 360 Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    SQLALCHEMY_DATABASE_URI: str = db_uri


    class Config:
        case_sensitive = True

settings = Settings()
