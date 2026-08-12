from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.source_credibility import score_source
from app.models.schemas import SourceCredibilityResponse

router = APIRouter(prefix="/source", tags=["source"])

class SourceInput(BaseModel):
    url: str

@router.post("/score", response_model=SourceCredibilityResponse)
async def score_source_endpoint(input_data: SourceInput):
    """Score source credibility based on public bias datasets and heuristics."""
    try:
        if not input_data.url:
            raise HTTPException(status_code=400, detail="URL is required")

        result = score_source(input_data.url)
        return SourceCredibilityResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dataset")
async def get_dataset():
    """Return the credibility dataset for transparency."""
    from app.services.source_credibility import CREDIBILITY_DATASET
    return {
        "sources": len(CREDIBILITY_DATASET),
        "dataset": CREDIBILITY_DATASET,
        "note": "This dataset is built from public Ad Fontes Media-style categorizations. It is not scraped from paid data.",
        "methodology": "Sources are rated on bias (Left/Center/Right) and reliability (0-100) based on publicly available media bias charts."
    }

@router.get("/categories")
async def get_bias_categories():
    """Get all bias categories and their descriptions."""
    return {
        "categories": {
            "Left": "Sources with a left-leaning editorial perspective",
            "Center-Left": "Sources with a slight left lean but generally factual",
            "Center": "Sources with minimal bias, high factual reporting",
            "Center-Right": "Sources with a slight right lean but generally factual",
            "Right": "Sources with a right-leaning editorial perspective",
            "Mixed": "Sources with mixed bias or user-generated content",
            "Unknown": "Sources not yet categorized"
        },
        "reliability_scale": {
            "90-100": "Very High — Excellent factual reporting",
            "80-89": "High — Mostly factual with minor errors",
            "70-79": "Good — Generally factual, some opinion mixed",
            "60-69": "Moderate — Mix of factual and opinion",
            "50-59": "Mixed — Significant opinion or unverified claims",
            "40-49": "Low — Frequent factual errors or bias",
            "30-39": "Very Low — Unreliable, frequent misinformation",
            "0-29": "Extremely Low — Known for disinformation"
        }
    }
