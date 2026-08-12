import json
import re
from typing import Dict, Any, Optional
from urllib.parse import urlparse

# Static dataset from public Ad Fontes-style categorization
CREDIBILITY_DATASET = {
    "bbc.com": {"bias": "Center", "reliability": 95, "factuality": "High", "has_byline": True, "has_corrections": True},
    "reuters.com": {"bias": "Center", "reliability": 96, "factuality": "High", "has_byline": True, "has_corrections": True},
    "apnews.com": {"bias": "Center", "reliability": 97, "factuality": "High", "has_byline": True, "has_corrections": True},
    "npr.org": {"bias": "Center-Left", "reliability": 90, "factuality": "High", "has_byline": True, "has_corrections": True},
    "theguardian.com": {"bias": "Left", "reliability": 88, "factuality": "High", "has_byline": True, "has_corrections": True},
    "wsj.com": {"bias": "Center-Right", "reliability": 92, "factuality": "High", "has_byline": True, "has_corrections": True},
    "nytimes.com": {"bias": "Center-Left", "reliability": 90, "factuality": "High", "has_byline": True, "has_corrections": True},
    "washingtonpost.com": {"bias": "Center-Left", "reliability": 89, "factuality": "High", "has_byline": True, "has_corrections": True},
    "foxnews.com": {"bias": "Right", "reliability": 65, "factuality": "Mixed", "has_byline": True, "has_corrections": True},
    "cnn.com": {"bias": "Center-Left", "reliability": 82, "factuality": "High", "has_byline": True, "has_corrections": True},
    "breitbart.com": {"bias": "Right", "reliability": 35, "factuality": "Low", "has_byline": True, "has_corrections": False},
    "infowars.com": {"bias": "Right", "reliability": 15, "factuality": "Very Low", "has_byline": False, "has_corrections": False},
    "naturalnews.com": {"bias": "Right", "reliability": 20, "factuality": "Very Low", "has_byline": False, "has_corrections": False},
    "snopes.com": {"bias": "Center", "reliability": 85, "factuality": "High", "has_byline": True, "has_corrections": True},
    "factcheck.org": {"bias": "Center", "reliability": 95, "factuality": "High", "has_byline": True, "has_corrections": True},
    "politifact.com": {"bias": "Center", "reliability": 92, "factuality": "High", "has_byline": True, "has_corrections": True},
    "theverge.com": {"bias": "Center-Left", "reliability": 85, "factuality": "High", "has_byline": True, "has_corrections": True},
    "techcrunch.com": {"bias": "Center", "reliability": 80, "factuality": "High", "has_byline": True, "has_corrections": True},
    "medium.com": {"bias": "Mixed", "reliability": 50, "factuality": "Mixed", "has_byline": True, "has_corrections": False},
    "substack.com": {"bias": "Mixed", "reliability": 50, "factuality": "Mixed", "has_byline": True, "has_corrections": False},
    "youtube.com": {"bias": "Mixed", "reliability": 40, "factuality": "Mixed", "has_byline": False, "has_corrections": False},
    "twitter.com": {"bias": "Mixed", "reliability": 30, "factuality": "Mixed", "has_byline": False, "has_corrections": False},
    "x.com": {"bias": "Mixed", "reliability": 30, "factuality": "Mixed", "has_byline": False, "has_corrections": False},
    "facebook.com": {"bias": "Mixed", "reliability": 25, "factuality": "Mixed", "has_byline": False, "has_corrections": False},
    "tiktok.com": {"bias": "Mixed", "reliability": 20, "factuality": "Mixed", "has_byline": False, "has_corrections": False},
}


def extract_domain(url: str) -> str:
    """Extract domain from URL."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    # Remove www.
    if domain.startswith("www."):
        domain = domain[4:]
    return domain


def score_source(url: str) -> Dict[str, Any]:
    """Score a source's credibility."""
    domain = extract_domain(url)

    # Try exact domain match
    data = CREDIBILITY_DATASET.get(domain)

    # Try parent domain
    if not data:
        parts = domain.split(".")
        if len(parts) > 2:
            parent = ".".join(parts[-2:])
            data = CREDIBILITY_DATASET.get(parent)

    https = url.startswith("https://")

    if data:
        base_score = data["reliability"]
        breakdown = [
            {"category": "Known Source Reliability", "score": data["reliability"], "explanation": f"""{domain} is rated {data['bias']} bias with {data['factuality']} factuality."""},
            {"category": "HTTPS Security", "score": 10 if https else 0, "explanation": "HTTPS encrypts data in transit." if https else "No HTTPS detected — connection is not encrypted."},
            {"category": "Author Transparency", "score": 10 if data.get("has_byline") else 0, "explanation": "Articles have named authors." if data.get("has_byline") else "No author bylines found."},
            {"category": "Corrections Policy", "score": 10 if data.get("has_corrections") else 0, "explanation": "Publisher has a public corrections policy." if data.get("has_corrections") else "No corrections policy found."},
        ]
        overall = min(100, base_score + (10 if https else 0))
        return {
            "domain": domain,
            "overall_score": overall,
            "breakdown": breakdown,
            "bias_rating": data.get("bias"),
            "factuality_rating": data.get("factuality"),
            "https": https,
            "has_author_byline": data.get("has_byline"),
            "has_corrections_policy": data.get("has_corrections")
        }
    else:
        # Unknown domain — heuristic scoring
        breakdown = [
            {"category": "Known Source Reliability", "score": 30, "explanation": f"""{domain} is not in our database. Unknown sources require extra verification."""},
            {"category": "HTTPS Security", "score": 10 if https else 0, "explanation": "HTTPS encrypts data in transit." if https else "No HTTPS detected."},
            {"category": "Author Transparency", "score": 0, "explanation": "Unable to verify author bylines for unknown domains."},
            {"category": "Corrections Policy", "score": 0, "explanation": "Unable to verify corrections policy for unknown domains."},
        ]
        return {
            "domain": domain,
            "overall_score": 40 if https else 30,
            "breakdown": breakdown,
            "bias_rating": "Unknown",
            "factuality_rating": "Unknown",
            "https": https,
            "has_author_byline": None,
            "has_corrections_policy": None
        }
