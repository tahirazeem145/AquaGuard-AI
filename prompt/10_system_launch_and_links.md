# User Prompt 10: System Launch & Live Application Access

## 1. Verbatim User Request
> "run and give link"

---

## 2. Context & Objectives
- Launch and ensure background persistence of both the FastAPI backend and Vite + React frontend microservices.
- Verify HTTP health connectivity on both ports (8000 and 5173).
- Provide the user with direct, clickable links to access the interactive dashboard and backend documentation.

---

## 3. Services Verification & Health Checks

1. **FastAPI Microservice (Port 8000):**
   - URL: `http://127.0.0.1:8000/health`
   - Response: `{"status": "healthy", "environment": "development", "services": {"vision_engine": "active (MobileNetV3 PyTorch)", "water_engine": "active (Random Forest + FAO)", "fusion_engine": "active (Multimodal)", "persistence": "active"}}`
2. **React Dashboard (Port 5173):**
   - URL: `http://127.0.0.1:5173/`
   - Response: HTTP 200 OK (Vite HMR active, styled with Deep Oceanic Biosecurity theme).

---

## 4. Live Access Endpoints
- **Interactive Web App Dashboard:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **FastAPI Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **FastAPI ReDoc Specification:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

