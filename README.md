# CustomerIQ

CustomerIQ is a customer retention intelligence product powered by behavioral data and existing validated CustomerIQ analytics outputs. The project reads from the protected SQLite source-of-truth database in `Sql/customeriq.db` and exposes the analytics through a FastAPI backend and a lightweight static web dashboard.

## Architecture

Data -> ML -> SQLite customer_risk -> FastAPI backend -> frontend dashboard

## Backend

Install:

```bash
D:/CustomerIQ/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
```

Run:

```bash
D:/CustomerIQ/.venv/Scripts/python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

## Frontend

Serve locally:

```bash
python -m http.server 8080 --directory frontend
```

Then open: http://127.0.0.1:8080

## API

- `/health`
- `/api/overview`
- `/api/customers`
- `/api/customers/{customer_id}`
- `/api/customers/priority`
- `/api/analytics/risk-distribution`
- `/api/analytics/value-vs-risk`

## Database

The authoritative source is `Sql/customeriq.db` and the `customer_risk` table.

## Risk methodology

- HIGH: churn_probability >= 0.70
- MEDIUM: 0.40 <= churn_probability < 0.70
- LOW: churn_probability < 0.40

## Revenue exposure

Revenue exposure is derived as `monetary * churn_probability`.
