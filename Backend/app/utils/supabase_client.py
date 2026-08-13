from typing import Any
from app.config import get_settings
from functools import lru_cache
from fastapi import HTTPException

try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    create_client = None
    Client = Any
    HAS_SUPABASE = False

@lru_cache()
def get_supabase() -> Any:
    if not HAS_SUPABASE or create_client is None:
        raise HTTPException(status_code=503, detail="Supabase client is not installed. Install 'supabase' package to enable auth features.")
    settings = get_settings()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_admin() -> Any:
    if not HAS_SUPABASE or create_client is None:
        raise HTTPException(status_code=503, detail="Supabase client is not installed. Install 'supabase' package to enable admin features.")
    settings = get_settings()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

