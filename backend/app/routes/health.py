from datetime import datetime
from fastapi import APIRouter
from ..schemas import HealthCheckResponse
from ..model_service import model_service

router = APIRouter(prefix="/api", tags=["Health & Diagnostics"])

@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="System Health Check",
    description="Returns backend deployment status, ML model loading status, and active model identifier."
)
async def health_check():
    return HealthCheckResponse(
        status="healthy" if model_service.is_loaded else "degraded",
        model_loaded=model_service.is_loaded,
        model_name=model_service.metadata.get("model_name", "None"),
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
