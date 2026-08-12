"""
Claim Checker Service — Multi-source cross-reference engine.
Integrates: NewsAPI, GNews, RSS feeds (BBC/Reuters/AP/NPR), Reddit API.
All responses cached in Redis. Demo dataset as fallback.
"""
import httpx
import json
import hashlib
import re
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.utils.redis_client import get_redis
from app.config import get_settings

# Import source modules
from app.services.newsapi_client import search_newsapi_everything
from app.services.gnews_api import search_gnews
from app.services.rss_fetcher import search_rss_by_keyword
from app.services.reddit_api import search_reddit_posts

# ───────────────────────────────────────────────
# DEMO DATASET (fallback when all APIs fail/rate-limited)
# ───────────────────────────────────────────────
DEMO_CLAIMS = {
    "climate change is real": {
        "status": "corroborated",
        "sources": [
            {"name": "NASA Climate", "url": "https://climate.nasa.gov", "date": "2024-01-15", "relevance": 95, "source_type": "demo"},
            {"name": "IPCC Report", "url": "https://www.ipcc.ch", "date": "2023-08-20", "relevance": 98, "source_type": "demo"},
            {"name": "Reuters", "url": "https://reuters.com", "date": "2024-03-10", "relevance": 85, "source_type": "demo"}
        ],
        "confidence": "Strongly corroborated by multiple independent sources",
        "reasoning": "Multiple peer-reviewed scientific organizations and international bodies confirm this claim."
    },
    "vaccines cause autism": {
        "status": "contradicted",
        "sources": [
            {"name": "CDC", "url": "https://cdc.gov", "date": "2024-02-01", "relevance": 95, "source_type": "demo"},
            {"name": "WHO", "url": "https://who.int", "date": "2023-11-15", "relevance": 92, "source_type": "demo"},
            {"name": "The Lancet", "url": "https://thelancet.com", "date": "2020-06-01", "relevance": 90, "source_type": "demo"}
        ],
        "confidence": "Contradicted by credible sources",
        "reasoning": "Extensive large-scale studies have found no link between vaccines and autism. The original 1998 study suggesting a link was retracted and its author lost his medical license."
    },
    "aliens landed in nevada": {
        "status": "unverified",
        "sources": [
            {"name": "Snopes", "url": "https://snopes.com", "date": "2024-01-20", "relevance": 70, "source_type": "demo"}
        ],
        "confidence": "Insufficient verified evidence",
        "reasoning": "No credible evidence or documentation from reliable sources. Claims appear to originate from unverified social media posts."
    },
    "the earth is flat": {
        "status": "contradicted",
        "sources": [
            {"name": "NASA", "url": "https://nasa.gov", "date": "2024-01-01", "relevance": 99, "source_type": "demo"},
            {"name": "National Geographic", "url": "https://nationalgeographic.com", "date": "2023-12-01", "relevance": 90, "source_type": "demo"}
        ],
        "confidence": "Contradicted by credible sources",
        "reasoning": "Centuries of scientific observation, satellite imagery, and physics confirm Earth is an oblate spheroid."
    },
    "drinking lemon water cures cancer": {
        "status": "contradicted",
        "sources": [
            {"name": "American Cancer Society", "url": "https://cancer.org", "date": "2024-02-15", "relevance": 95, "source_type": "demo"},
            {"name": "Mayo Clinic", "url": "https://mayoclinic.org", "date": "2024-01-20", "relevance": 92, "source_type": "demo"}
        ],
        "confidence": "Contradicted by credible sources",
        "reasoning": "No scientific evidence supports lemon water as a cancer cure. While hydration is healthy, it cannot replace medical treatment."
    },
    "5g causes health problems": {
        "status": "contradicted",
        "sources": [
            {"name": "WHO", "url": "https://who.int", "date": "2024-03-01", "relevance": 94, "source_type": "demo"},
            {"name": "FDA", "url": "https://fda.gov", "date": "2024-02-10", "relevance": 93, "source_type": "demo"}
        ],
        "confidence": "Contradicted by credible sources",
        "reasoning": "Extensive research shows 5G networks operate within safe radiation limits. No credible evidence links 5G to health problems."
    }
}

# ───────────────────────────────────────────────
# CLAIM EXTRACTION
# ───────────────────────────────────────────────

def extract_claims(text: str) -> List[str]:
    """Extract factual claims from text using simple sentence-level NLP."""
    if not text:
        return []

    # Clean text
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'#\w+', '', text)

    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())

    claims = []
    for sent in sentences:
        sent = sent.strip()
        if len(sent) < 20 or len(sent) > 300:
            continue
        # Skip questions, exclamations, and non-claim sentences
        if sent[-1] not in '.':
            continue
        # Skip sentences that are clearly not claims
        skip_starts = ("i think", "i believe", "in my opinion", "maybe", "perhaps", "supposedly")
        if any(sent.lower().startswith(s) for s in skip_starts):
            continue
        claims.append(sent)

    return claims[:5]


def get_cache_key(text: str) -> str:
    """Generate Redis cache key for a claim query."""
    return f"claim:{hashlib.md5(text.lower().encode()).hexdigest()}"


# ───────────────────────────────────────────────
# HEURISTIC STATUS CLASSIFICATION
# ───────────────────────────────────────────────

def classify_claim_status(sources: List[Dict], claim_text: str) -> Dict[str, Any]:
    """Classify claim based on source analysis."""
    if not sources:
        return {
            "status": "unverified",
            "confidence": "Insufficient verified evidence",
            "reasoning": "No sources found. ATHENA could not locate corroborating or contradicting evidence from available databases."
        }

    # Count source types
    news_sources = [s for s in sources if s.get("source_type") in ("newsapi", "gnews", "rss")]
    reddit_sources = [s for s in sources if s.get("source_type") == "reddit"]
    demo_sources = [s for s in sources if s.get("source_type") == "demo"]

    # Check for contradiction keywords in titles
    contradiction_keywords = [
        "false", "fake", "debunked", "misleading", "no evidence", "contradicts",
        "fact-check", "fact check", "hoax", "disproven", "inaccurate", "wrong"
    ]
    corroboration_keywords = [
        "confirmed", "study finds", "research shows", "evidence supports", "true",
        "verified", "proven", "scientists confirm", "report confirms"
    ]

    all_titles = " ".join([s.get("title", "").lower() for s in sources])

    contra_count = sum(1 for kw in contradiction_keywords if kw in all_titles)
    corro_count = sum(1 for kw in corroboration_keywords if kw in all_titles)

    # Determine status
    if contra_count > corro_count and contra_count >= 1:
        status = "contradicted"
        confidence = "Contradicted by credible sources"
        reasoning = f"Found {contra_count} source(s) contradicting this claim vs {corro_count} supporting it. Cross-reference with primary sources for full verification."
    elif corro_count > contra_count and corro_count >= 1:
        status = "corroborated"
        confidence = "Partially corroborated"
        reasoning = f"Found {corro_count} source(s) supporting this claim. Note: Initial corroboration does not equal definitive proof. Always verify primary sources."
    else:
        status = "unverified"
        confidence = "Insufficient verified evidence"
        reasoning = "Sources found but no clear corroboration or contradiction. The claim requires further investigation with primary sources."

    # Boost confidence if multiple high-reliability news sources agree
    high_rel_sources = [s for s in news_sources if s.get("relevance", 0) >= 80]
    if len(high_rel_sources) >= 3 and status == "corroborated":
        confidence = "Strongly corroborated by multiple independent sources"
        reasoning = f"Multiple high-credibility news sources ({len(high_rel_sources)}) independently corroborate this claim."

    return {
        "status": status,
        "confidence": confidence,
        "reasoning": reasoning + " ATHENA does not deliver binary verdicts — it surfaces evidence for your investigation."
    }


# ───────────────────────────────────────────────
# MAIN CLAIM CHECKER
# ───────────────────────────────────────────────

async def check_claim(text: str, url: Optional[str] = None) -> Dict[str, Any]:
    """
    Check a claim against multiple sources with caching.
    Priority: Cache → Demo Dataset → NewsAPI → GNews → RSS → Reddit → Fallback
    """
    redis = get_redis()
    settings = get_settings()

    # Check cache first
    cache_key = get_cache_key(text)
    cached = await redis.get(cache_key)
    if cached:
        cached["cached"] = True
        cached["sources_queried"] = cached.get("sources_queried", 0)
        return cached

    # Extract claims
    claims = extract_claims(text)
    if not claims and url:
        claims = [f"Claim from URL: {url}"]
    if not claims:
        claims = [text[:200]]

    results = []
    total_sources_queried = 0
    api_errors = []

    for claim in claims:
        claim_lower = claim.lower()
        all_sources = []

        # ── Step 1: Demo Dataset Match ──
        demo_match = None
        for demo_key, demo_val in DEMO_CLAIMS.items():
            if demo_key in claim_lower:
                demo_match = demo_val
                break

        if demo_match:
            all_sources.extend(demo_val["sources"])
            total_sources_queried += len(demo_val["sources"])

        # ── Step 2: NewsAPI ──
        if settings.NEWSAPI_KEY:
            try:
                news_sources = await search_newsapi_everything(claim, settings.NEWSAPI_KEY, page_size=5)
                if news_sources and not any(s.get("rate_limited") for s in news_sources):
                    all_sources.extend(news_sources)
                    total_sources_queried += len(news_sources)
            except Exception as e:
                api_errors.append(f"NewsAPI: {str(e)}")

        # ── Step 3: GNews Fallback ──
        if settings.GNEWS_KEY and len([s for s in all_sources if s.get("source_type") in ("newsapi", "rss")]) < 3:
            try:
                gnews_sources = await search_gnews(claim, settings.GNEWS_KEY, max_results=5)
                if gnews_sources:
                    all_sources.extend(gnews_sources)
                    total_sources_queried += len(gnews_sources)
            except Exception as e:
                api_errors.append(f"GNews: {str(e)}")

        # ── Step 4: RSS Feeds ──
        if len([s for s in all_sources if s.get("source_type") in ("newsapi", "gnews", "rss")]) < 3:
            try:
                rss_sources = await search_rss_by_keyword(claim)
                if rss_sources:
                    all_sources.extend(rss_sources)
                    total_sources_queried += len(rss_sources)
            except Exception as e:
                api_errors.append(f"RSS: {str(e)}")

        # ── Step 5: Reddit (community discussion) ──
        try:
            reddit_sources = await search_reddit_posts(claim, limit=5)
            # Mark Reddit as lower reliability but include for perspective
            for rs in reddit_sources:
                rs["relevance"] = max(30, rs.get("relevance", 50) - 20)
                rs["note"] = "Community discussion — not a primary source"
            all_sources.extend(reddit_sources)
            total_sources_queried += len(reddit_sources)
        except Exception as e:
            api_errors.append(f"Reddit: {str(e)}")

        # ── Step 6: Classify ──
        classification = classify_claim_status(all_sources, claim)

        # Deduplicate sources by URL
        seen_urls = set()
        unique_sources = []
        for s in all_sources:
            url_key = s.get("url", "") or s.get("title", "")
            if url_key and url_key not in seen_urls:
                seen_urls.add(url_key)
                unique_sources.append(s)

        results.append({
            "claim_text": claim,
            "status": classification["status"],
            "sources": unique_sources[:10],  # Cap at 10 sources
            "confidence": classification["confidence"],
            "reasoning": classification["reasoning"],
            "api_errors": api_errors if not unique_sources else []
        })

    response = {
        "claims": results,
        "cached": False,
        "sources_queried": total_sources_queried,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Cache for 2 hours (3600 * 2)
    await redis.set(cache_key, response, ttl_seconds=7200)
    return response
