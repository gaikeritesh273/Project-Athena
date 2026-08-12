import json
import httpx
from app.config import get_settings
from functools import lru_cache

class RedisCache:
    def __init__(self):
        settings = get_settings()
        self.url = settings.UPSTASH_REDIS_REST_URL
        self.token = settings.UPSTASH_REDIS_REST_TOKEN
        self.enabled = bool(self.url and self.token)

    async def get(self, key: str):
        if not self.enabled:
            return None
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{self.url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.token}"}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("result"):
                        return json.loads(data["result"])
        except Exception:
            pass
        return None

    async def set(self, key: str, value, ttl_seconds: int = 3600):
        if not self.enabled:
            return
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.url}/set/{key}/{json.dumps(value)}",
                    headers={"Authorization": f"Bearer {self.token}"},
                    params={"EX": str(ttl_seconds)}
                )
        except Exception:
            pass

    async def delete(self, key: str):
        if not self.enabled:
            return
        try:
            async with httpx.AsyncClient() as client:
                await client.get(
                    f"{self.url}/del/{key}",
                    headers={"Authorization": f"Bearer {self.token}"}
                )
        except Exception:
            pass

@lru_cache()
def get_redis():
    return RedisCache()
