from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, computed_field

# ==============================================================================
# Fish Visual Diagnosis Schemas
# ==============================================================================

class FishProbability(BaseModel):
    condition: str = Field(..., description="Name of the fish pathology or healthy status")
    probability: float = Field(..., ge=0.0, le=1.0, description="Softmax confidence probability")

class ImageQualityCheck(BaseModel):
    is_valid: bool = Field(True, description="Whether image meets minimum diagnostic criteria")
    brightness_score: float = Field(..., description="Average luminance value (0-255)")
    contrast_score: float = Field(..., description="Standard deviation of pixel intensities")
    resolution: str = Field(..., description="Width x Height dimensions")
    blur_score: float = Field(..., description="Laplacian variance sharpness metric")
    notice: Optional[str] = Field(None, description="Guidance if image has low lighting or blur")

class FishAnalysisResponse(BaseModel):
    status: str = Field("success", description="Execution status")
    primary_condition: str = Field(..., description="Top-1 diagnosed fish condition")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Top-1 confidence score")
    top_3_differential: List[FishProbability] = Field(..., description="Top-3 differential diagnosis distribution")
    symptoms_identified: List[str] = Field(default_factory=list, description="Observed morphological lesions & patterns")
    image_quality: ImageQualityCheck = Field(..., description="Image lighting and sharpness evaluation")
    analyzed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="UTC timestamp of inference")


# ==============================================================================
# Water Quality Telemetry Schemas
# ==============================================================================

class WaterQualityTelemetryInput(BaseModel):
    dissolved_oxygen_mg_l: float = Field(
        ..., ge=0.0, le=25.0, description="Dissolved Oxygen in mg/L (Critical: <3.5, Lethal: <2.0)"
    )
    ph: float = Field(
        ..., ge=0.0, le=14.0, description="Potential of Hydrogen (Ideal: 6.8 - 8.2, Critical: <6.0 or >9.0)"
    )
    temperature_c: float = Field(
        ..., ge=5.0, le=45.0, description="Water temperature in Celsius (Normal: 24.0 - 30.0)"
    )
    total_ammonia_mg_l: float = Field(
        0.05, ge=0.0, le=10.0, description="Total Ammonia Nitrogen (TAN) in mg/L"
    )
    turbidity_ntu: float = Field(
        25.0, ge=0.0, le=500.0, description="Turbidity in Nephelometric Turbidity Units"
    )

class ParameterCompliance(BaseModel):
    value: float
    unit: str
    status: str = Field(..., description="SAFE, CAUTION, or CRITICAL")
    ideal_range: str
    evaluation_note: str

class WaterQualityResponse(BaseModel):
    status: str = Field(..., description="NORMAL, ADVISORY, WARNING, or EMERGENCY")
    hazard_score: float = Field(..., ge=0.0, le=100.0, description="Normalized environmental hazard (0-100)")
    un_ionized_ammonia_mg_l: float = Field(..., description="Calculated toxic un-ionized ammonia NH3 (mg/L)")
    anomalies_detected: List[str] = Field(default_factory=list, description="List of out-of-range parameter anomalies")
    parameter_compliance: Dict[str, ParameterCompliance] = Field(
        ..., description="Parameter-by-parameter compliance assessment"
    )
    biological_guardrail_triggered: bool = Field(
        False, description="Whether a hard biological limit was breached (e.g. acute hypoxia)"
    )


# ==============================================================================
# Prescriptive Action Item Schema
# ==============================================================================

class PrescriptiveActionItem(BaseModel):
    priority: int = Field(..., description="Action priority order (1 is highest)")
    category: str = Field(..., description="Immediate Biosecurity, Aeration, Water Exchange, Salt Bath, etc.")
    title: str = Field(..., description="Concise action item header")
    instruction: str = Field(..., description="Clear, non-antibiotic operational step")
    dosage_or_metric: Optional[str] = Field(None, description="Quantified rate (e.g. 3 g/L salt, 200 kg/ha lime)")


# ==============================================================================
# Multimodal Unified Assessment Schemas
# ==============================================================================

class CompositeRiskScore(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0, description="Unified Pond Health Risk Score (0-100)")
    severity_tier: str = Field(..., description="NORMAL, ADVISORY, WARNING, or EMERGENCY")
    color_code: str = Field(..., description="Hex color: Green (#10B981), Amber (#F59E0B), Orange (#F97316), Red (#EF4444)")
    status_title: str = Field(..., description="Short status description")
    visual_contribution: float = Field(..., description="Points contribution from visual image classifier")
    environmental_contribution: float = Field(..., description="Points contribution from water hazard engine")
    synergy_bonus: float = Field(..., description="Synergy multiplier added due to matched environmental-pathogen triggers")

    @computed_field
    @property
    def final_score(self) -> float:
        return self.score

    @computed_field
    @property
    def visual_disease_contribution(self) -> float:
        return self.visual_contribution

    @computed_field
    @property
    def environmental_hazard_contribution(self) -> float:
        return self.environmental_contribution

    @computed_field
    @property
    def biological_synergy_penalty(self) -> float:
        return self.synergy_bonus

class SynergyDetails(BaseModel):
    synergy_detected: bool = Field(..., description="Whether a pathogen-environment interaction was triggered")
    bonus_added: float = Field(..., description="Points added to risk score")
    explanation: str = Field(..., description="Biological explanation of the combined threat")

    @computed_field
    @property
    def interaction_penalty(self) -> float:
        return self.bonus_added

class PondAssessmentResponse(BaseModel):
    scan_id: str = Field(..., description="Unique UUID for this scan event")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="UTC timestamp of assessment")
    pond_id: str = Field(..., description="Identifier of the evaluated pond")
    risk_assessment: CompositeRiskScore
    visual_diagnosis: FishAnalysisResponse
    environmental_health: WaterQualityResponse
    synergy_interaction: SynergyDetails
    prescriptive_action_plan: List[PrescriptiveActionItem]
    image_url: Optional[str] = Field(None, description="URL of stored image in Supabase or local cache")

    @computed_field
    @property
    def assessment_id(self) -> str:
        return self.scan_id

    @computed_field
    @property
    def assessed_at(self) -> datetime:
        return self.timestamp

    @computed_field
    @property
    def composite_risk_score(self) -> CompositeRiskScore:
        return self.risk_assessment

    @computed_field
    @property
    def water_quality(self) -> WaterQualityResponse:
        return self.environmental_health

    @computed_field
    @property
    def biological_synergy(self) -> SynergyDetails:
        return self.synergy_interaction


# ==============================================================================
# Farm & Pond Management Schemas
# ==============================================================================

class PondSummary(BaseModel):
    id: str
    name: str
    species_farmed: str
    area_hectares: float
    depth_meters: float
    current_risk_score: float
    status_tier: str
    color_code: str
    last_scanned: datetime
    active_alerts_count: int

class PresetDemoScenario(BaseModel):
    preset_id: str
    title: str
    badge_label: str
    description: str
    telemetry: WaterQualityTelemetryInput
    target_condition: str
    expected_tier: str
    demo_image_name: str

