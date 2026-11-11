import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AquaGuard AI"
    PROJECT_TITLE: str = "Fish Disease Risk Detection & Early Warning System"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_BUCKET: str = os.getenv("SUPABASE_BUCKET", "fish-scans")
    
    # Model Weights Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    WEIGHTS_DIR: str = os.path.join(BASE_DIR, "models_weights")
    
    # Image Upload Limits
    MAX_IMAGE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]

settings = Settings()

