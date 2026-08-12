"""NewsAPI.org client with caching and rate limit awareness."""
import httpx
from typing import List, Dict, Any
from app.config import get_settings

NEWSAPI_BASE = "https://newsapi.org/v2"

async def search_newsapi_everything(query: str, api_key: str, page_size: int = 5) -> List[Dict[str, Any]]:
    """Search NewsAPI everything endpoint."""
    if not api_key:
        return []

    try:
        url = f"{NEWSAPI_BASE}/everything"
        params = {
            "q": query,
            "sortBy": "relevancy",
            "pageSize": page_size,
            "language": "en",
            "apiKey": api_key
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code == 429:
                # Rate limited
                return [{"name": "NewsAPI", "title": "Rate limit reached", "url": "", "snippet": "NewsAPI free tier limit (100 req/day) reached. Using cached/demo data.", "date": "", "relevance": 0, "source_type": "newsapi", "rate_limited": True}]
            if resp.status_code != 200:
                return []

            data = resp.json()
            articles = data.get("articles", [])

            return [
                {
                    "name": a.get("source", {}).get("name", "Unknown"),
                    "title": a.get("title", ""),
                    "url": a.get("url", ""),
                    "snippet": a.get("description", "")[:300] if a.get("description") else a.get("content", "")[:300],
                    "date": a.get("publishedAt", "")[:10],
                    "relevance": 82,
                    "source_type": "newsapi"
                }
                for a in articles[:page_size]
            ]
    except Exception:
        return []

async def get_newsapi_top_headlines(category: str = "general", api_key: str = "", page_size: int = 5) -> List[Dict[str, Any]]:
    """Get top headlines for pre-fetching demo cache."""
    if not api_key:
        return []

    try:
        url = f"{NEWSAPI_BASE}/top-headlines"
        params = {
            "category": category,
            "pageSize": page_size,
            "language": "en",
            "apiKey": api_key
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code != 200:
                return []

            data = resp.json()
            articles = data.get("articles", [])

            return [
                {
                    "name": a.get("source", {}).get("name", "Unknown"),
                    "title": a.get("title", ""),
                    "url": a.get("url", ""),
                    "snippet": a.get("description", "")[:300],
                    "date": a.get("publishedAt", "")[:10],
                    "relevance": 80,
                    "source_type": "newsapi"
                }
                for a in articles[:page_size]
            ]
    except Exception:
        return []
