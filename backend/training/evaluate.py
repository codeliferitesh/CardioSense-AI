import json
from pathlib import Path
import pandas as pd
import joblib
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

def evaluate_saved_model(
    data_path: str = "data/heart_disease.csv",
    model_dir: str = "backend/models"
):
    base = Path(model_dir)
    model = joblib.load(base / "heart_disease_model.joblib")
    preprocessor = joblib.load(base / "preprocessor.joblib")

    csv_path = Path(data_path)
    if not csv_path.exists():
        csv_path = Path("../" + data_path)
    df = pd.read_csv(csv_path)

    X = df.drop(columns=['target'])
    y = df['target']

    X_proc = preprocessor.transform(X)
    preds = model.predict(X_proc)
    probs = model.predict_proba(X_proc)[:, 1] if hasattr(model, "predict_proba") else preds

    print("=" * 60)
    print("SAVED MODEL FULL-DATASET EVALUATION REPORT")
    print("=" * 60)
    print(f"Model Class: {type(model).__name__}")
    print(f"ROC-AUC Score: {roc_auc_score(y, probs):.4f}")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y, preds))
    print("\nClassification Report:")
    print(classification_report(y, preds, target_names=["Lower Risk (0)", "Higher Risk (1)"]))
    print("=" * 60)

if __name__ == "__main__":
    evaluate_saved_model()
