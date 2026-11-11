import io
from typing import Optional
from PIL import Image
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from starlette.concurrency import run_in_threadpool

from backend.app.core.security import validate_image_upload, sanitize_filename
from backend.app.models.schemas import FishAnalysisResponse
from backend.app.services.vision_service import vision_service

router = APIRouter()

@router.post(
    "/analyze-fish",
    response_model=FishAnalysisResponse,
    summary="Standalone AI Fish Image Diagnostic Scan",
    description="Upload a photo of a fish (JPEG/PNG) to diagnose external pathologies (White Spot, Fin Rot, Columnaris, Saprolegniasis, Dropsy, EUS) or confirm healthy status."
)
async def analyze_fish_image(
    image: Optional[UploadFile] = File(None, description="Fish photographic image file (max 10 MB)"),
    file: Optional[UploadFile] = File(None, description="Alternative file upload field")
) -> FishAnalysisResponse:
    target_upload = image or file
    if not target_upload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Missing image upload. Please provide an image file in the 'image' or 'file' form field."
        )

    # 1. Validate file format and size
    contents = await target_upload.read()
    validate_image_upload(target_upload.content_type, len(contents))
    
    clean_name = sanitize_filename(target_upload.filename)

    # 2. Decode image safely
    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to decode image file. Please provide a valid JPG, PNG, or WebP photo. Error: {str(e)}"
        )

    # 3. Offload vision pipeline to threadpool (CPU bounded)
    return await run_in_threadpool(vision_service.classify_image, pil_image, clean_name)
