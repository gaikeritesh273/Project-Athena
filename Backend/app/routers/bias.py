from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.bias_detector import detect_bias
from app.models.schemas import BiasDetectorResponse

router = APIRouter(prefix="/bias", tags=["bias"])

class BiasInput(BaseModel):
    text: str

@router.post("/detect", response_model=BiasDetectorResponse)
async def detect_bias_endpoint(input_data: BiasInput):
    """Detect bias in article text using rule-based NLP. Flags emotional triggers, one-sided framing, and missing context."""
    try:
        if not input_data.text or len(input_data.text) < 20:
            raise HTTPException(status_code=400, detail="Text must be at least 20 characters")

        result = detect_bias(input_data.text)
        return BiasDetectorResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/flags-reference")
async def get_flags_reference():
    """Get reference for all bias flags and their meanings."""
    return {
        "emotional_triggers": {
            "fear": "Words that induce anxiety or panic (terrifying, shocking, deadly)",
            "outrage": "Words designed to provoke anger (outrageous, disgusting, scandalous)",
            "urgency": "Time-pressure language (act now, before it's too late, breaking)",
            "superlatives": "Absolute language (always, never, everyone, completely)",
            "dismissive": "Language that dismisses opposing views (fake news, hoax, propaganda)"
        },
        "one_sided_framing": "Presents opinion as settled fact using phrases like 'obviously', 'everyone knows'",
        "missing_context": "Cites unnamed studies or vague authorities without specific attribution",
        "severity_levels": {
            "low": "Minor indicator — worth noting but not decisive",
            "medium": "Moderate concern — suggests potential bias",
            "high": "Strong indicator — significant manipulation likely"
        }
    }
