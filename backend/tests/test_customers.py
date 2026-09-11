import sqlite3

from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.main import app

client = TestClient(app)


def test_customers_list():
    response = client.get('/api/customers?limit=5')
    assert response.status_code == 200
    payload = response.json()
    assert 'items' in payload
    assert payload['count'] == 5
    assert len(payload['items']) == 5


def test_customer_list_filters_and_sorting_validation():
    for segment in ['HIGH', 'MEDIUM', 'LOW']:
        response = client.get(f'/api/customers?risk_segment={segment}&limit=10')
        assert response.status_code == 200
        rows = response.json()['items']
        assert len(rows) == 10
        assert all(row['risk_segment'] == segment for row in rows)

    response = client.get('/api/customers?sort=monetary&limit=5')
    assert response.status_code == 200
    rows = response.json()['items']
    assert len(rows) == 5

    response = client.get('/api/customers?sort=not_a_field')
    assert response.status_code == 422

    response = client.get('/api/customers?risk_segment=VERY_HIGH')
    assert response.status_code == 422


def test_customer_detail_real_customer_exists_and_missing_is_404():
    conn = sqlite3.connect(f"file:{settings.database_path}?mode=ro", uri=True)
    customer_id = conn.execute("SELECT customer_id FROM customer_risk ORDER BY customer_id ASC LIMIT 1").fetchone()[0]
    conn.close()

    response = client.get(f'/api/customers/{customer_id}')
    assert response.status_code == 200
    payload = response.json()
    assert payload['customer_id'] == customer_id
    assert set(payload.keys()) >= {
        'customer_id', 'churn_probability', 'risk_segment', 'frequency', 'monetary', 'recency',
        'customer_lifespan', 'avg_purchase_interval', 'median_purchase_interval',
        'average_order_value', 'revenue_exposure'
    }

    response = client.get('/api/customers/999999')
    assert response.status_code == 404
