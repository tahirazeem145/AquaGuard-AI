import io
from typing import Optional
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from starlette.concurrency import run_in_threadpool

from backend.app.core.security import validate_image_upload, sanitize_filename
from backend.app.models.schemas import (
    PondAssessmentResponse,
    WaterQualityTelemetryInput
)
from backend.app.services.vision_service import vision_service
from backend.app.services.water_service import water_service
from backend.app.services.fusion_service import fusion_service
from backend.app.services.supabase_service import supabase_service

router = APIRouter()

@router.post(
    "/assess-pond",
    response_model=PondAssessmentResponse,
    summary="Unified Multimodal Pond Disease Risk Assessment",
    description="Fuses photographic fish lesion diagnosis with real-time pond water telemetry into a single calibrated Pond Health Risk Score (0-100) and actionable non-antibiotic advisory plan."
)
async def assess_pond_health(
    image: Optional[UploadFile] = File(None, description="Photographic image of fish caught during sampling"),
    file: Optional[UploadFile] = File(None, description="Alternative file upload field"),
    pond_id: str = Form("pond_01", description="Identifier of the target pond"),
    dissolved_oxygen_mg_l: float = Form(..., ge=0.0, le=25.0, description="Dissolved Oxygen (mg/L)"),
    ph: float = Form(..., ge=0.0, le=14.0, description="Water pH (0-14)"),
    temperature_c: float = Form(..., ge=5.0, le=45.0, description="Water temperature (Celsius)"),
    total_ammonia_mg_l: float = Form(0.05, ge=0.0, le=10.0, description="Total Ammonia Nitrogen (mg/L)"),
    turbidity_ntu: float = Form(25.0, ge=0.0, le=500.0, description="Water turbidity (NTU)"),
    filename_hint: Optional[str] = Form(None, description="Optional filename or scenario hint")
) -> PondAssessmentResponse:
    target_upload = image or file
    if not target_upload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Missing image upload. Please provide an image file in the 'image' or 'file' form field."
        )

    # 1. Validate image upload
    contents = await target_upload.read()
    validate_image_upload(target_upload.content_type, len(contents))
    clean_name = filename_hint or sanitize_filename(target_upload.filename)

    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to decode image file. Please provide a valid JPG, PNG, or WebP photo. Error: {str(e)}"
        )

    # 2. Package telemetry
    telemetry = WaterQualityTelemetryInput(
        dissolved_oxygen_mg_l=dissolved_oxygen_mg_l,
        ph=ph,
        temperature_c=temperature_c,
        total_ammonia_mg_l=total_ammonia_mg_l,
        turbidity_ntu=turbidity_ntu
    )

    # 3. Offload compute workloads to threadpool
    visual_diag = await run_in_threadpool(vision_service.classify_image, pil_image, clean_name)
    water_health = await run_in_threadpool(water_service.evaluate_telemetry, telemetry)

    # 4. Multimodal Fusion
    assessment = await run_in_threadpool(
        fusion_service.assess_pond,
        pond_id,
        visual_diag,
        water_health,
        dissolved_oxygen_mg_l,
        temperature_c,
        water_health.un_ionized_ammonia_mg_l,
        ph,
        f"/uploads/{clean_name}"
    )

    # 5. Persist record asynchronously
    await run_in_threadpool(supabase_service.save_assessment, assessment)

    return assessment
