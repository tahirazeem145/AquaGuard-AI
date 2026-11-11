from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    fish_analysis,
    water_quality,
    pond_assessment,
    ponds
)

api_router = APIRouter()

api_router.include_router(
    fish_analysis.router,
    tags=["1. Visual Fish Diagnostics"]
)

api_router.include_router(
    water_quality.router,
    tags=["2. Water Quality Telemetry"]
)

api_router.include_router(
    pond_assessment.router,
    tags=["3. Multimodal Risk Assessment"]
)

api_router.include_router(
    ponds.router,
    tags=["4. Farm Ponds & Demo Scenarios"]
)

