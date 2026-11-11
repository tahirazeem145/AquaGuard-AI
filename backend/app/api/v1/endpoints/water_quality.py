from fastapi import APIRouter
from backend.app.models.schemas import WaterQualityTelemetryInput, WaterQualityResponse
from backend.app.services.water_service import water_service

router = APIRouter()

@router.post(
    "/water-quality",
    response_model=WaterQualityResponse,
    summary="Standalone Pond Water Quality Hazard Analysis",
    description="Evaluates physical and chemical water parameters (DO, pH, Temp, Ammonia, Turbidity) against FAO biological standards and detects acute environmental stressors."
)
async def evaluate_water_quality(
    telemetry: WaterQualityTelemetryInput
) -> WaterQualityResponse:
    return water_service.evaluate_telemetry(telemetry)

