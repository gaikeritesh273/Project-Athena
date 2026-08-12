"""
Rate limiting middleware using Upstash Redis.
Simple token bucket algorithm per IP address.
"""
import time
from typing import Optional
from fastapi import Request, HTTPException
from app.utils.redis_client import get_redis

async def rate_limit_check(
    request: Request,
    key_prefix: str = "rl",
    max_requests: int = 30,
    window_seconds: int = 60
) -> bool:
    """
    Check if request is within rate limit.
    Returns True if allowed, raises HTTPException if exceeded.
    """
    # Get client IP
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    if "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()

    key = f"{key_prefix}:{client_ip}"
    redis = get_redis()

    # Try to use Redis
    try:
        # Simple counter with expiry
        current = await redis.get(key)
        if current is None:
            await redis.set(key, {"count": 1, "window_start": time.time()}, ttl_seconds=window_seconds)
            return True

        count = current.get("count", 0)
        if count >= max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Try again in {window_seconds} seconds."
            )

        current["count"] = count + 1
        await redis.set(key, current, ttl_seconds=window_seconds)
        return True
    except HTTPException:
        raise
    except Exception:
        # If Redis fails, allow request (fail open for demo)
        return True


class RateLimitMiddleware:
    """FastAPI middleware for global rate limiting."""

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        self.app = app
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope, receive)
            try:
                await rate_limit_check(
                    request,
                    key_prefix="global",
                    max_requests=self.max_requests,
                    window_seconds=self.window_seconds
                )
            except HTTPException as e:
                # Send error response
                await send({
                    "type": "http.response.start",
                    "status": e.status_code,
                    "headers": [[b"content-type", b"application/json"]],
                })
                await send({
                    "type": "http.response.body",
                    "body": f'"{e.detail}"'.encode(),
                })
                return

        await self.app(scope, receive, send)
