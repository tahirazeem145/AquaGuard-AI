import io
import sys
import os
import pytest
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

# Ensure project root is on sys.path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.app.main import app

client = TestClient(app)

def create_synthetic_test_image(pattern: str = "white_spots") -> io.BytesIO:
    """Creates a real in-memory image with specific visual artifacts for testing."""
    img = Image.new("RGB", (300, 200), color=(30, 80, 120))
    draw = ImageDraw.Draw(img)

    if pattern == "white_spots":
        # Draw multiple small white circular pustules (Ich simulation)
        for x, y in [(50, 60), (70, 90), (120, 80), (180, 100), (220, 70), (150, 120)]:
            draw.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 255, 255))
    elif pattern == "clean":
        # Smooth gradient-like clear surface (Healthy fish simulation)
        draw.rectangle([50, 50, 250, 150], fill=(70, 140, 190))

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf

def test_root_and_health_endpoints():
    """Verify system status and health endpoints."""
    res_root = client.get("/")
    assert res_root.status_code == 200
    data_root = res_root.json()
    assert data_root["status"] == "online"
    assert "documentation" in data_root

    res_health = client.get("/health")
    assert res_health.status_code == 200
    data_health = res_health.json()
    assert data_health["status"] == "healthy"
    assert "vision_engine" in data_health["services"]

def test_water_quality_evaluation_optimal():
    """Verify water quality evaluation on optimal parameters."""
    payload = {
        "dissolved_oxygen_mg_l": 6.5,
        "ph": 7.4,
        "temperature_c": 26.5,
        "total_ammonia_mg_l": 0.02,
        "turbidity_ntu": 25.0
    }
    response = client.post("/api/v1/water-quality", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NORMAL"
    assert data["hazard_score"] < 25.0
    assert data["biological_guardrail_triggered"] is False
    assert len(data["anomalies_detected"]) == 0

def test_water_quality_evaluation_hypoxia_emergency():
    """Verify biological guardrail triggers EMERGENCY on lethal low DO (<2.0 mg/L)."""
    payload = {
        "dissolved_oxygen_mg_l": 1.7,
        "ph": 7.2,
        "temperature_c": 28.0,
        "total_ammonia_mg_l": 0.05,
        "turbidity_ntu": 35.0
    }
    response = client.post("/api/v1/water-quality", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "EMERGENCY"
    assert data["hazard_score"] >= 85.0
    assert data["biological_guardrail_triggered"] is True
    assert any("Hypoxia" in a for a in data["anomalies_detected"])

def test_fish_image_analysis():
    """Verify standalone image diagnosis endpoint."""
    img_buf = create_synthetic_test_image("white_spots")
    files = {"image": ("test_sample_ich.jpg", img_buf, "image/jpeg")}
    
    response = client.post("/api/v1/analyze-fish", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "primary_condition" in data
    assert data["confidence_score"] > 0.0
    assert len(data["top_3_differential"]) == 3
    assert data["image_quality"]["is_valid"] is True

def test_unified_multimodal_pond_assessment():
    """Verify unified multimodal assessment fusing image and water telemetry."""
    img_buf = create_synthetic_test_image("white_spots")
    files = {"image": ("test_white_spot.jpg", img_buf, "image/jpeg")}
    form_data = {
        "pond_id": "pond_01",
        "dissolved_oxygen_mg_l": 3.8,
        "ph": 7.5,
        "temperature_c": 20.0,
        "total_ammonia_mg_l": 0.25,
        "turbidity_ntu": 30.0
    }
    
    response = client.post("/api/v1/assess-pond", files=files, data=form_data)
    assert response.status_code == 200
    data = response.json()
    
    # Check composite risk score structure
    risk = data["risk_assessment"]
    assert 0.0 <= risk["score"] <= 100.0
    assert risk["severity_tier"] in ["NORMAL", "ADVISORY", "WARNING", "EMERGENCY"]
    assert risk["color_code"].startswith("#")
    
    # Check visual diagnosis & environmental health sections
    assert "visual_diagnosis" in data
    assert "environmental_health" in data
    assert "synergy_interaction" in data
    
    # Check prescriptive action items
    actions = data["prescriptive_action_plan"]
    assert len(actions) >= 2
    assert all("instruction" in act for act in actions)

def test_ponds_and_presets_endpoints():
    """Verify pond listing and one-click demo presets."""
    res_ponds = client.get("/api/v1/ponds")
    assert res_ponds.status_code == 200
    ponds = res_ponds.json()
    assert len(ponds) >= 3
    assert ponds[0]["id"] == "pond_01"

    res_presets = client.get("/api/v1/demo-presets")
    assert res_presets.status_code == 200
    presets = res_presets.json()
    assert len(presets) == 3
    preset_ids = [p["preset_id"] for p in presets]
    assert "preset_optimal_equilibrium" in preset_ids
    assert "preset_hypoxia_emergency" in preset_ids

