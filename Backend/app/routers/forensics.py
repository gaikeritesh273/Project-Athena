from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.forensics import generate_forensics_report
from app.utils.redis_client import get_redis
import hashlib

router = APIRouter(prefix="/forensics", tags=["forensics"])

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Analyze an image for manipulation indicators (ELA, metadata, compression)."""
    try:
        allowed_types = {"image/jpeg", "image/png", "image/jpg", "image/webp", "image/bmp"}
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WEBP, BMP"
            )

        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

        # Check cache
        file_hash = hashlib.sha256(contents).hexdigest()
        cache_key = f"forensics:{file_hash}"
        redis = get_redis()
        cached = await redis.get(cache_key)
        if cached:
            cached["cached"] = True
            return cached

        report = generate_forensics_report(contents, filename=file.filename)
        report["cached"] = False

        # Cache for 24 hours
        await redis.set(cache_key, report, ttl_seconds=86400)

        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def forensics_health():
    """Check forensics service health."""
    return {
        "status": "healthy",
        "service": "forensics",
        "methods": ["metadata_extraction", "ela_analysis", "compression_check"],
        "supported_formats": ["JPEG", "PNG", "WEBP", "BMP"]
    }
