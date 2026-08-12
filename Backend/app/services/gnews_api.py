"""GNews API integration (free tier: 100 req/day).
Gracefully handles missing keys, rate limits (429), and auth errors (401/403).
"""
import httpx
from typing import List, Dict, Any

GNEWS_BASE = "https://gnews.io/api/v4"

async def search_gnews(query: str, api_key: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Search GNews for articles matching a query. Returns [] on any failure."""
    if not api_key or not api_key.strip():
        return []

    try:
        url = f"{GNEWS_BASE}/search"
        params = {
            "q": query,
            "lang": "en",
            "max": max_results,
            "apikey": api_key,
            "sortby": "relevance"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)

            # Rate limited
            if resp.status_code == 429:
                return []
            # Auth error — key invalid or quota exhausted
            if resp.status_code in (401, 403):
                return []
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
                    "source_type": "gnews",
                    "image": a.get("image", "")
                }
                for a in articles[:max_results]
            ]
    except Exception:
        return []
