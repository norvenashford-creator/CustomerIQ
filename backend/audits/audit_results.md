# CustomerIQ Backend Audit

This audit compares the new FastAPI backend layer against the real SQLite source database in `Sql/customeriq.db` and the existing customer-risk export files.

## Source-of-truth compliance

- Reads from `Sql/customeriq.db`
- Uses table `customer_risk`
- Does not create, replace, or rewrite the existing database
- Uses the existing validated columns from the schema file

## Real-data checks

The backend route/service layer must be verified against the real SQLite database directly.

## Recommended audit list

1. `GET /health` should confirm database reachability and return customer count from the real table.
2. `GET /api/overview` should compare fields with SQL aggregates from `customer_risk`.
3. `GET /api/customers` should return real rows, support pagination, and validate risk segment and sort keys.
4. `GET /api/customers/{customer_id}` should return an actual customer row or a 404.
5. `GET /api/analytics/risk-distribution` should return the three distribution buckets.
6. `GET /api/analytics/value-vs-risk` should return customer_id, churn_probability, risk_segment, monetary, and revenue_exposure.
7. `GET /api/customers/priority` should return a transparent rule-based high-value/high-risk view.
