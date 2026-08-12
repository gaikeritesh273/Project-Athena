from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache

# Keys that are clearly placeholders and should not be used for API calls
_PLACEHOLDER_PREFIXES = ("your-", "change-me", "example-", "placeholder", "xxxx", "test-key")

class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    UPSTASH_REDIS_REST_URL: str = ""
    UPSTASH_REDIS_REST_TOKEN: str = ""
    NEWSAPI_KEY: str = ""
    GNEWS_KEY: str = ""
    GEMINI_API_KEY: str = ""
    JWT_SECRET: str = "change-me-in-production"
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = ConfigDict(env_file=".env", extra="ignore")

    @property
    def has_newsapi(self) -> bool:
        """Returns True only if NEWSAPI_KEY is set and is not a placeholder."""
        key = self.NEWSAPI_KEY.strip().lower()
        if not key:
            return False
        return not any(key.startswith(p) for p in _PLACEHOLDER_PREFIXES)

    @property
    def has_gnews(self) -> bool:
        """Returns True only if GNEWS_KEY is set and is not a placeholder."""
        key = self.GNEWS_KEY.strip().lower()
        if not key:
            return False
        return not any(key.startswith(p) for p in _PLACEHOLDER_PREFIXES)

    @property
    def has_gemini(self) -> bool:
        """Returns True only if GEMINI_API_KEY is set and is not a placeholder."""
        key = self.GEMINI_API_KEY.strip().lower()
        if not key:
            return False
        return not any(key.startswith(p) for p in _PLACEHOLDER_PREFIXES)

@lru_cache()
def get_settings():
    return Settings()
