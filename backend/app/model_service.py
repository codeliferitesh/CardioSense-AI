import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
import joblib

from .schemas import PatientPredictionInput, PredictionResultResponse

class ModelService:
    def __init__(self, models_dir: Optional[str] = None):
        if models_dir is None:
            # Resolve relative to current backend folder
            base_dir = Path(__file__).resolve().parent.parent
            self.models_dir = base_dir / "models"
        else:
            self.models_dir = Path(models_dir)

        self.model = None
        self.preprocessor = None
        self.metadata: Dict[str, Any] = {}
        self.metrics: Dict[str, Any] = {}
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        model_path = self.models_dir / "heart_disease_model.joblib"
        preprocessor_path = self.models_dir / "preprocessor.joblib"
        metadata_path = self.models_dir / "model_metadata.json"
        metrics_path = self.models_dir / "metrics.json"

        # If artifacts don't exist yet, trigger training pipeline
        if not model_path.exists() or not preprocessor_path.exists():
            print(f"[ModelService] Artifacts not found at {self.models_dir}. Running training pipeline...")
            try:
                from backend.training.train import run_training_pipeline
                run_training_pipeline(output_dir=str(self.models_dir))
            except Exception as e:
                print(f"[ModelService] Error auto-running training pipeline: {e}")

        if model_path.exists() and preprocessor_path.exists():
            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(preprocessor_path)
            self.is_loaded = True
            print(f"[ModelService] Successfully loaded model and preprocessor from {self.models_dir}")

            if metadata_path.exists():
                with open(metadata_path, "r") as f:
                    self.metadata = json.load(f)

            if metrics_path.exists():
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)
        else:
            print(f"[ModelService] WARNING: Could not find model artifacts at {self.models_dir}")

    def predict(self, patient: PatientPredictionInput) -> PredictionResultResponse:
        if not self.is_loaded or self.model is None or self.preprocessor is None:
            self.load_artifacts()
            if not self.is_loaded:
                raise RuntimeError("ML Model artifacts are not loaded or initialized on the server.")

        # Construct DataFrame with exact feature order
        feature_order = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        input_data = {
            'age': [patient.age],
            'sex': [patient.sex],
            'cp': [patient.cp],
            'trestbps': [patient.trestbps],
            'chol': [patient.chol],
            'fbs': [patient.fbs],
            'restecg': [patient.restecg],
            'thalach': [patient.thalach],
            'exang': [patient.exang],
            'oldpeak': [patient.oldpeak],
            'slope': [patient.slope],
            'ca': [patient.ca],
            'thal': [patient.thal]
        }

        df_patient = pd.DataFrame(input_data)[feature_order]

        # Apply exact preprocessing
        X_proc = self.preprocessor.transform(df_patient)

        # Get raw prediction and probability
        pred = int(self.model.predict(X_proc)[0])
        
        # Calculate probability
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_proc)[0]
            prob_positive = float(probs[1])
        elif hasattr(self.model, "decision_function"):
            decision = self.model.decision_function(X_proc)[0]
            prob_positive = float(1.0 / (1.0 + np.exp(-decision)))
        else:
            prob_positive = 1.0 if pred == 1 else 0.0

        model_name = self.metadata.get("model_name", type(self.model).__name__)

        # Clinical Risk Stratification
        if prob_positive >= 0.65:
            risk_category = "Higher predicted risk"
            risk_level = "High"
        elif prob_positive >= 0.35:
            risk_category = "Moderate predicted risk"
            risk_level = "Moderate"
        else:
            risk_category = "Lower predicted risk"
            risk_level = "Low"

        # Identify contributing risk factors
        key_factors = []
        if patient.oldpeak >= 1.5:
            key_factors.append(f"Significant ST Depression ({patient.oldpeak} mm) indicates myocardial stress response")
        if patient.exang == 1:
            key_factors.append("Exercise-induced angina reported during exertion")
        if patient.ca > 0:
            key_factors.append(f"{patient.ca} major vessel(s) exhibiting fluoroscopic narrowing/calcification")
        if patient.thal == 2:
            key_factors.append("Thalassemia scan demonstrates fixed perfusion defect")
        elif patient.thal == 3:
            key_factors.append("Thalassemia scan demonstrates reversible ischemia defect")
        if patient.cp in [1, 2, 3]:
            key_factors.append(f"Chest pain presentation ({['Typical angina', 'Atypical angina', 'Non-anginal pain', 'Asymptomatic'][patient.cp]})")
        if patient.trestbps >= 140:
            key_factors.append(f"Elevated resting blood pressure ({patient.trestbps} mm Hg - Stage 2 Hypertension)")
        elif patient.trestbps >= 130:
            key_factors.append(f"Borderline blood pressure ({patient.trestbps} mm Hg - Stage 1 Hypertension)")
        if patient.chol >= 240:
            key_factors.append(f"High serum cholesterol level ({patient.chol} mg/dl)")
        elif patient.chol >= 200:
            key_factors.append(f"Borderline elevated serum cholesterol ({patient.chol} mg/dl)")
        if patient.fbs == 1:
            key_factors.append("Fasting blood glucose > 120 mg/dl (Diabetic / Impaired fasting glucose)")
        if patient.restecg == 2:
            key_factors.append("Resting ECG demonstrates probable or definite left ventricular hypertrophy (LVH)")
        elif patient.restecg == 1:
            key_factors.append("Resting ECG demonstrates ST-T wave abnormalities")
        
        # Clinical Summary & Decision Support Guidance
        if risk_level == "High":
            clinical_summary = (
                f"Model evaluation indicates a high probability ({prob_positive * 100:.1f}%) of underlying cardiovascular disease. "
                f"Multiple clinical indicators (such as ST-segment changes, fluoroscopy markers, or stress tolerance) suggest heightened cardiac risk."
            )
            recommendations = [
                "Recommend urgent clinical review and comprehensive cardiovascular evaluation.",
                "Consider 12-lead ECG review, echocardiogram, and cardiology specialist consultation.",
                "Review coronary artery disease (CAD) risk reduction protocols including statin therapy and antiplatelet review if clinically indicated.",
                "Monitor vitals and establish follow-up protocol."
            ]
        elif risk_level == "Moderate":
            clinical_summary = (
                f"Model evaluation indicates a moderate/borderline risk profile ({prob_positive * 100:.1f}% probability). "
                f"Some risk markers warrant targeted monitoring and lifestyle intervention."
            )
            recommendations = [
                "Recommend clinical correlation with patient medical history and current symptoms.",
                "Order standard fasting lipid panel and HbA1c to monitor metabolic risk factors.",
                "Advise guideline-directed lifestyle modifications (dietary optimization, structured aerobic exercise).",
                "Schedule routine follow-up within 3-6 months or sooner if symptoms develop."
            ]
        else:
            clinical_summary = (
                f"Model evaluation indicates a low predicted likelihood ({prob_positive * 100:.1f}% probability) of significant heart disease. "
                f"Current physiological parameters fall largely within expected ranges."
            )
            recommendations = [
                "Maintain routine preventive cardiovascular health screenings.",
                "Promote continued cardiovascular wellness, balanced nutrition, and regular physical activity.",
                "Advise patient to report any new chest discomfort, shortness of breath, or exertional symptoms promptly."
            ]

        if not key_factors:
            key_factors = ["Physiological markers within baseline standard clinical boundaries."]

        return PredictionResultResponse(
            prediction=pred,
            probability=round(prob_positive, 4),
            risk_category=risk_category,
            model=model_name,
            risk_level=risk_level,
            clinical_summary=clinical_summary,
            key_contributing_factors=key_factors[:5],
            recommendations=recommendations,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )

    def get_performance_metrics(self) -> Dict[str, Any]:
        if not self.metrics:
            metrics_path = self.models_dir / "metrics.json"
            if metrics_path.exists():
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)
            else:
                self.load_artifacts()
        return self.metrics

# Global service instance
model_service = ModelService()
