import pytest
from fastapi.testclient import TestClient
try:
    from app.main import app
except ImportError:
    from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "CardioSense CDSS" in data["system"]
    assert data["status"] == "online"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert len(data["model_name"]) > 0

def test_prediction_valid_sample_case():
    payload = {
        "age": 52,
        "sex": 1,
        "cp": 0,
        "trestbps": 125,
        "chol": 212,
        "fbs": 0,
        "restecg": 1,
        "thalach": 168,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 2,
        "ca": 2,
        "thal": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "probability" in data
    assert "risk_category" in data
    assert "model" in data
    assert 0.0 <= data["probability"] <= 1.0
    assert data["prediction"] == 0
    assert data["risk_category"] == "Lower predicted risk"
    assert len(data["recommendations"]) > 0

def test_prediction_high_risk_case():
    payload = {
        "age": 58,
        "sex": 0,
        "cp": 0,
        "trestbps": 100,
        "chol": 248,
        "fbs": 0,
        "restecg": 0,
        "thalach": 122,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 1,
        "ca": 0,
        "thal": 2
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == 1
    assert data["probability"] >= 0.5
    assert "Higher predicted risk" in data["risk_category"]

def test_prediction_lower_risk_case():
    payload = {
        "age": 53,
        "sex": 1,
        "cp": 0,
        "trestbps": 140,
        "chol": 203,
        "fbs": 1,
        "restecg": 0,
        "thalach": 155,
        "exang": 1,
        "oldpeak": 3.1,
        "slope": 0,
        "ca": 0,
        "thal": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == 0
    assert data["probability"] < 0.5
    assert "Lower predicted risk" in data["risk_category"]

def test_model_performance_endpoint():
    response = client.get("/api/model-performance")
    assert response.status_code == 200
    data = response.json()
    assert "dataset_summary" in data
    assert data["dataset_summary"]["total_samples"] == 1025
    assert "models" in data
    assert len(data["models"]) >= 4
    assert "feature_importance" in data
    assert len(data["feature_importance"]) == 13

def test_invalid_input_validation():
    payload = {
        "age": -5,
        "sex": 1,
        "cp": 0,
        "trestbps": 125,
        "chol": 9000,
        "fbs": 0,
        "restecg": 1,
        "thalach": 168,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 2,
        "ca": 2,
        "thal": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422 # Unprocessable Entity
