import uuid
from datetime import datetime, timezone
from typing import Tuple

from backend.app.models.schemas import (
    CompositeRiskScore,
    SynergyDetails,
    PondAssessmentResponse,
    FishAnalysisResponse,
    WaterQualityResponse
)
from backend.app.services.advisory_service import advisory_service

class MultimodalRiskFusionService:
    """
    Fuses visual dermatological probabilities with environmental hazard metrics
    and biological synergy multipliers into a single calibrated Pond Health Risk Score (0-100).
    """

    @staticmethod
    def calculate_synergy(
        disease_name: str,
        water_health: WaterQualityResponse,
        do: float,
        temp: float,
        ammonia: float,
        ph: float
    ) -> Tuple[bool, float, str]:
        """
        Determines if specific environmental stressors match the known biological triggers
        for the diagnosed pathogen, adding an interaction penalty.
        """
        bonus = 0.0
        reasons = []

        # Case-insensitive disease matching for both dataset classes and clinical names
        d_lower = disease_name.lower()

        # 1. Columnaris / Bacterial Gill Disease: Explosive virulence in warm, alkaline water
        if ("columnaris" in d_lower or "gill" in d_lower) and temp > 25.5 and ph > 8.0:
            bonus += 20.0
            reasons.append(
                f"Elevated temperature ({temp:.1f} C) and alkaline pH ({ph:.1f}) accelerate "
                "Flavobacterium columnare / gill necrosis gliding motility and connective tissue degradation."
            )

        # 2. Saprolegniasis: Severe immunosuppression in rapid temperature drops
        if ("saprolegniasis" in d_lower or "fungal" in d_lower) and temp < 19.0:
            bonus += 18.0
            reasons.append(
                f"Cold water ({temp:.1f} C) suppresses teleost antibody secretion while "
                "facilitating rapid Saprolegnia zoospore germination on epidermal abrasions."
            )

        # 3. Aeromoniasis / Fin & Tail Rot / White tail: High free ammonia induces gill/fin membrane erosion
        if ("aeromoniasis" in d_lower or "fin" in d_lower or "tail" in d_lower or "rot" in d_lower) and (ammonia > 0.035 or do < 3.5):
            bonus += 25.0
            reasons.append(
                f"Un-ionized ammonia ({ammonia:.4f} mg/L) combined with hypoxia (DO: {do:.2f} mg/L) "
                "causes severe epithelial damage, allowing opportunistic Gram-negative bacteria or necrosis to invade."
            )

        # 4. Parasitic diseases / Ichthyophthiriasis (White Spot): Thermal fluctuations accelerate trophont emergence
        if ("parasitic" in d_lower or "ichthyophthiriasis" in d_lower or "white spot" in d_lower) and (temp < 22.0 or do < 4.0):
            bonus += 16.0
            reasons.append(
                f"Sub-optimal pond conditions (Temp: {temp:.1f} C, DO: {do:.2f} mg/L) "
                "impair gill gas exchange, dramatically worsening White Spot / ciliate parasite lethality."
            )

        # 5. Bacterial Red disease / EUS: Low pH accelerates fungal spore attachment & skin ulceration
        if ("red" in d_lower or "ulcerative" in d_lower or "eus" in d_lower) and ph < 6.8:
            bonus += 20.0
            reasons.append(
                f"Acidic pond water (pH: {ph:.2f}) demineralizes protective scales, enabling "
                "Aphanomyces invadans / Aeromonas hydrophila to penetrate deep into skeletal muscle."
            )

        # 6. Healthy fish in optimal water receives a stabilizing credit
        if "healthy" in d_lower and do >= 5.5 and ammonia < 0.02 and 6.8 <= ph <= 8.2:
            return False, -10.0, "Pond water parameters and fish morphology confirm stable ecosystem equilibrium."

        detected = len(reasons) > 0
        explanation = " ".join(reasons) if detected else "No acute environmental-pathogen synergy detected."
        return detected, round(bonus, 1), explanation

    def assess_pond(
        self,
        pond_id: str,
        visual_diag: FishAnalysisResponse,
        water_health: WaterQualityResponse,
        do_val: float,
        temp_val: float,
        ammonia_val: float,
        ph_val: float,
        image_url: str = None
    ) -> PondAssessmentResponse:
        # Visual Disease Contribution (0 - 100 scale, weighted 0.55)
        # Healthy fish has 0% disease risk
        is_healthy = "Healthy" in visual_diag.primary_condition
        visual_disease_prob = 0.0 if is_healthy else visual_diag.confidence_score
        vis_contrib = visual_disease_prob * 100.0 * 0.55

        # Environmental Contribution (0 - 100 scale, weighted 0.45)
        env_contrib = water_health.hazard_score * 0.45

        # Biological Synergy Modifier
        has_synergy, synergy_bonus, synergy_exp = self.calculate_synergy(
            visual_diag.primary_condition, water_health, do_val, temp_val, ammonia_val, ph_val
        )

        # Composite Pond Health Risk Score
        raw_score = vis_contrib + env_contrib + synergy_bonus
        composite_score = max(0.0, min(100.0, raw_score))

        # Biological guardrail override: Acute hypoxia or lethal ammonia always pushes score to >= 85
        if water_health.biological_guardrail_triggered:
            composite_score = max(85.0, composite_score)

        composite_score = round(float(composite_score), 1)

        # Determine Risk Tier and Visual Styling
        if composite_score >= 80.0:
            severity_tier = "EMERGENCY"
            color_code = "#EF4444"  # Red
            status_title = "Critical Disease Outbreak / Hypoxia Hazard"
        elif composite_score >= 60.0:
            severity_tier = "WARNING"
            color_code = "#F97316"  # Orange
            status_title = "High Risk of Contagion & Biological Stress"
        elif composite_score >= 30.0:
            severity_tier = "ADVISORY"
            color_code = "#F59E0B"  # Amber
            status_title = "Elevated Environmental Stress Detected"
        else:
            severity_tier = "NORMAL"
            color_code = "#10B981"  # Emerald Green
            status_title = "Optimal Pond Health & Normal Immunity"

        risk_obj = CompositeRiskScore(
            score=composite_score,
            severity_tier=severity_tier,
            color_code=color_code,
            status_title=status_title,
            visual_contribution=round(vis_contrib, 1),
            environmental_contribution=round(env_contrib, 1),
            synergy_bonus=round(synergy_bonus, 1)
        )

        synergy_obj = SynergyDetails(
            synergy_detected=has_synergy,
            bonus_added=synergy_bonus,
            explanation=synergy_exp
        )

        action_plan = advisory_service.generate_action_plan(
            visual_diag.primary_condition,
            water_health,
            severity_tier
        )

        scan_uuid = f"scan_{uuid.uuid4().hex[:12]}"

        return PondAssessmentResponse(
            scan_id=scan_uuid,
            timestamp=datetime.now(timezone.utc),
            pond_id=pond_id,
            risk_assessment=risk_obj,
            visual_diagnosis=visual_diag,
            environmental_health=water_health,
            synergy_interaction=synergy_obj,
            prescriptive_action_plan=action_plan,
            image_url=image_url
        )

fusion_service = MultimodalRiskFusionService()

