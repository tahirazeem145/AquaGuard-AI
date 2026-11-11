from typing import List
from fastapi import APIRouter, Query, HTTPException, status
from backend.app.models.schemas import (
    PondSummary,
    PondAssessmentResponse,
    PresetDemoScenario
)
from backend.app.services.supabase_service import supabase_service

router = APIRouter()

@router.get(
    "/ponds",
    response_model=List[PondSummary],
    summary="List Monitored Aquaculture Ponds",
    description="Retrieves operational status, current risk score, species farmed, and active warning counts for all monitored ponds."
)
async def get_all_ponds() -> List[PondSummary]:
    return supabase_service.list_ponds()

@router.get(
    "/ponds/{pond_id}/history",
    response_model=List[PondAssessmentResponse],
    summary="Get Historical Scan Assessments for a Pond",
    description="Returns chronological past scans, risk trends, and visual diagnostic logs for a specific pond."
)
async def get_pond_history(
    pond_id: str,
    limit: int = Query(10, ge=1, le=50, description="Maximum number of historical records to retrieve")
) -> List[PondAssessmentResponse]:
    history = supabase_service.get_pond_history(pond_id, limit=limit)
    return history

@router.get(
    "/demo-presets",
    response_model=List[PresetDemoScenario],
    summary="Retrieve One-Click Demonstration Scenarios",
    description="Returns 3 pre-configured scenarios ('White Spot Outbreak', 'Hypoxia Emergency', 'Optimal Equilibrium') designed for rapid hackathon judge presentations."
)
async def get_demo_scenarios() -> List[PresetDemoScenario]:
    return supabase_service.get_preset_scenarios()

