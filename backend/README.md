# AquaGuard AI: Backend Microservice Architecture

The AquaGuard AI backend is a production-grade, asynchronous REST API service built with **Python 3.10+**, **FastAPI**, **Pydantic v2**, and **OpenCV / Scikit-learn**. It serves as the analytical core of the platform, executing real-time computer vision lesion diagnosis, water quality hazard analysis, and multimodal risk fusion.

---

## 1. Directory Structure

```text
backend/
├── app/
│   ├── main.py                          # FastAPI factory, CORS, exception handlers, health checks
│   ├── core/
│   │   ├── config.py                    # Settings (Pydantic BaseSettings, env vars, model paths)
│   │   └── security.py                  # Image upload validations & filename sanitization
│   ├── models/
│   │   └── schemas.py                   # Strict Pydantic v2 Request/Response contracts
│   ├── services/
│   │   ├── vision_service.py            # CLAHE contrast enhancement & 7-class lesion diagnostic engine
│   │   ├── water_service.py             # Emerson thermodynamics (NH3) & FAO biological guardrails
│   │   ├── fusion_service.py            # Multimodal composite risk fusion (0-100) & biological synergy
│   │   ├── advisory_service.py          # Prescriptive non-antibiotic farm remediation planner
│   │   └── supabase_service.py          # Supabase persistence & in-memory local fallback store
│   └── api/
│       ├── router.py                    # Main API router aggregating v1 endpoints
│       └── v1/
│           └── endpoints/
│               ├── fish_analysis.py     # POST /api/v1/analyze-fish
│               ├── water_quality.py     # POST /api/v1/water-quality
│               ├── pond_assessment.py   # POST /api/v1/assess-pond
│               └── ponds.py             # GET /api/v1/ponds, GET /history, GET /demo-presets
├── tests/
│   ├── __init__.py
│   └── test_api.py                      # 6 automated integration tests (100% pass rate)
├── requirements.txt                     # Pinned dependencies
├── run.py                               # Uvicorn entrypoint (runs on http://localhost:8000)
└── README.md
```

---

## 2. Quickstart: Running the Server

### Start the Backend
From the project root directory, run:
```bash
python backend/run.py
```

The application will start on `http://localhost:8000`:
* **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 3. Core REST API Endpoints

| Method | Route | Description | Input | Output |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/analyze-fish` | Standalone AI Fish Diagnostic Scan | `multipart/form-data` (`image`: File) | Top-1 diagnosis, confidence, Top-3 differential probabilities, symptoms identified, and image sharpness/brightness check. |
| `POST` | `/api/v1/water-quality` | Standalone Water Quality Hazard Analysis | `application/json` (`do_mg_l`, `ph`, `temp_c`, `tan_mg_l`, `turbidity_ntu`) | Hazard score (0–100), toxic $NH_3$ level, parameter-by-parameter FAO compliance, and biological guardrail flags. |
| `POST` | `/api/v1/assess-pond` | Unified Multimodal Pond Health Assessment | `multipart/form-data` (`image` + form telemetry) | Composite Pond Risk Score ($0 - 100$), Severity Tier (Normal/Advisory/Warning/Emergency), Synergy Interaction factor, and Prioritized Action Plan. |
| `GET` | `/api/v1/ponds` | List All Monitored Ponds | None | List of monitored ponds, active alerts, species farmed, and current risk scores. |
| `GET` | `/api/v1/ponds/{id}/history` | Historical Pond Scan Logs | Query: `limit` (default 10) | Chronological past scan records, image URLs, and risk trends. |
| `GET` | `/api/v1/demo-presets` | Retrieve 3 One-Click Judge Demo Scenarios | None | Pre-configured scenarios (*"White Spot Outbreak"*, *"Hypoxia Emergency"*, *"Optimal Equilibrium"*). |

---

## 4. Running Automated Tests

All endpoints and calculation pipelines are covered by automated integration tests:
```bash
python -m pytest backend/tests/test_api.py -v
```

**Test Coverage Highlights:**
* ✅ Root & Health status verification.
* ✅ Optimal water parameter baseline evaluation.
* ✅ Tier 1 Biological Guardrail tripwire on acute hypoxia ($DO < 2.0\text{ mg/L}$).
* ✅ Standalone in-memory JPEG image processing, CLAHE, and Top-3 differential scoring.
* ✅ Full multimodal risk fusion, biological synergy bonus, and prescriptive advisory generation.
* ✅ Monitored ponds listing and 3 hackathon demo presets.

