import sqlite3

from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.main import app

client = TestClient(app)


def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    payload = response.json()
    assert payload['status'] == 'ok'
    assert payload['database'] == 'connected'
    assert payload['app'] == 'CustomerIQ API'

    conn = sqlite3.connect(f"file:{settings.database_path}?mode=ro", uri=True)
    count = conn.execute("SELECT COUNT(*) FROM customer_risk").fetchone()[0]
    conn.close()
    assert payload['customer_count'] == count
