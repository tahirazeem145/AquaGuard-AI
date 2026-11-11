---
name: fastapi-backend
description: Best practices and architecture guidelines for building high-performance, asynchronous REST APIs with Python, FastAPI, and Pydantic v2. Covers multipart file uploads, CORS, route structuring, dependency injection, and automatic OpenAPI documentation.
license: MIT
---

# FastAPI Backend Skill

This skill provides architectural guidance, code conventions, and production patterns for constructing backend RESTful microservices using **Python 3.10+**, **FastAPI**, and **Pydantic v2**.

## 1. Core Principles

1. **Strict Asynchronous Execution:** Use `async def` for I/O-bound endpoints (database calls, file streaming, cloud storage). Run synchronous CPU-bound operations (e.g. ML inference) in threadpools via `starlette.concurrency.run_in_threadpool` or `asyncio.to_thread` to prevent event-loop blocking.
2. **Explicit Data Contracts (Pydantic v2):** Every request payload and response body must be defined as a strongly-typed Pydantic model. This guarantees strict validation and automatic, interactive Swagger UI documentation at `/docs`.
3. **Decoupled Service Layer:** Separate route controllers (`routers/`) from business logic (`services/`) and data access (`repositories/`).
4. **Resilient Error Handling:** Use custom HTTPException subclasses with standardized JSON error schemas rather than uncaught 500 crashes.

---

## 2. Recommended Directory Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── fish_analysis.py    # POST /api/v1/analyze-fish
│   │   │   │   ├── water_quality.py    # POST /api/v1/water-quality
│   │   │   │   └── pond_assessment.py  # POST /api/v1/assess-pond
│   │   │   └── router.py               # Aggregates v1 routes
│   ├── core/
│   │   ├── config.py                   # Pydantic BaseSettings (env vars)
│   │   └── security.py                 # API keys & CORS settings
│   ├── models/
│   │   └── schemas.py                  # Pydantic v2 Request/Response models
│   ├── services/
│   │   ├── vision_service.py           # MobileNetV3 image inference
│   │   ├── water_service.py            # Random forest & FAO guardrail
│   │   └── fusion_service.py           # Multimodal risk scoring engine
│   └── main.py                         # FastAPI app factory & middleware
├── models_weights/                     # Serialized .keras / .onnx / .pkl files
├── requirements.txt
└── Dockerfile
```

---

## 3. Implementation Patterns

### 3.1 Multipart Image Upload & Fast Validation
```python
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from PIL import Image
import io

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

@router.post("/analyze-fish")
async def analyze_fish_image(image: UploadFile = File(...)):
    if image.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported image type. Allowed: {ALLOWED_MIME_TYPES}"
        )
    
    contents = await image.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image size exceeds 10 MB limit."
        )
        
    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Corrupted or unreadable image file."
        )
        
    # Execute inference asynchronously without blocking the event loop
    result = await asyncio.to_thread(vision_service.predict, pil_image)
    return result
```

### 3.2 Non-Blocking ML Model Execution
```python
from fastapi.concurrency import run_in_threadpool

@router.post("/assess-pond")
async def assess_pond(payload: PondAssessmentRequest):
    # ML forward-pass is CPU-bound; run in threadpool
    assessment = await run_in_threadpool(fusion_service.calculate_risk, payload)
    return assessment
```

### 3.3 CORS Configuration for Frontend Development
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

