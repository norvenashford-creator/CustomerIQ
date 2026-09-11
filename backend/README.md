# CustomerIQ Backend

This backend is the additive API layer for the existing CustomerIQ repository. It reads from the validated SQLite database in `Sql/customeriq.db` and exposes the existing customer intelligence through a minimal FastAPI service.

## Local run

```bash
CUSTOMERIQ_DB_PATH=Sql/customeriq.db uvicorn backend.app.main:app --reload
```

## Endpoints

- `GET /health`
- `GET /api/overview`
- `GET /api/customers`
- `GET /api/customers/{customer_id}`
- `GET /api/customers/priority`
- `GET /api/analytics/risk-distribution`
- `GET /api/analytics/value-vs-risk`
