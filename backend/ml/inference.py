import json
import os
from pathlib import Path

import joblib
import pandas as pd


FEATURES = [
    'Frequency',
    'Monetary',
    'Recency',
    'Customer Lifespan',
    'Average Purchase Interval',
    'Median Purchase Interval',
]

RISK_THRESHOLDS = {
    'HIGH': 0.70,
    'MEDIUM_MIN': 0.40,
    'LOW_MAX': 0.40,
}


class CustomerIQInference:
    def __init__(self, model_path=None, metadata_path=None):
        root = Path(__file__).resolve().parents[2]
        self.model_path = Path(model_path or root / 'Models' / 'customeriq_gradient_boosting_model.joblib')
        self.metadata_path = Path(metadata_path or root / 'Models' / 'customeriq_model_metadata.json')
        self.model = None
        self.metadata = None
        self._load_model_and_metadata()

    def _load_model_and_metadata(self):
        if not self.model_path.exists():
            raise FileNotFoundError(f'Model artifact not found at {self.model_path}')
        if not self.metadata_path.exists():
            raise FileNotFoundError(f'Model metadata not found at {self.metadata_path}')

        self.model = joblib.load(self.model_path)
        self.metadata = json.loads(self.metadata_path.read_text())

    def validate_customer_record(self, record):
        required = FEATURES + ['customer_id']
        missing = [field for field in required if field not in record]
        if missing:
            raise ValueError(f'Invalid customer feature input: missing required fields: {missing}')

        for field in FEATURES:
            if record[field] is None or pd.isna(record[field]):
                raise ValueError(f'Invalid customer feature input: field {field} is null or missing')

        if not isinstance(record['customer_id'], int):
            raise ValueError('Invalid customer feature input: customer_id must be an integer')

        return True

    def _risk_segment_for_probability(self, prob):
        if prob >= 0.70:
            return 'HIGH'
        if prob >= 0.40:
            return 'MEDIUM'
        return 'LOW'

    def predict_from_customer_record(self, record):
        self.validate_customer_record(record)
        row = pd.DataFrame([{
            'Frequency': record['Frequency'],
            'Monetary': record['Monetary'],
            'Recency': record['Recency'],
            'Customer Lifespan': record['Customer Lifespan'],
            'Average Purchase Interval': record['Average Purchase Interval'],
            'Median Purchase Interval': record['Median Purchase Interval'],
        }])
        prob = float(self.model.predict_proba(row)[0, 1])
        if prob < 0.0 or prob > 1.0:
            raise ValueError('Prediction produced an invalid churn probability outside [0, 1]')

        segment = self._risk_segment_for_probability(prob)
        monetary = float(record['Monetary'])
        revenue_exposure = monetary * prob

        return {
            'customer_id': int(record['customer_id']),
            'churn_probability': prob,
            'risk_segment': segment,
            'monetary': monetary,
            'revenue_exposure': revenue_exposure,
            'model_name': self.metadata.get('model_name'),
            'model_version': self.metadata.get('model_version'),
            'risk_thresholds': self.metadata.get('risk_thresholds'),
            'prediction_source': 'CustomerIQGradientBoostingInference',
        }
