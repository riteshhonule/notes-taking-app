from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    database_url: str = os.getenv('DATABASE_URL', 'mysql+pymysql://root:password@db:3306/notes_db')
    secret_key: str = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    algorithm: str = 'HS256'
    access_token_expire_minutes: int = 30

    class Config:
        env_file = '.env'

@lru_cache()
def get_settings():
    return Settings()
