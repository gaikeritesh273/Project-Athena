import re
from typing import List, Dict, Any

# Emotional/loaded language dictionaries
EMOTIONAL_TRIGGERS = {
    "fear": ["terrifying", "horrifying", "shocking", "alarming", "dangerous", "threat", "crisis", "disaster", "catastrophe", "devastating", "nightmare", "deadly", "killer"],
    "outrage": ["outrageous", "disgusting", "appalling", "unbelievable", "ridiculous", "absurd", "scandalous", "atrocity", "shameful", "despicable"],
    "urgency": ["urgent", "immediately", "now", "before it's too late", "act now", "don't wait", "breaking", "just in", "alert", "warning"],
    "superlatives": ["always", "never", "everyone", "nobody", "all", "none", "completely", "totally", "absolutely", "perfect", "worst", "best", "greatest"],
    "dismissive": ["fake news", "hoax", "conspiracy", "propaganda", "mainstream media", "they don't want you to know", "what they won't tell you"]
}

ONE_SIDED_MARKERS = [
    "only", "just", "simply", "obviously", "clearly", "of course", "naturally", "undoubtedly",
    "without question", "everyone knows", "common sense", "no one can deny"
]

MISSING_CONTEXT_MARKERS = [
    "studies show", "researchers say", "experts claim", "some people say", "many believe",
    "it is known", "sources say", "reports indicate"
]

def detect_bias(text: str) -> Dict[str, Any]:
    """Rule-based bias detection with lightweight NLP."""
    text_lower = text.lower()
    flags = []

    # Emotional language detection
    for emotion_type, keywords in EMOTIONAL_TRIGGERS.items():
        for kw in keywords:
            pattern = r'\b' + re.escape(kw) + r'\b'
            for match in re.finditer(pattern, text_lower):
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                context = text[start:end].strip()
                flags.append({
                    "text": context,
                    "flag_type": f"Emotional Trigger ({emotion_type.upper()})",
                    "explanation": f"""The word '{kw}' is a known {emotion_type} trigger that can manipulate reader emotion rather than inform.""",
                    "severity": "high" if emotion_type in ["fear", "outrage"] else "medium"
                })

    # One-sided framing
    for marker in ONE_SIDED_MARKERS:
        pattern = r'\b' + re.escape(marker) + r'\b'
        for match in re.finditer(pattern, text_lower):
            start = max(0, match.start() - 40)
            end = min(len(text), match.end() + 40)
            context = text[start:end].strip()
            flags.append({
                "text": context,
                "flag_type": "One-Sided Framing",
                "explanation": f"""'{marker}' presents a viewpoint as settled fact, shutting down alternative perspectives.""",
                "severity": "medium"
            })

    # Missing context markers
    for marker in MISSING_CONTEXT_MARKERS:
        pattern = r'\b' + re.escape(marker) + r'\b'
        for match in re.finditer(pattern, text_lower):
            start = max(0, match.start() - 40)
            end = min(len(text), match.end() + 40)
            context = text[start:end].strip()
            flags.append({
                "text": context,
                "flag_type": "Missing Context",
                "explanation": f"""'{marker}' cites unnamed sources or vague authority without specific attribution.""",
                "severity": "medium"
            })

    # Calculate scores
    emotional_score = min(100, len([f for f in flags if "Emotional" in f["flag_type"]]) * 10)
    overall_score = min(100, len(flags) * 5)

    # Summary generation
    if overall_score > 60:
        summary = "High bias detected. This text uses strong emotional language and one-sided framing. Read critically and seek alternative sources."
    elif overall_score > 30:
        summary = "Moderate bias indicators found. Some emotional language and framing techniques present. Consider cross-referencing claims."
    else:
        summary = "Low bias detected. The text appears relatively neutral, but always verify claims independently."

    missing_context = [f["text"] for f in flags if "Missing Context" in f["flag_type"]]

    return {
        "flags": flags[:20],  # Cap at 20 flags
        "overall_bias_score": overall_score,
        "summary": summary,
        "emotional_language_score": emotional_score,
        "missing_context_markers": missing_context[:5]
    }
