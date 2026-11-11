import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from backend.app.main import app

client = TestClient(app)

def create_synthetic_image(color=(100, 150, 200)):
    img = Image.new("RGB", (224, 224), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf

def test_scenario_1_optimal_equilibrium():
    """Validates Demo Scenario 1: Optimal Tilapia Monoculture."""
    img_buf = create_synthetic_image(color=(60, 140, 90))
    form_data = {
        "pond_id": "pond-alpha",
        "dissolved_oxygen_mg_l": 6.8,
        "ph": 7.4,
        "temperature_c": 26.2,
        "total_ammonia_mg_l": 0.20,
        "turbidity_ntu": 28.0,
        "filename_hint": "healthy_tilapia.jpg"
    }
    files = {"file": ("healthy_tilapia.jpg", img_buf, "image/jpeg")}

    response = client.post("/api/v1/assess-pond", data=form_data, files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["composite_risk_score"]["severity_tier"] == "NORMAL"
    assert data["composite_risk_score"]["final_score"] < 25.0
    assert "Healthy" in data["visual_diagnosis"]["primary_condition"]
    assert len(data["prescriptive_action_plan"]) >= 1

def test_scenario_2_columnaris_and_heat_synergy():
    """Validates Demo Scenario 2: Columnaris with Alkaline Heat Biological Synergy."""
    img_buf = create_synthetic_image(color=(180, 150, 40))
    form_data = {
        "pond_id": "pond-beta",
        "dissolved_oxygen_mg_l": 4.2,
        "ph": 8.15,
        "temperature_c": 28.0,
        "total_ammonia_mg_l": 0.45,
        "turbidity_ntu": 50.0,
        "filename_hint": "columnaris_bacterial_gill_erosion.jpg"
    }
    files = {"file": ("columnaris_bacterial_gill_erosion.jpg", img_buf, "image/jpeg")}

    response = client.post("/api/v1/assess-pond", data=form_data, files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["composite_risk_score"]["severity_tier"] in ["WARNING", "EMERGENCY"]
    assert data["biological_synergy"]["synergy_detected"] is True
    assert data["biological_synergy"]["interaction_penalty"] > 0
    assert any("Flavobacterium" in act["instruction"] or "gill" in act["instruction"].lower() or "depth" in act["instruction"].lower() for act in data["prescriptive_action_plan"])

def test_scenario_3_nighttime_hypoxia_emergency():
    """Validates Demo Scenario 3: Acute Hypoxia (< 2.0 mg/L) or Lethal Ammonia with Guardrail Override."""
    img_buf = create_synthetic_image(color=(160, 40, 40))
    form_data = {
        "pond_id": "pond-gamma",
        "dissolved_oxygen_mg_l": 1.8,
        "ph": 8.60,
        "temperature_c": 29.5,
        "total_ammonia_mg_l": 0.85,
        "turbidity_ntu": 85.0,
        "filename_hint": "epizootic_ulcerative_syndrome_red_spot.jpg"
    }
    files = {"file": ("epizootic_ulcerative_syndrome_red_spot.jpg", img_buf, "image/jpeg")}

    response = client.post("/api/v1/assess-pond", data=form_data, files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["composite_risk_score"]["severity_tier"] == "EMERGENCY"
    assert data["composite_risk_score"]["final_score"] >= 85.0
    assert data["water_quality"]["biological_guardrail_triggered"] is True
    # Verify emergency life support is priority 1
    assert data["prescriptive_action_plan"][0]["category"] == "Emergency Life Support"
    assert "Aeration" in data["prescriptive_action_plan"][0]["title"]

