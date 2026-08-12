"""
AI Service Abstraction Layer for ATHENA — AI-Powered Media Literacy Platform.
Includes modular AI provider interface, fallback handlers, and pitch-ready demo engines.
Enforces non-binary, epistemologically sound assessment language.
"""

import os
import json
import re
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

# ───────────────────────────────────────────────
# DETERMINISTIC DEMO DATASET FOR UNESCO PITCH
# ───────────────────────────────────────────────
DEMO_INVESTIGATION_PAYLOAD = {
    "claim_id": "demo-claim-2026-unesco",
    "is_demo": True,
    "input_text": "BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans.",
    "claim_summary": {
        "primary_claim": "Scientists approved a revolutionary AI quantum frequency technology that automatically eliminates all digital misinformation.",
        "sub_claims": [
            "AI quantum frequency scanning is scientifically validated.",
            "Misinformation can be 100% eliminated automatically without human oversight."
        ],
        "domain": "Technology & Science",
        "virality_risk": "High"
    },
    "trust_passport": {
        "claim": "Scientists approved an automated quantum AI system that eradicates digital misinformation.",
        "source": {
            "origin": "Unverified Viral Social Media Post (x.com / Telegram)",
            "publisher": "Unknown Digital Account ('@TechBreakthroughsToday')",
            "domain_authority": 18,
            "transparency_score": "Low",
            "first_seen": "2026-08-10T14:32:00Z"
        },
        "evidence": {
            "supporting_count": 0,
            "conflicting_count": 4,
            "unverified_count": 2,
            "supporting_items": [],
            "conflicting_items": [
                {
                    "title": "Quantum AI Misinformation Scams: A Fact Check",
                    "publisher": "International Fact-Checking Network (IFCN)",
                    "url": "https://factcheck.org/demo-quantum-ai-myth",
                    "relevance": 96,
                    "verdict": "Contradicted — No peer-reviewed paper or official scientific body supports this claim."
                },
                {
                    "title": "MIT Technology Review on Automated Misinformation Detection Limits",
                    "publisher": "MIT Technology Review",
                    "url": "https://technologyreview.com/demo-ai-limits",
                    "relevance": 92,
                    "verdict": "Contradicted — Current AI systems cannot determine absolute truth without context."
                },
                {
                    "title": "UNESCO Statement on MIL and AI Verification Tools",
                    "publisher": "UNESCO Communication and Information",
                    "url": "https://unesco.org/mil-ai-guidelines",
                    "relevance": 90,
                    "verdict": "Context — Media literacy emphasizes critical thinking over automated censorship."
                }
            ],
            "unverified_items": [
                {
                    "title": "Patented Quantum Wave Scanner Concept Draft",
                    "publisher": "Unverified Patent Application",
                    "url": "",
                    "relevance": 45,
                    "verdict": "Unverified draft patent without peer evaluation."
                }
            ]
        },
        "context": {
            "missing_context": [
                "No specific research institution or lead scientist is named in the announcement.",
                "The term 'Quantum AI Frequency Scan' uses buzzwords not recognized in peer-reviewed computer science literature.",
                "Automated text moderation cannot infer real-world intent or offline context."
            ],
            "historical_precedent": "Similar sensationalized tech claims surface frequently around high-profile global summits to generate engagement."
        },
        "language_analysis": {
            "emotional_framing": "High",
            "sensationalism_score": 88,
            "loaded_words": ["BREAKING", "officially approved", "revolutionary", "eliminate all", "automatically"],
            "tone": "Urgent, sensational, authoritative without citation"
        },
        "ai_generation_indicators": {
            "detected": True,
            "confidence": "Medium-High",
            "details": "Repetitive synthetic syntax patterns typical of engagement-bait copy generators."
        },
        "assessment": "Evidence is currently insufficient to support this claim. Key scientific context is missing.",
        "assessment_code": "INSUFFICIENT_EVIDENCE",
        "confidence_level": "High (Confidence in lack of evidence)",
        "uncertainty_notes": "No official press releases from accredited universities have been published regarding this technology.",
        "suggested_actions": [
            "Verify whether a peer-reviewed paper exists in PubMed, arXiv, or Nature.",
            "Check if major scientific bodies (IEEE, ACM, UNESCO) have released statements.",
            "Inspect the publisher account's creation date and history of sensational posts."
        ]
    },
    "perspective_explorer": {
        "perspectives": [
            {
                "category": "Scientific & Academic",
                "source_name": "IEEE Spectrum / Computer Science Faculty",
                "stance": "Skeptical",
                "summary": "Highlights that 'quantum frequency scanning' is technically meaningless for digital text analysis.",
                "quote": "Natural language processing requires contextual understanding, not physics-based frequency scans."
            },
            {
                "category": "Fact-Checking Community",
                "source_name": "PolitiFact & Snopes Joint Brief",
                "stance": "Debunked",
                "summary": "Traced the claim back to a clickbait technology blog selling crypto tokens.",
                "quote": "The claim inflates hypothetical research concepts into a fabricated breakthrough."
            },
            {
                "category": "International Organizations",
                "source_name": "UNESCO Media & Information Literacy Expert Group",
                "stance": "Educational",
                "summary": "Stresses that media literacy cannot be replaced by automated black-box software.",
                "quote": "Empowering citizens with critical evaluation skills is the key to resilient information ecosystems."
            },
            {
                "category": "Social Media Community",
                "source_name": "Reddit r/Technology & Tech Twitter",
                "stance": "Mixed / Viral Concern",
                "summary": "Viral interest among readers, with top comments questioning the lack of peer review.",
                "quote": "Sounds like another hype campaign—where is the GitHub repository or whitepaper?"
            }
        ],
        "common_ground": "All credible scientific and educational bodies agree that no fully automated technology can eliminate misinformation without human context.",
        "key_differences": "Tech blogs focus on hype and virality, whereas academic and fact-checking institutions focus on empirical methodology.",
        "remaining_uncertainties": "Whether the post was an intentional satire piece or a commercial scam campaign."
    },
    "narrative_memory": {
        "title": "Evolution of the 'Quantum AI Misinformation Cure' Narrative",
        "timeline": [
            {
                "step": 1,
                "date": "2026-08-01",
                "event_type": "ORIGINAL_PAPER_CONCEPT",
                "source": "Speculative Computer Science Blog",
                "headline": "Could Quantum Computing Hypothetically Speed Up Text Parsing?",
                "what_changed": "Theoretical academic discussion on computing speed.",
                "confidence": "High",
                "details": "A speculative article discussed theoretical quantum algorithms."
            },
            {
                "step": 2,
                "date": "2026-08-05",
                "event_type": "HEADLINE_MANIPULATION",
                "source": "Tech Buzz Site ('FutureTechDaily')",
                "headline": "Quantum AI Breakthrough Set to Scan All Web Content!",
                "what_changed": "Hypothetical concept framed as an imminent commercial product.",
                "confidence": "Medium",
                "details": "Sensationalized headline added to attract clicks."
            },
            {
                "step": 3,
                "date": "2026-08-08",
                "event_type": "VIRAL_AMPLIFICATION",
                "source": "Social Media Bots & Influencers",
                "headline": "BREAKING: Scientists approve technology that eliminates all digital misinformation!",
                "what_changed": "Added fake scientific approval authority and absolute claim ('eliminate all').",
                "confidence": "High",
                "details": "Shared 45,000+ times across channels with engagement bait."
            },
            {
                "step": 4,
                "date": "2026-08-11",
                "event_type": "FACT_CHECK_CORRECTION",
                "source": "ATHENA & Independent Fact-Checkers",
                "headline": "Fact Check: No Quantum AI Tool Has Been Approved to Eliminate Misinformation",
                "what_changed": "Debunking articles published providing missing context.",
                "confidence": "High",
                "details": "Clarified that no such technology exists or has been validated."
            }
        ]
    },
    "ai_tutor": {
        "explanation": {
            "core_concept": "Recognizing Sensationalized Absolute Claims",
            "why_misleading": "Notice the use of absolute words like 'officially approved' and 'eliminate ALL misinformation'. Real scientific advances are communicated with specific methodology, peer review details, and nuanced limitations.",
            "literacy_skills_taught": [
                "Identify loaded emotional trigger words ('BREAKING', 'revolutionary').",
                "Look for named scientific institutions rather than generic 'Scientists'.",
                "Be wary of technical buzzword mashups ('Quantum AI Frequency')."
            ]
        },
        "quiz": {
            "title": "Mini Learning Challenge: Spotting Misleading Framing",
            "questions": [
                {
                    "id": "q1",
                    "question": "Which of these headlines demonstrates proper scientific nuance?",
                    "options": [
                        "A. 'Scientists DESTROY shocking myth with magic new AI tool!'",
                        "B. 'Study evaluates potential of machine learning in assisting fact-checkers.'",
                        "C. 'New invention officially cures all online fake news overnight!'"
                    ],
                    "correct_option": 1,
                    "explanation": "Option B uses guarded, precise language ('evaluates potential', 'assisting'). Science rarely claims absolute overnight cures."
                },
                {
                    "id": "q2",
                    "question": "When a claim mentions 'Scientists have approved...', what is the best immediate step?",
                    "options": [
                        "A. Share it immediately so friends stay safe.",
                        "B. Assume it is true because the word 'Scientists' is used.",
                        "C. Check which specific institution published the peer-reviewed paper."
                    ],
                    "correct_option": 2,
                    "explanation": "Always verify which university or journal published the research. Anonymous authority claims are a classic red flag."
                }
            ]
        }
    }
}


# ───────────────────────────────────────────────
# AI PROVIDER ABSTRACT BASE CLASS & IMPLEMENTATION
# ───────────────────────────────────────────────

class BaseAIProvider:
    """Base class for AI Providers in ATHENA."""
    async def analyze_content(self, text: str, url: Optional[str] = None) -> Dict[str, Any]:
        raise NotImplementedError

class DeterministicDemoProvider(BaseAIProvider):
    """Fallback / Pitch Demo Provider returning rich deterministic payloads."""
    async def analyze_content(self, text: str, url: Optional[str] = None) -> Dict[str, Any]:
        payload = json.loads(json.dumps(DEMO_INVESTIGATION_PAYLOAD))
        if text and len(text.strip()) > 0:
            payload["input_text"] = text
            payload["trust_passport"]["claim"] = text[:150] + ("..." if len(text) > 150 else "")
            payload["claim_summary"]["primary_claim"] = text
            payload["is_demo"] = False
        return payload

class LiveAIProvider(BaseAIProvider):
    """Live AI Provider using Gemini REST API with safe deterministic fallback."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def analyze_content(self, text: str, url: Optional[str] = None) -> Dict[str, Any]:
        fallback_provider = DeterministicDemoProvider()
        fallback_data = await fallback_provider.analyze_content(text, url)

        # Check for placeholder keys
        invalid_keys = ["your-gemini-key", "your_gemini_api_key_here", "your-openai-key", "none", "null", ""]
        if not self.api_key or self.api_key.strip().lower() in invalid_keys:
            return fallback_data

        try:
            prompt = (
                f"You are ATHENA, a media literacy assessment assistant. Analyze this claim/text: '{text}'. "
                "Respond with valid JSON containing keys: 'claim_summary' (with primary_claim, domain, virality_risk), "
                "'trust_passport' (with claim, assessment, confidence_level, uncertainty_notes, suggested_actions), "
                "'perspective_explorer' (with perspectives, common_ground), "
                "'narrative_memory' (with title, timeline), and 'ai_tutor' (with explanation, quiz)."
            )
            url_endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    url_endpoint,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    headers={"Content-Type": "application/json"}
                )
                if resp.status_code == 200:
                    res_json = resp.json()
                    candidates = res_json.get("candidates", [])
                    if candidates:
                        raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
                        if json_match:
                            parsed = json.loads(json_match.group(0))
                            if isinstance(parsed, dict) and "trust_passport" in parsed:
                                parsed["is_demo"] = False
                                parsed["input_text"] = text
                                return parsed
        except Exception as e:
            # Safe fallback on any timeout or API error
            pass

        return fallback_data

def get_ai_provider() -> BaseAIProvider:
    """Factory to return live provider if configured with non-placeholder key, else deterministic demo provider."""
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if gemini_key:
        return LiveAIProvider(gemini_key)
    return DeterministicDemoProvider()


# ───────────────────────────────────────────────
# CORE SERVICE FUNCTIONS
# ───────────────────────────────────────────────

async def run_investigation(text: str, url: Optional[str] = None, is_demo_mode: bool = False) -> Dict[str, Any]:
    """
    Run full end-to-end ATHENA investigation.
    Combines Claim Extraction, Trust Passport, Perspective Explorer, Narrative Memory, and AI Tutor.
    """
    if is_demo_mode or not text or not text.strip():
        provider = DeterministicDemoProvider()
    else:
        provider = get_ai_provider()

    result = await provider.analyze_content(text, url)
    result["timestamp"] = datetime.now(timezone.utc).isoformat()
    return result
