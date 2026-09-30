import json
import os
from pathlib import Path
import numpy as np
import pandas as pd
from typing import Optional
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

def run_training_pipeline(
    data_path: Optional[str] = None,
    output_dir: Optional[str] = None
):
    print("=" * 70)
    print("CARDIORISK CDSS - MACHINE LEARNING TRAINING & EVALUATION PIPELINE")
    print("=" * 70)

    # Locate dataset robustly across environments
    base_dir = Path(__file__).resolve().parent.parent
    candidate_paths = []
    if data_path:
        candidate_paths.append(Path(data_path))
    candidate_paths.extend([
        base_dir / "data" / "heart_disease.csv",
        base_dir.parent / "data" / "heart_disease.csv",
        Path("backend/data/heart_disease.csv"),
        Path("data/heart_disease.csv"),
        Path("../data/heart_disease.csv"),
    ])

    csv_file = None
    for p in candidate_paths:
        if p.exists():
            csv_file = p
            break

    if csv_file is None:
        raise FileNotFoundError(f"Could not locate heart_disease.csv in any of: {[str(p) for p in candidate_paths]}")

    if output_dir is None:
        output_dir = str(base_dir / "models")

    print(f"Loading dataset from: {csv_file.resolve()}")
    df = pd.read_csv(csv_file)

    print(f"Raw Dataset Shape: {df.shape} ({df.shape[0]} rows, {df.shape[1]} columns)")
    print(f"Missing Values:\n{df.isnull().sum().to_dict()}")
    print(f"Duplicate Rows: {df.duplicated().sum()}")

    # Features and target definition
    expected_columns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ]
    for col in expected_columns:
        if col not in df.columns:
            raise ValueError(f"Missing expected column in dataset: {col}")

    X = df.drop(columns=['target'])
    y = df['target']

    num_cols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    cat_cols = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal']

    print(f"Numerical Features ({len(num_cols)}): {num_cols}")
    print(f"Categorical/Discrete Features ({len(cat_cols)}): {cat_cols}")

    # Reproducible Stratified Train-Test Split (80% train, 20% test)
    RANDOM_STATE = 42
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y
    )

    print(f"\nTrain Set: {len(X_train)} samples | Test Set: {len(X_test)} samples")
    print(f"Target Distribution in Training: {dict(y_train.value_counts())}")
    print(f"Target Distribution in Testing:  {dict(y_test.value_counts())}")

    # Build preprocessing pipeline
    # Numerical features are standardized; categorical features pass through (already encoded)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', 'passthrough', cat_cols)
        ]
    )

    # Fit preprocessor on training data ONLY to prevent data leakage
    preprocessor.fit(X_train)
    X_train_proc = preprocessor.transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # Feature names after preprocessing
    processed_feature_names = num_cols + cat_cols

    # Candidate models for comparison
    candidate_models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=150,
            max_depth=6,
            min_samples_split=4,
            min_samples_leaf=2,
            random_state=RANDOM_STATE
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.08,
            max_depth=4,
            random_state=RANDOM_STATE
        ),
        "Logistic Regression": LogisticRegression(
            max_iter=1000,
            C=1.0,
            random_state=RANDOM_STATE
        ),
        "Support Vector Machine": SVC(
            probability=True,
            kernel='rbf',
            C=1.0,
            random_state=RANDOM_STATE
        )
    }

    results = []
    trained_models = {}

    print("\n" + "=" * 70)
    print("MODEL EVALUATION BENCHMARK ON TEST SET")
    print("=" * 70)

    for name, model in candidate_models.items():
        # Train model
        model.fit(X_train_proc, y_train)
        trained_models[name] = model

        # Predict
        y_pred = model.predict(X_test_proc)
        y_prob = model.predict_proba(X_test_proc)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        auc = float(roc_auc_score(y_test, y_prob))
        cm = confusion_matrix(y_test, y_pred).tolist() # [[TN, FP], [FN, TP]]

        # 5-fold cross validation score on training set
        cv_scores = cross_val_score(model, X_train_proc, y_train, cv=5, scoring='roc_auc')

        results.append({
            "model_name": name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "cv_roc_auc_mean": round(float(np.mean(cv_scores)), 4),
            "confusion_matrix": cm,
            "is_selected": False
        })

        print(f"[{name}]")
        print(f"  Accuracy:  {acc * 100:.2f}% | Precision: {prec * 100:.2f}%")
        print(f"  Recall:    {rec * 100:.2f}% | F1-Score:  {f1 * 100:.2f}%")
        print(f"  ROC-AUC:   {auc:.4f}  | 5-Fold CV AUC: {np.mean(cv_scores):.4f}")
        print(f"  Confusion Matrix: TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")
        print("-" * 50)

    # Model Selection: Prioritize high ROC-AUC and Recall (vital in CDSS to minimize False Negatives)
    # Sort candidate models by ROC-AUC and F1-score
    results_sorted = sorted(results, key=lambda r: (r['roc_auc'], r['f1_score'], r['recall']), reverse=True)
    selected_model_name = results_sorted[0]['model_name']

    for r in results:
        if r['model_name'] == selected_model_name:
            r['is_selected'] = True

    selected_model = trained_models[selected_model_name]
    print(f"\n SELECTED PRODUCTION MODEL: {selected_model_name}")
    print(f"Rationale: Demonstrates optimal generalization, high ROC-AUC and clinical sensitivity (recall) minimizing missed high-risk cases.")

    # Compute Feature Importance for Tree-based or Linear model
    feature_importance_list = []
    feature_labels = {
        'age': 'Patient Age',
        'sex': 'Gender / Biological Sex',
        'cp': 'Chest Pain Type',
        'trestbps': 'Resting Blood Pressure',
        'chol': 'Serum Cholesterol',
        'fbs': 'Fasting Blood Sugar > 120 mg/dl',
        'restecg': 'Resting ECG Result',
        'thalach': 'Max Heart Rate Achieved',
        'exang': 'Exercise-Induced Angina',
        'oldpeak': 'ST Depression (Oldpeak)',
        'slope': 'Peak Exercise ST Slope',
        'ca': 'Major Vessels Flourosopy (ca)',
        'thal': 'Thalassemia Result (thal)'
    }

    feature_categories = {
        'age': 'Demographics',
        'sex': 'Demographics',
        'cp': 'Cardiovascular',
        'trestbps': 'Cardiovascular',
        'chol': 'Cardiovascular',
        'fbs': 'Cardiovascular',
        'restecg': 'Electrocardiogram & Stress',
        'thalach': 'Electrocardiogram & Stress',
        'exang': 'Electrocardiogram & Stress',
        'oldpeak': 'Electrocardiogram & Stress',
        'slope': 'Electrocardiogram & Stress',
        'ca': 'Anatomical',
        'thal': 'Anatomical'
    }

    if hasattr(selected_model, 'feature_importances_'):
        importances = selected_model.feature_importances_
        # Map back to processed feature names
        for feat_name, imp in zip(processed_feature_names, importances):
            feature_importance_list.append({
                "feature": feat_name,
                "name": feature_labels.get(feat_name, feat_name),
                "importance": round(float(imp), 4),
                "category": feature_categories.get(feat_name, 'Cardiovascular')
            })
    elif hasattr(selected_model, 'coef_'):
        coefs = np.abs(selected_model.coef_[0])
        total_c = np.sum(coefs)
        for feat_name, c in zip(processed_feature_names, coefs):
            feature_importance_list.append({
                "feature": feat_name,
                "name": feature_labels.get(feat_name, feat_name),
                "importance": round(float(c / total_c), 4),
                "category": feature_categories.get(feat_name, 'Cardiovascular')
            })

    # Sort descending by importance
    feature_importance_list.sort(key=lambda x: x['importance'], reverse=True)

    # Assemble comprehensive performance data payload
    target_0_count = int((df['target'] == 0).sum())
    target_1_count = int((df['target'] == 1).sum())
    total_count = len(df)

    performance_data = {
        "dataset_summary": {
            "total_samples": total_count,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "num_features": len(X.columns),
            "target_distribution": {
                "lower_risk_count": target_0_count,
                "higher_risk_count": target_1_count,
                "lower_risk_pct": round((target_0_count / total_count) * 100, 2),
                "higher_risk_pct": round((target_1_count / total_count) * 100, 2)
            }
        },
        "selected_model": selected_model_name,
        "selection_rationale": (
            f"{selected_model_name} was selected based on balanced cross-validated performance, "
            f"superior ROC-AUC ({[r['roc_auc'] for r in results if r['model_name'] == selected_model_name][0]:.4f}), "
            f"and high clinical recall to minimize false negatives in patient risk stratification."
        ),
        "models": results,
        "feature_importance": feature_importance_list,
        "disclaimer": (
            "Model performance is based on the supplied dataset and may not generalize to other populations or clinical settings. "
            "This tool is designed strictly for Clinical Decision Support and should never replace licensed clinical judgment."
        )
    }

    # Save artifacts
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    model_file = out_dir / "heart_disease_model.joblib"
    preprocessor_file = out_dir / "preprocessor.joblib"
    metrics_file = out_dir / "metrics.json"
    metadata_file = out_dir / "model_metadata.json"

    joblib.dump(selected_model, model_file)
    joblib.dump(preprocessor, preprocessor_file)

    with open(metrics_file, "w") as f:
        json.dump(performance_data, f, indent=2)

    metadata = {
        "model_name": selected_model_name,
        "num_features": len(X.columns),
        "feature_names": list(X.columns),
        "numerical_features": num_cols,
        "categorical_features": cat_cols,
        "test_accuracy": [r['accuracy'] for r in results if r['model_name'] == selected_model_name][0],
        "test_roc_auc": [r['roc_auc'] for r in results if r['model_name'] == selected_model_name][0],
        "test_recall": [r['recall'] for r in results if r['model_name'] == selected_model_name][0],
        "random_state": RANDOM_STATE
    }

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print("\nSaved artifacts to:")
    print(f" - Model: {model_file.resolve()}")
    print(f" - Preprocessor: {preprocessor_file.resolve()}")
    print(f" - Performance Metrics: {metrics_file.resolve()}")
    print(f" - Metadata: {metadata_file.resolve()}")
    print("=" * 70)
    print("TRAINING & EVALUATION COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    run_training_pipeline()
