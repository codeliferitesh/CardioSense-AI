from fastapi import APIRouter, HTTPException, status
from ..schemas import PatientPredictionInput, PredictionResultResponse
from ..model_service import model_service

router = APIRouter(prefix="/api", tags=["Prediction & Decision Support"])

@router.post(
    "/predict",
    response_model=PredictionResultResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Heart Disease Risk",
    description="Accepts clinical patient features, applies standard preprocessing, and returns risk probability, clinical category, and evidence-based CDSS recommendations."
)
async def predict_heart_disease(patient_data: PatientPredictionInput):
    try:
        result = model_service.predict(patient_data)
        return result
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Model service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction processing error: {str(e)}"
        )

@router.get(
    "/model-performance",
    summary="Get Model Performance & Explainability Metrics",
    description="Returns benchmark evaluation metrics across trained candidate models (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix) and feature importance."
)
async def get_model_performance():
    try:
        metrics = model_service.get_performance_metrics()
        if not metrics:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Performance metrics not available yet. Ensure model training has completed."
            )
        return metrics
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving performance metrics: {str(e)}"
        )
