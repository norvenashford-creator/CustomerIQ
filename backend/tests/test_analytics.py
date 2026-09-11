import sqlite3

from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.main import app

client = TestClient(app)


def test_overview_matches_sqlite_source():
    response = client.get('/api/overview')
    assert response.status_code == 200
    payload = response.json()

    conn = sqlite3.connect(f"file:{settings.database_path}?mode=ro", uri=True)
    row = conn.execute("""
        SELECT
            COUNT(*) AS total_customers,
            SUM(CASE WHEN risk_segment='HIGH' THEN 1 ELSE 0 END) AS high_risk_customers,
            SUM(CASE WHEN risk_segment='MEDIUM' THEN 1 ELSE 0 END) AS medium_risk_customers,
            SUM(CASE WHEN risk_segment='LOW' THEN 1 ELSE 0 END) AS low_risk_customers,
            ROUND(SUM(monetary), 2) AS total_monetary_value,
            ROUND(SUM(revenue_exposure), 2) AS total_revenue_exposure,
            ROUND(AVG(churn_probability), 4) AS average_churn_probability,
            ROUND(AVG(average_order_value), 2) AS average_order_value
        FROM customer_risk
    """).fetchone()
    conn.close()

    expected = {
        'total_customers': row[0],
        'high_risk_customers': row[1],
        'medium_risk_customers': row[2],
        'low_risk_customers': row[3],
        'total_monetary_value': row[4],
        'total_revenue_exposure': row[5],
        'average_churn_probability': row[6],
        'average_order_value': row[7],
    }

    for key, value in expected.items():
        assert payload[key] == value


def test_risk_distribution_matches_real_segments():
    response = client.get('/api/analytics/risk-distribution')
    assert response.status_code == 200
    payload = response.json()
    assert 'segments' in payload
    assert len(payload['segments']) == 3

    conn = sqlite3.connect(f"file:{settings.database_path}?mode=ro", uri=True)
    rows = conn.execute("""
        SELECT risk_segment,
               COUNT(*) AS customer_count,
               ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_risk), 2) AS percentage
        FROM customer_risk
        GROUP BY risk_segment
        ORDER BY CASE risk_segment WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END
    """).fetchall()
    conn.close()

    expected_segments = {r['risk_segment'] for r in []}
    assert {x['risk_segment'] for x in payload['segments']} == {'HIGH', 'MEDIUM', 'LOW'}

    received = {item['risk_segment']: item['customer_count'] for item in payload['segments']}
    expected = {row[0]: row[1] for row in rows}
    assert received == expected


def test_value_vs_risk_endpoint_matches_real_data_shape():
    response = client.get('/api/analytics/value-vs-risk?limit=5')
    assert response.status_code == 200
    payload = response.json()
    assert 'items' in payload
    assert len(payload['items']) == 5

    for item in payload['items']:
        assert set(item) >= {'customer_id', 'churn_probability', 'risk_segment', 'monetary', 'revenue_exposure'}


def test_priority_endpoint_returns_real_priority_data():
    response = client.get('/api/customers/priority?limit=5')
    assert response.status_code == 200
    payload = response.json()
    assert 'items' in payload
    assert len(payload['items']) == 5
