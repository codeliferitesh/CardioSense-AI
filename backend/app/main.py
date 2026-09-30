import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routes import prediction, health
from .model_service import model_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure models and preprocessors are loaded
    print("[FastAPI] Initializing CardioSense CDSS backend...")
    model_service.load_artifacts()
    yield
    print("[FastAPI] Shutting down CardioSense CDSS backend...")

app = FastAPI(
    title="CardioSense CDSS API",
    description=(
        "Clinical Decision Support System (CDSS) for Heart Disease Risk Assessment. "
        "Provides validated machine-learning risk predictions, probability scoring, "
        "model explainability insights, and evidence-based decision guidance."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
# Allow frontend origins from environment or default to common development & production hosts
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for easy clinical frontend deployment & preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(prediction.router)

@app.get("/", tags=["General"])
async def root():
    return {
        "system": "CardioSense CDSS - Clinical Decision Support System",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "prediction": "POST /api/predict",
            "model_performance": "GET /api/model-performance",
            "health": "GET /api/health"
        },
        "disclaimer": "For clinical decision support only. Not an autonomous diagnostic system."
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"}
    )
