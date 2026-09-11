import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "Data" / "Processed" / "customer_churn_analysis.csv"
MODEL_PATH = ROOT / "Models" / "customeriq_gradient_boosting_model.joblib"
METADATA_PATH = ROOT / "Models" / "customeriq_model_metadata.json"

FEATURES = [
    "Frequency",
    "Monetary",
    "Recency",
    "Customer Lifespan",
    "Average Purchase Interval",
    "Median Purchase Interval",
]
TARGET = "observed_churn"


def main():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=FEATURES + [TARGET])
    X = df[FEATURES]
    y = df[TARGET].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    model = GradientBoostingClassifier(random_state=42)
    model.fit(X_train, y_train)

    proba = model.predict_proba(X_test)[:, 1]
    preds = model.predict(X_test)

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, preds)), 6),
        "precision": round(float(precision_score(y_test, preds, zero_division=0)), 6),
        "recall": round(float(recall_score(y_test, preds, zero_division=0)), 6),
        "f1": round(float(f1_score(y_test, preds, zero_division=0)), 6),
        "roc_auc": round(float(roc_auc_score(y_test, proba)), 6),
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    metadata = {
        "model_name": "CustomerIQ Gradient Boosting Churn Risk Model",
        "model_version": "v1.0.0",
        "training_date": "2026-09-11",
        "feature_list": FEATURES,
        "target": TARGET,
        "validation_metrics": metrics,
        "training_data_reference": str(DATA_PATH.relative_to(ROOT)),
        "artifact_path": str(MODEL_PATH.relative_to(ROOT)),
        "risk_thresholds": {
            "HIGH": {"operator": ">=", "value": 0.70},
            "MEDIUM": {"operator": "between", "value_range": [0.40, 0.70]},
            "LOW": {"operator": "<", "value": 0.40},
        },
    }

    METADATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    METADATA_PATH.write_text(json.dumps(metadata, indent=2))

    print(f"Saved model artifact: {MODEL_PATH}")
    print(f"Saved metadata: {METADATA_PATH}")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
