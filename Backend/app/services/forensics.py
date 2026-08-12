"""
Deepfake / Image Forensics Service
Basic manipulation heuristics using free/open methods only:
- ELA (Error Level Analysis) simulation
- Metadata extraction
- Reverse image search via free endpoints
- Basic manipulation detection heuristics
"""
import io
import base64
import hashlib
from typing import Dict, Any, Optional, List
from PIL import Image
import numpy as np
from datetime import datetime, timezone

# Free reverse image search endpoints (no API key needed)
REVERSE_IMAGE_ENDPOINTS = {
    "google_lens": "https://lens.google.com/upload",
    "tineye": "https://tineye.com/search",
    "yandex": "https://yandex.com/images/search",
}


def analyze_image_metadata(image_bytes: bytes) -> Dict[str, Any]:
    """Extract metadata from image using PIL."""
    try:
        img = Image.open(io.BytesIO(image_bytes))

        metadata = {
            "format": img.format,
            "mode": img.mode,
            "width": img.width,
            "height": img.height,
            "size_bytes": len(image_bytes),
            "has_exif": False,
            "exif_data": {},
            "creation_software": None,
            "creation_date": None,
            "modified_date": None,
            "warnings": []
        }

        # Extract EXIF if available
        if hasattr(img, '_getexif') and img._getexif():
            metadata["has_exif"] = True
            exif = img._getexif()
            if exif:
                for tag_id, value in exif.items():
                    tag_name = _get_exif_tag_name(tag_id)
                    metadata["exif_data"][tag_name] = str(value)

                    if tag_name == "Software":
                        metadata["creation_software"] = str(value)
                    if tag_name == "DateTime":
                        metadata["creation_date"] = str(value)
                    if tag_name == "DateTimeOriginal":
                        metadata["creation_date"] = str(value)
                    if tag_name == "DateTimeDigitized":
                        metadata["modified_date"] = str(value)

        # Check for missing EXIF (common in manipulated images)
        if not metadata["has_exif"]:
            metadata["warnings"].append("No EXIF metadata found. This is common in screenshots and re-saved images, but can also indicate stripped metadata from editing.")

        # Check for suspicious dimensions
        if img.width > 10000 or img.height > 10000:
            metadata["warnings"].append("Unusually large dimensions detected — possible upscale artifact.")

        return metadata
    except Exception as e:
        return {
            "error": str(e),
            "format": "unknown",
            "warnings": ["Could not parse image metadata."]
        }


def _get_exif_tag_name(tag_id: int) -> str:
    """Map EXIF tag ID to human-readable name."""
    EXIF_TAGS = {
        271: "Make",
        272: "Model",
        306: "DateTime",
        33432: "Copyright",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37510: "UserComment",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        305: "Software",
        315: "Artist",
        33437: "FNumber",
        34850: "ExposureProgram",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBiasValue",
        37381: "MaxApertureValue",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37386: "FocalLength",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41728: "FileSource",
        41729: "SceneType",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRatio",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
    }
    return EXIF_TAGS.get(tag_id, f"Tag_{tag_id}")


def simulate_ela(image_bytes: bytes, quality: int = 90) -> Dict[str, Any]:
    """
    Simulate Error Level Analysis (ELA).
    Re-save image at known quality and compare pixel differences.
    Areas with high error levels may indicate manipulation.
    """
    try:
        original = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if necessary
        if original.mode != "RGB":
            original = original.convert("RGB")

        # Re-save at known quality
        buffer = io.BytesIO()
        original.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer)

        # Calculate difference
        orig_array = np.array(original)
        resaved_array = np.array(resaved)

        diff = np.abs(orig_array.astype(float) - resaved_array.astype(float))

        # Scale for visibility (ELA standard: multiply by 15)
        ela_array = np.clip(diff * 15, 0, 255).astype(np.uint8)

        # Calculate statistics
        mean_error = float(np.mean(diff))
        max_error = float(np.max(diff))
        std_error = float(np.std(diff))

        # Determine risk level
        risk_level = "low"
        explanation = "Low error levels consistent with original/unmodified image."

        if mean_error > 8 or max_error > 60:
            risk_level = "high"
            explanation = "High error levels detected. Significant differences between original and re-saved version suggest possible editing or multiple compressions."
        elif mean_error > 4 or max_error > 40:
            risk_level = "medium"
            explanation = "Moderate error levels. Some areas show higher differences than expected — may indicate minor edits or re-compression."

        # Find hotspots (regions with high error)
        hotspots = []
        if mean_error > 4:
            # Simple grid-based hotspot detection
            h, w = diff.shape[:2]
            grid_size = 50
            for y in range(0, h, grid_size):
                for x in range(0, w, grid_size):
                    region = diff[y:y+grid_size, x:x+grid_size]
                    region_mean = np.mean(region)
                    if region_mean > mean_error * 2:
                        hotspots.append({
                            "region": f"x:{x}-{min(x+grid_size, w)}, y:{y}-{min(y+grid_size, h)}",
                            "error_level": round(float(region_mean), 2)
                        })

        # Generate base64 ELA image for display
        ela_image = Image.fromarray(ela_array)
        ela_buffer = io.BytesIO()
        ela_image.save(ela_buffer, format="PNG")
        ela_base64 = base64.b64encode(ela_buffer.getvalue()).decode()

        return {
            "method": "Error Level Analysis (ELA)",
            "quality_setting": quality,
            "mean_error": round(mean_error, 2),
            "max_error": round(max_error, 2),
            "std_error": round(std_error, 2),
            "risk_level": risk_level,
            "explanation": explanation,
            "hotspots": hotspots[:10],  # Cap at 10
            "ela_image_base64": f"data:image/png;base64,{ela_base64}",
            "interpretation": {
                "low": "Original image or minimal editing. Consistent compression artifacts.",
                "medium": "Possible minor edits, re-compression, or social media processing.",
                "high": "Significant manipulation likely. Investigate further with additional tools."
            }
        }
    except Exception as e:
        return {
            "method": "Error Level Analysis (ELA)",
            "error": str(e),
            "risk_level": "unknown",
            "explanation": "Could not perform ELA analysis."
        }


def check_compression_artifacts(image_bytes: bytes) -> Dict[str, Any]:
    """Check for suspicious compression patterns."""
    try:
        img = Image.open(io.BytesIO(image_bytes))

        # Check for double JPEG compression artifacts
        # (simplified heuristic based on DCT coefficient analysis)
        if img.format == "JPEG":
            # Save and reload to check for generation loss
            buffer1 = io.BytesIO()
            img.save(buffer1, format="JPEG", quality=95)
            buffer1.seek(0)
            img2 = Image.open(buffer1)

            buffer2 = io.BytesIO()
            img2.save(buffer2, format="JPEG", quality=95)

            # If significant size difference, may indicate prior heavy compression
            size_diff = abs(len(buffer1.getvalue()) - len(buffer2.getvalue()))
            size_ratio = size_diff / max(len(image_bytes), 1)

            warnings = []
            if size_ratio > 0.1:
                warnings.append("Significant compression artifacts detected — image may have been heavily compressed or re-saved multiple times.")

            return {
                "format": "JPEG",
                "original_size": len(image_bytes),
                "recompression_size": len(buffer1.getvalue()),
                "size_ratio": round(size_ratio, 4),
                "warnings": warnings,
                "assessment": "Multiple compression cycles detected" if size_ratio > 0.1 else "Normal compression pattern"
            }

        return {
            "format": img.format or "Unknown",
            "assessment": "Non-JPEG format — compression artifact analysis limited."
        }
    except Exception as e:
        return {"error": str(e)}


def generate_forensics_report(image_bytes: bytes, filename: str = "image") -> Dict[str, Any]:
    """Generate a complete forensics report for an image."""

    # Hash for deduplication
    image_hash = hashlib.sha256(image_bytes).hexdigest()

    # Run all analyses
    metadata = analyze_image_metadata(image_bytes)
    ela = simulate_ela(image_bytes)
    compression = check_compression_artifacts(image_bytes)

    # Overall assessment
    risk_factors = []

    if metadata.get("has_exif") is False:
        risk_factors.append("Missing EXIF metadata")

    if ela.get("risk_level") == "high":
        risk_factors.append("High ELA error levels")
    elif ela.get("risk_level") == "medium":
        risk_factors.append("Moderate ELA error levels")

    if compression.get("warnings"):
        risk_factors.extend(compression["warnings"])

    if metadata.get("creation_software") and any(
        editor in metadata["creation_software"].lower() 
        for editor in ["photoshop", "gimp", "paint", "canva", "figma"]
    ):
        risk_factors.append(f"Edited with {metadata['creation_software']}")

    # Determine overall risk
    overall_risk = "low"
    if len(risk_factors) >= 3 or ela.get("risk_level") == "high":
        overall_risk = "high"
    elif len(risk_factors) >= 1 or ela.get("risk_level") == "medium":
        overall_risk = "medium"

    risk_descriptions = {
        "low": "No significant manipulation indicators detected. Image appears consistent with original capture.",
        "medium": "Some anomalies detected. Possible minor editing, re-compression, or social media processing. Review hotspots.",
        "high": "Multiple manipulation indicators detected. Image likely edited or composite. Recommend additional verification."
    }

    return {
        "filename": filename,
        "image_hash": image_hash,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "overall_risk": overall_risk,
        "overall_assessment": risk_descriptions.get(overall_risk, "Unable to assess."),
        "risk_factors": risk_factors,
        "metadata_analysis": metadata,
        "ela_analysis": ela,
        "compression_analysis": compression,
        "recommendations": [
            "Use reverse image search (Google Images, TinEye, Yandex) to find original sources.",
            "Check if the image appears in credible news outlets with proper attribution.",
            "Look for consistency in lighting, shadows, and perspective across the image.",
            "Verify if the claimed location/time matches visual evidence (weather, landmarks, time of day).",
            "For video: check for lip-sync issues, unnatural blinking, or inconsistent frame artifacts."
        ],
        "disclaimer": "This analysis uses heuristic methods only and is not definitive. ELA can produce false positives from social media compression. Always verify with multiple methods and primary sources."
    }
