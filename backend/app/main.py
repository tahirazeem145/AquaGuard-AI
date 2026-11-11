from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.api.router import api_router

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_TITLE,
        description=(
            "### AquaGuard AI: Fish Disease Risk Detection & Early Warning System\n\n"
            "An intelligent multimodal early warning platform engineered for freshwater aquaculture ponds. "
            "Combines deep learning computer vision (MobileNetV3) for exterior fish lesion diagnosis "
            "with real-time physicochemical water telemetry (DO, pH, Temp, Ammonia) to compute calibrated "
            "pond health risk scores (0–100) and dispatch actionable, non-antibiotic mitigation plans."
        ),
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # Configure CORS for React.js frontend development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes
    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.get("/", tags=["System Status"])
    async def root_status():
        return {
            "project": settings.PROJECT_NAME,
            "title": settings.PROJECT_TITLE,
            "status": "online",
            "version": settings.VERSION,
            "documentation": "/docs",
            "alternative_docs": "/redoc",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @app.get("/health", tags=["System Status"])
    @app.get(f"{settings.API_V1_STR}/health", tags=["System Status"])
    async def health_check():
        return {
            "status": "healthy",
            "environment": "development",
            "services": {
                "vision_engine": "active (CLAHE + Morphological Softmax)",
                "water_engine": "active (FAO Biological Guardrails + Emerson NH3)",
                "risk_fusion_engine": "active (Biological Synergy Formula)",
                "storage_persistence": "active (Supabase / Local Fallback)"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    return app

app = create_application()

