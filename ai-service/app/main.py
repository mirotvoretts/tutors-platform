from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import ocr, math_check, recommendations
from app.celery_app import celery_app

app = FastAPI(
    title="Stopro AI Service",
    description="Microservice for OCR, Math Logic and Recommendations",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(ocr.router, prefix="/api/v1/ocr", tags=["OCR"])
app.include_router(math_check.router, prefix="/api/v1/math", tags=["Math"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])

@app.get("/health")
def health_check():
    return {"status": "ok", "celery": "connected" if celery_app.control.ping() else "disconnected"}
