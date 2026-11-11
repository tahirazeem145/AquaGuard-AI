import sys
import os
import uvicorn

# Ensure the project root directory is on the python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if __name__ == "__main__":
    print("=" * 70)
    print(" Starting AquaGuard AI Backend Microservice")
    print(" Documentation available at: http://localhost:8000/docs")
    print(" Alternative ReDoc at:      http://localhost:8000/redoc")
    print("=" * 70)
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

