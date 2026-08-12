"""RSS Feed fetcher for BBC, Reuters, AP, NPR."""
import httpx
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from datetime import datetime
import hashlib

RSS_FEEDS = {
    "bbc": "http://feeds.bbci.co.uk/news/rss.xml",
    "reuters": "https://www.reutersagency.com/feed/?taxonomy=markets&post_type=reuters-best",
    "ap": "https://rsshub.app/apnews/topics/apf-topnews",
    "npr": "https://feeds.npr.org/1001/rss.xml",
}

# Fallback direct feeds that are more reliable
RSS_FEED_URLS = [
    "http://feeds.bbci.co.uk/news/rss.xml",
    "https://feeds.npr.org/1001/rss.xml",
    "https://rss.cnn.com/rss/edition.rss",
    "https://feeds.skynews.com/feeds/rss/home.xml",
]


async def fetch_rss_feed(feed_url: str, timeout: float = 8.0) -> List[Dict[str, Any]]:
    """Fetch and parse a single RSS feed."""
    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            resp = await client.get(feed_url)
            if resp.status_code != 200:
                return []

            root = ET.fromstring(resp.text)
            items = []

            # Handle both RSS 2.0 and Atom formats
            for item in root.iter("item"):
                title = item.findtext("title", default="")
                link = item.findtext("link", default="")
                desc = item.findtext("description", default="")
                pub_date = item.findtext("pubDate", default="")

                if title:
                    items.append({
                        "name": feed_url.split("/")[2].replace("www.", ""),
                        "title": title,
                        "url": link,
                        "snippet": desc[:300] if desc else title,
                        "date": pub_date,
                        "relevance": 75,
                        "source_type": "rss"
                    })

            # Atom format fallback
            if not items:
                ns = {"atom": "http://www.w3.org/2005/Atom"}
                for entry in root.iter("{http://www.w3.org/2005/Atom}entry"):
                    title = entry.findtext("atom:title", default="", namespaces=ns)
                    link_elem = entry.find("atom:link", ns)
                    link = link_elem.get("href") if link_elem is not None else ""
                    summary = entry.findtext("atom:summary", default="", namespaces=ns)
                    updated = entry.findtext("atom:updated", default="", namespaces=ns)

                    if title:
                        items.append({
                            "name": feed_url.split("/")[2].replace("www.", ""),
                            "title": title,
                            "url": link,
                            "snippet": summary[:300] if summary else title,
                            "date": updated,
                            "relevance": 75,
                            "source_type": "rss"
                        })

            return items[:10]
    except Exception:
        return []


async def search_rss_by_keyword(keyword: str) -> List[Dict[str, Any]]:
    """Search all RSS feeds for articles matching a keyword."""
    keyword_lower = keyword.lower()
    all_results = []

    for feed_url in RSS_FEED_URLS:
        items = await fetch_rss_feed(feed_url)
        for item in items:
            text_to_search = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
            if keyword_lower in text_to_search:
                item["relevance"] = 85
                all_results.append(item)

    # Sort by relevance and deduplicate by URL
    seen = set()
    unique = []
    for item in all_results:
        url = item.get("url", "")
        if url and url not in seen:
            seen.add(url)
            unique.append(item)

    return unique[:8]
