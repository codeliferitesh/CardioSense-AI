from typing import List, Optional
from pydantic import BaseModel, Field

class PatientPredictionInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Patient age in years (1-120)", json_schema_extra={"example": 52})
    sex: int = Field(..., ge=0, le=1, description="Gender / Biological Sex (0 = Female, 1 = Male)", json_schema_extra={"example": 1})
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0: Typical Angina, 1: Atypical Angina, 2: Non-anginal, 3: Asymptomatic)", json_schema_extra={"example": 0})
    trestbps: int = Field(..., ge=50, le=260, description="Resting blood pressure in mm Hg (50-260)", json_schema_extra={"example": 125})
    chol: int = Field(..., ge=80, le=650, description="Serum cholesterol in mg/dl (80-650)", json_schema_extra={"example": 212})
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (0 = No, 1 = Yes)", json_schema_extra={"example": 0})
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG (0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy)", json_schema_extra={"example": 1})
    thalach: int = Field(..., ge=50, le=250, description="Maximum heart rate achieved in bpm (50-250)", json_schema_extra={"example": 168})
    exang: int = Field(..., ge=0, le=1, description="Exercise-induced angina (0 = No, 1 = Yes)", json_schema_extra={"example": 0})
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest (0.0-10.0)", json_schema_extra={"example": 1.0})
    slope: int = Field(..., ge=0, le=2, description="Slope of the peak exercise ST segment (0: Upsloping, 1: Flat, 2: Downsloping)", json_schema_extra={"example": 2})
    ca: int = Field(..., ge=0, le=4, description="Number of major vessels colored by flourosopy (0-4)", json_schema_extra={"example": 2})
    thal: int = Field(..., ge=0, le=3, description="Thalassemia (0: Unknown, 1: Normal, 2: Fixed defect, 3: Reversible defect)", json_schema_extra={"example": 3})

class PredictionResultResponse(BaseModel):
    prediction: int = Field(..., description="Binary prediction label (0: Lower predicted risk, 1: Higher predicted risk)")
    probability: float = Field(..., description="Predicted probability of heart disease (0.0 to 1.0)")
    risk_category: str = Field(..., description="Clinical risk category description")
    model: str = Field(..., description="Name of the deployed machine learning model")
    risk_level: str = Field(..., description="Risk tier: Low, Moderate, or High")
    clinical_summary: str = Field(..., description="Contextual clinical summary for the healthcare provider")
    key_contributing_factors: List[str] = Field(default_factory=list, description="Top physiological parameters contributing to this assessment")
    recommendations: List[str] = Field(default_factory=list, description="Evidence-based clinical decision support guidance")
    timestamp: str = Field(..., description="Assessment execution timestamp (ISO format)")

class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    timestamp: str
