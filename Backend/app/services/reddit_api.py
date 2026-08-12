"""Reddit API integration (free, no auth required for read-only)."""
import httpx
from typing import List, Dict, Any
import urllib.parse

REDDIT_BASE = "https://www.reddit.com"

async def search_reddit_posts(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Reddit posts using the public JSON API (no auth needed)."""
    try:
        encoded_query = urllib.parse.quote(query)
        url = f"{REDDIT_BASE}/search.json?q={encoded_query}&limit={limit}&sort=relevance&t=year"

        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(
                url,
                headers={"User-Agent": "ATHENA-MediaLiteracy/1.0 (Hackathon Demo)"}
            )
            if resp.status_code != 200:
                return []

            data = resp.json()
            posts = data.get("data", {}).get("children", [])

            results = []
            for post in posts:
                p = post.get("data", {})
                # Skip NSFW and low-engagement posts
                if p.get("over_18"):
                    continue

                results.append({
                    "name": f"r/{p.get('subreddit', 'unknown')}",
                    "title": p.get("title", ""),
                    "url": f"https://reddit.com{p.get('permalink', '')}",
                    "snippet": p.get("selftext", "")[:300],
                    "date": datetime.fromtimestamp(p.get("created_utc", 0)).isoformat() if p.get("created_utc") else "",
                    "relevance": min(80, 50 + int(p.get("score", 0) / 100)),
                    "source_type": "reddit",
                    "engagement": {
                        "score": p.get("score", 0),
                        "comments": p.get("num_comments", 0)
                    }
                })

            return results[:5]
    except Exception:
        return []


async def get_subreddit_posts(subreddit: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Get posts from a specific subreddit."""
    try:
        url = f"{REDDIT_BASE}/r/{subreddit}/hot.json?limit={limit}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                url,
                headers={"User-Agent": "ATHENA-MediaLiteracy/1.0 (Hackathon Demo)"}
            )
            if resp.status_code != 200:
                return []

            data = resp.json()
            posts = data.get("data", {}).get("children", [])

            results = []
            for post in posts:
                p = post.get("data", {})
                if p.get("over_18"):
                    continue
                results.append({
                    "name": f"r/{subreddit}",
                    "title": p.get("title", ""),
                    "url": f"https://reddit.com{p.get('permalink', '')}",
                    "snippet": p.get("selftext", "")[:300],
                    "date": datetime.fromtimestamp(p.get("created_utc", 0)).isoformat() if p.get("created_utc") else "",
                    "relevance": 70,
                    "source_type": "reddit"
                })
            return results
    except Exception:
        return []

from datetime import datetime
