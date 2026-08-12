from fastapi import APIRouter, HTTPException
from app.models.schemas import ClaimInput, ClaimCheckerResponse
from app.services.claim_checker import check_claim
from app.utils.redis_client import get_redis

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/analyze", response_model=ClaimCheckerResponse)
async def analyze_claims(input_data: ClaimInput):
    """Analyze claims from text or URL. Cross-references NewsAPI, GNews, RSS feeds, and Reddit."""
    try:
        if not input_data.text and not input_data.url:
            raise HTTPException(status_code=400, detail="Provide either text or URL")

        result = await check_claim(
            text=input_data.text or "",
            url=input_data.url
        )
        return ClaimCheckerResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/demo")
async def demo_claims():
    """Return demo claims for hackathon judging."""
    return {
        "demo_claims": [
            {
                "claim": "Climate change is real and caused by human activity",
                "expected": "corroborated",
                "note": "Multiple scientific sources confirm this"
            },
            {
                "claim": "Vaccines cause autism in children",
                "expected": "contradicted",
                "note": "Extensively debunked by medical science"
            },
            {
                "claim": "Aliens landed in Nevada last week",
                "expected": "unverified",
                "note": "No credible evidence found"
            },
            {
                "claim": "The Earth is flat",
                "expected": "contradicted",
                "note": "Contradicted by centuries of evidence"
            },
            {
                "claim": "Drinking lemon water cures cancer",
                "expected": "contradicted",
                "note": "No scientific basis"
            },
            {
                "claim": "5G networks cause health problems",
                "expected": "contradicted",
                "note": "WHO and FDA confirm safety within limits"
            }
        ],
        "instructions": "Paste any of these into the Claim Checker to see ATHENA in action. All responses are cached for 2 hours.",
        "sources_used": ["NewsAPI.org", "GNews", "RSS Feeds (BBC, Reuters, AP, NPR)", "Reddit API", "Demo Dataset (fallback)"]
    }

@router.get("/sources")
async def list_sources():
    """List all data sources used by the claim checker."""
    return {
        "primary_sources": [
            {"name": "NewsAPI.org", "type": "news_api", "free_tier": "100 requests/day", "status": "active"},
            {"name": "GNews", "type": "news_api", "free_tier": "100 requests/day", "status": "active"},
            {"name": "BBC News RSS", "type": "rss", "free_tier": "unlimited", "status": "active"},
            {"name": "Reuters RSS", "type": "rss", "free_tier": "unlimited", "status": "active"},
            {"name": "AP News RSS", "type": "rss", "free_tier": "unlimited", "status": "active"},
            {"name": "NPR RSS", "type": "rss", "free_tier": "unlimited", "status": "active"},
            {"name": "Reddit API", "type": "social", "free_tier": "read-only, no auth", "status": "active"},
        ],
        "fallback": {
            "name": "Demo Dataset",
            "description": "Curated dataset of common misinformation claims for when APIs are rate-limited or unavailable",
            "claims_available": 6
        }
    }

@router.post("/clear-cache")
async def clear_claim_cache(text: str):
    """Clear cache for a specific claim query."""
    import hashlib
    from app.services.claim_checker import get_cache_key
    redis = get_redis()
    cache_key = get_cache_key(text)
    await redis.delete(cache_key)
    return {"message": "Cache cleared", "key": cache_key}
