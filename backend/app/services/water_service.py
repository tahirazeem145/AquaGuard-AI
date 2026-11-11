import math
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import numpy as np

from backend.app.models.schemas import (
    WaterQualityTelemetryInput,
    WaterQualityResponse,
    ParameterCompliance
)

# Optional Machine Learning Model Loader
try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False


class WaterQualityService:
    """
    Evaluates physicochemical aquaculture pond telemetry.
    Combines Emerson's aqueous ammonia thermodynamics, FAO/ICAR biological safety 
    benchmarks, a fine-tuned Scikit-Learn Random Forest model (water_hazard_rf.pkl),
    and a Tier 1 deterministic biological guardrail engine.
    """

    def __init__(self):
        self.rf_model_path = Path("backend/models_weights/water_hazard_rf.pkl")
        self.rf_regressor = None
        self.rf_classifier = None
        self._load_rf_model()

    def _load_rf_model(self):
        """Loads trained Random Forest regressor & classifier if available."""
        if not JOBLIB_AVAILABLE:
            print("[WaterQualityService] joblib not available; running thermodynamic rule mode.")
            return

        if not self.rf_model_path.exists():
            print(f"[WaterQualityService] Model not found at {self.rf_model_path}; running rule mode.")
            return

        try:
            model_pack = joblib.load(self.rf_model_path)
            self.rf_regressor = model_pack.get("regressor")
            self.rf_classifier = model_pack.get("classifier")
            print(f"[WaterQualityService] Loaded Random Forest model successfully (R2: {model_pack.get('r2_score'):.4f}).")
        except Exception as e:
            print(f"[WaterQualityService] Failed to load Random Forest model ({e}); running rule mode.")

    @staticmethod
    def calculate_unionized_ammonia(tan_mg_l: float, temp_c: float, ph: float) -> float:
        """
        Calculates toxic un-ionized ammonia (NH3) from Total Ammonia Nitrogen (TAN),
        water temperature, and pH using Emerson et al. (1975) thermodynamics.
        """
        temp_kelvin = temp_c + 273.15
        pka = 0.09018 + (2729.92 / temp_kelvin)
        fraction = 1.0 / (10 ** (pka - ph) + 1.0)
        nh3 = tan_mg_l * fraction
        return round(float(nh3), 4)

    def evaluate_telemetry(self, telemetry: WaterQualityTelemetryInput) -> WaterQualityResponse:
        do = telemetry.dissolved_oxygen_mg_l
        ph = telemetry.ph
        temp = telemetry.temperature_c
        tan = telemetry.total_ammonia_mg_l
        turbidity = telemetry.turbidity_ntu

        # 1. Compute toxic un-ionized ammonia via Emerson thermodynamics
        nh3 = self.calculate_unionized_ammonia(tan, temp, ph)

        anomalies: List[str] = []
        compliance: Dict[str, ParameterCompliance] = {}
        penalty_score = 0.0
        guardrail_triggered = False

        # --- Evaluate Dissolved Oxygen (mg/L) ---
        if do < 2.0:
            status = "CRITICAL"
            anomalies.append(f"Acute Hypoxia: Dissolved Oxygen is {do:.2f} mg/L (Lethal threshold is < 2.0 mg/L).")
            penalty_score += 50.0
            guardrail_triggered = True
            note = "Immediate asphyxiation risk for fish stock."
        elif do < 3.5:
            status = "CRITICAL"
            anomalies.append(f"Severe Hypoxia: Dissolved Oxygen is {do:.2f} mg/L (Critical threshold is < 3.5 mg/L).")
            penalty_score += 35.0
            note = "Severe respiratory stress; mucosal immunity suppressed."
        elif do < 5.0:
            status = "CAUTION"
            anomalies.append(f"Sub-optimal Oxygen: Dissolved Oxygen is {do:.2f} mg/L (Recommended minimum is 5.0 mg/L).")
            penalty_score += 15.0
            note = "Feeding vigor and growth rates will decline."
        else:
            status = "SAFE"
            note = "Optimal biological oxygenation for warmwater teleosts."

        compliance["dissolved_oxygen"] = ParameterCompliance(
            value=do, unit="mg/L", status=status, ideal_range="5.0 - 8.5", evaluation_note=note
        )

        # --- Evaluate pH ---
        if ph < 5.5 or ph > 9.5:
            status = "CRITICAL"
            anomalies.append(f"Lethal pH Shock: pH is {ph:.2f} (Tolerable bounds: 6.0 - 9.0).")
            penalty_score += 40.0
            guardrail_triggered = True
            note = "Causes acid/alkali burning of gills and osmotic collapse."
        elif ph < 6.5:
            status = "CAUTION"
            anomalies.append(f"Acidic Water: pH is {ph:.2f} (Ideal: 6.8 - 8.2). Accelerates EUS fungal spore attachment.")
            penalty_score += 15.0
            note = "Carbonate hardness is depleted; lime application needed."
        elif ph > 8.5:
            status = "CAUTION"
            anomalies.append(f"Alkaline Water: pH is {ph:.2f} (Ideal: 6.8 - 8.2). Greatly amplifies toxic NH3 fraction.")
            penalty_score += 15.0
            note = "Algal bloom respiration driving carbon dioxide exhaustion."
        else:
            status = "SAFE"
            note = "Optimal physiological pH equilibrium."

        compliance["ph"] = ParameterCompliance(
            value=ph, unit="pH", status=status, ideal_range="6.8 - 8.2", evaluation_note=note
        )

        # --- Evaluate Temperature (Celsius) ---
        if temp < 18.0:
            status = "CAUTION"
            anomalies.append(f"Low Temperature Stress: Water temperature is {temp:.1f} C. Cold slows teleost antibody production.")
            penalty_score += 20.0
            note = "Heightened susceptibility to Saprolegniasis water mold."
        elif temp > 32.0:
            status = "CAUTION"
            anomalies.append(f"High Thermal Stress: Water temperature is {temp:.1f} C. High heat reduces oxygen solubility.")
            penalty_score += 20.0
            note = "Heightened susceptibility to Columnaris bacterial necrosis."
        else:
            status = "SAFE"
            note = "Favorable metabolic temperature for tropical pond fish."

        compliance["temperature"] = ParameterCompliance(
            value=temp, unit="C", status=status, ideal_range="24.0 - 30.0", evaluation_note=note
        )

        # --- Evaluate Un-Ionized Ammonia (NH3 mg/L) ---
        if nh3 > 0.08:
            status = "CRITICAL"
            anomalies.append(f"Severe Ammonia Toxicity: Un-ionized NH3 is {nh3:.4f} mg/L (Lethal ceiling: > 0.05 mg/L).")
            penalty_score += 45.0
            guardrail_triggered = True
            note = "Causes direct necrotic gill hyperplasia and neurological toxicity."
        elif nh3 > 0.03:
            status = "CAUTION"
            anomalies.append(f"Elevated Ammonia: Un-ionized NH3 is {nh3:.4f} mg/L (Safe limit: < 0.02 mg/L).")
            penalty_score += 20.0
            note = "Chronic gill irritation; predisposing factor for Fin Rot."
        else:
            status = "SAFE"
            note = "Ammonia levels are safe."

        compliance["ammonia_nh3"] = ParameterCompliance(
            value=nh3, unit="mg/L", status=status, ideal_range="< 0.02", evaluation_note=note
        )

        # --- Evaluate Turbidity (NTU) ---
        if turbidity > 100.0:
            status = "CAUTION"
            anomalies.append(f"High Turbidity: {turbidity:.1f} NTU indicates heavy silt runoff or phytoplankton crash.")
            penalty_score += 10.0
            note = "Suspended solids can mechanically irritate gill lamellae."
        else:
            status = "SAFE"
            note = "Normal pond water clarity."

        compliance["turbidity"] = ParameterCompliance(
            value=turbidity, unit="NTU", status=status, ideal_range="15.0 - 50.0", evaluation_note=note
        )

        # --- ML Inferred Environmental Hazard Score ---
        if self.rf_regressor is not None:
            features = np.array([[do, ph, temp, tan, turbidity, nh3]], dtype=np.float32)
            predicted_hazard = float(self.rf_regressor.predict(features)[0])
            hazard_score = min(100.0, max(0.0, predicted_hazard))
        else:
            hazard_score = min(100.0, penalty_score)

        # Apply deterministic biological safety guardrail override
        if guardrail_triggered:
            hazard_score = max(85.0, hazard_score)

        if hazard_score >= 80.0:
            overall_status = "EMERGENCY"
        elif hazard_score >= 55.0:
            overall_status = "WARNING"
        elif hazard_score >= 25.0:
            overall_status = "ADVISORY"
        else:
            overall_status = "NORMAL"

        return WaterQualityResponse(
            status=overall_status,
            hazard_score=round(float(hazard_score), 2),
            un_ionized_ammonia_mg_l=nh3,
            anomalies_detected=anomalies,
            parameter_compliance=compliance,
            biological_guardrail_triggered=guardrail_triggered
        )


water_service = WaterQualityService()
