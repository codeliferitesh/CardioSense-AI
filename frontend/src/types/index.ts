export interface PatientInput {
  age: number;
  sex: number; // 0 = Female, 1 = Male
  cp: number; // 0: Typical angina, 1: Atypical angina, 2: Non-anginal pain, 3: Asymptomatic
  trestbps: number; // Resting BP (mm Hg)
  chol: number; // Serum Cholesterol (mg/dl)
  fbs: number; // Fasting Blood Sugar > 120 mg/dl (0 = False, 1 = True)
  restecg: number; // 0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy
  thalach: number; // Max heart rate achieved (bpm)
  exang: number; // Exercise-induced angina (0 = No, 1 = Yes)
  oldpeak: number; // ST depression (float)
  slope: number; // 0: Upsloping, 1: Flat, 2: Downsloping
  ca: number; // Number of major vessels (0-3 or 4)
  thal: number; // 1: Normal, 2: Fixed defect, 3: Reversible defect
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_category: string;
  model: string;
  risk_level?: 'Low' | 'Moderate' | 'High';
  clinical_summary?: string;
  key_contributing_factors?: string[];
  recommendations?: string[];
  timestamp?: string;
}

export interface ModelMetric {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: number[][]; // [[TN, FP], [FN, TP]]
  is_selected?: boolean;
}

export interface FeatureImportanceItem {
  feature: string;
  name: string;
  importance: number;
  category: 'Demographics' | 'Cardiovascular' | 'Electrocardiogram & Stress' | 'Anatomical';
}

export interface ModelPerformanceData {
  dataset_summary: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    num_features: number;
    target_distribution: {
      lower_risk_count: number;
      higher_risk_count: number;
      lower_risk_pct: number;
      higher_risk_pct: number;
    };
  };
  selected_model: string;
  selection_rationale: string;
  models: ModelMetric[];
  feature_importance: FeatureImportanceItem[];
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name: string;
  timestamp: string;
}
