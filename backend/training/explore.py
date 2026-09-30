import pandas as pd
import numpy as np
import json
from pathlib import Path

def explore_data(data_path: str = "data/heart_disease.csv"):
    path = Path(data_path)
    if not path.exists():
        # check parent
        path = Path("../data/heart_disease.csv")
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    df = pd.read_csv(path)
    print("=" * 60)
    print("DATASET OVERVIEW")
    print("=" * 60)
    print(f"Total Rows: {len(df)}")
    print(f"Total Columns: {len(df.columns)}")
    print("\nColumns and Data Types:")
    print(df.dtypes)

    print("\nMissing Values Count per Column:")
    print(df.isnull().sum())

    duplicates = df.duplicated().sum()
    print(f"\nDuplicate Rows Count: {duplicates}")

    print("\nTarget Class Distribution:")
    target_counts = df['target'].value_counts()
    print(target_counts)
    print("Class Percentages:")
    print(df['target'].value_counts(normalize=True) * 100)

    print("\nUnique Values per Categorical/Discrete Feature:")
    discrete_cols = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal']
    for col in discrete_cols:
        if col in df.columns:
            print(f"  {col}: unique values = {sorted(df[col].unique().tolist())}, value counts = {dict(df[col].value_counts())}")

    print("\nNumerical Features Summary:")
    num_cols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    print(df[num_cols].describe().T[['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']])

    print("=" * 60)

if __name__ == "__main__":
    explore_data()
