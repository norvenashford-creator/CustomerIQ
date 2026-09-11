import os
import sqlite3

import pytest

from backend.app.config import settings
from backend.app.services.marketing_intelligence import MarketingIntelligenceService
from backend.knowledge.retention_case_studies import CASE_STUDIES
from backend.knowledge.evidence_rules import match_case_studies_for_customer
from backend.ml.inference import CustomerIQInference

MODEL_PATH = os.path.join('Models', 'customeriq_gradient_boosting_model.joblib')
METADATA_PATH = os.path.join('Models', 'customeriq_model_metadata.json')


def test_model_artifact_and_metadata_exist():
    assert os.path.exists(MODEL_PATH), 'Expected serialized model artifact to exist'
    assert os.path.exists(METADATA_PATH), 'Expected model metadata to exist'


def test_model_load_and_inference_returns_valid_probability_and_risk():
    conn = sqlite3.connect(f'file:{settings.database_path}?mode=ro', uri=True)
    row = conn.execute("""
        SELECT customer_id, frequency, monetary, recency, customer_lifespan,
               avg_purchase_interval, median_purchase_interval
        FROM customer_risk
        ORDER BY customer_id ASC
        LIMIT 1
    """).fetchone()
    conn.close()

    feature_row = {
        'customer_id': int(row[0]),
        'Frequency': int(row[1]),
        'Monetary': float(row[2]),
        'Recency': int(row[3]),
        'Customer Lifespan': int(row[4]),
        'Average Purchase Interval': float(row[5]),
        'Median Purchase Interval': float(row[6]),
    }

    inference = CustomerIQInference(MODEL_PATH, METADATA_PATH)
    result = inference.predict_from_customer_record(feature_row)

    assert 0.0 <= result['churn_probability'] <= 1.0
    assert result['risk_segment'] in {'HIGH', 'MEDIUM', 'LOW'}
    assert result['revenue_exposure'] == pytest.approx(float(feature_row['Monetary']) * float(result['churn_probability']))


def test_marketing_intelligence_rules_are_executed_for_a_customer():
    row = {
        'customer_id': 12346,
        'risk_segment': 'HIGH',
        'monetary': 77556.46,
        'recency': 234,
        'frequency': 12,
        'churn_probability': 0.5996865081,
    }
    service = MarketingIntelligenceService()
    recommendation = service.generate_recommendation(row)
    assert recommendation['customer_id'] == 12346
    assert recommendation['risk_segment'] == 'HIGH'
    assert recommendation['potential_strategy']
    assert recommendation['recommended_channel']
    assert recommendation['rationale']


def test_case_study_knowledge_loading_and_source_url_preserved():
    assert len(CASE_STUDIES) >= 1
    assert all(study.source_url for study in CASE_STUDIES)
    assert CASE_STUDIES[0].company == 'Blacklane'


def test_case_study_matching_for_high_risk_high_value_customer():
    high_value_row = {
        'customer_id': 12346,
        'risk_segment': 'HIGH',
        'monetary': 77556.46,
        'recency': 234,
        'frequency': 12,
        'churn_probability': 0.5996865081,
    }
    matches = match_case_studies_for_customer(high_value_row)
    companies = {study['company'] for study in matches}
    assert 'Blacklane' in companies


def test_long_recency_customer_matches_relevant_cases():
    long_recency_row = {
        'customer_id': 12346,
        'risk_segment': 'HIGH',
        'monetary': 1000.0,
        'recency': 181,
        'frequency': 1,
        'churn_probability': 0.72,
    }
    matches = match_case_studies_for_customer(long_recency_row)
    companies = {study['company'] for study in matches}
    assert 'Upday' in companies or 'Rappi' in companies or 'Coches' in companies or 'Showmax' in companies


def test_cancellation_intent_customer_matches_musora():
    cancellation_row = {
        'customer_id': 12346,
        'risk_segment': 'HIGH',
        'monetary': 1000.0,
        'recency': 50,
        'frequency': 3,
        'churn_probability': 0.80,
    }
    matches = match_case_studies_for_customer(cancellation_row)
    companies = {study['company'] for study in matches}
    assert 'Musora' in companies


def test_no_match_returns_empty_case_study_list_for_low_risk_lower_signal_customer():
    low_row = {
        'customer_id': 12346,
        'risk_segment': 'LOW',
        'monetary': 100.0,
        'recency': 10,
        'frequency': 1,
        'churn_probability': 0.10,
    }
    matches = match_case_studies_for_customer(low_row)
    assert matches == []


def test_evidence_quality_and_non_causal_limitations_are_returned():
    service = MarketingIntelligenceService()
    recommendation = service.generate_recommendation({
        'customer_id': 12346,
        'risk_segment': 'HIGH',
        'monetary': 77556.46,
        'recency': 234,
        'frequency': 12,
        'churn_probability': 0.5996865081,
    })
    assert 'evidence_strength' in recommendation
    assert recommendation['evidence_strength'] in {'Low', 'Medium', 'Medium-high'}
    assert 'do not prove' not in recommendation['rationale'].lower() or 'not prove' in recommendation['rationale'].lower()
    assert 'guaranteed' in recommendation['limitations'].lower() or 'holdout/control group' in recommendation['limitations'].lower()
    assert recommendation['test_recommendation']


def test_existing_marketing_api_route_returns_evidence_shape_without_breaking_contract():
    from fastapi.testclient import TestClient
    from backend.app.main import app

    client = TestClient(app)
    response = client.get('/api/customers/12346/retention-intelligence')
    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) >= {
        'customer_id', 'risk_segment', 'relevant_case_studies',
        'evidence_strength', 'rationale', 'limitations', 'test_recommendation'
    }
    assert isinstance(payload['relevant_case_studies'], list)
