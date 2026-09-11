# CustomerIQ Architecture

CustomerIQ maintains an additive read-only API over the repository’s validated SQLite database. The data and modeling artifacts in the notebooks and processed CSV files are treated as the source-of-truth analytics definitions.

## Layers

1. Data validation and cleaning
2. Customer behavior analytics and churn methodology
3. Predictive modeling and model-comparison outputs
4. Customer risk scoring with validated segments and probability predictions
5. SQLite persistence in `customer_risk`
6. FastAPI route/service/database access
7. Static dashboard frontend contract
8. Documentation and handoff layer

## Database

The database source is:

`Sql/customeriq.db`

The API reads from the customer-level risk table:

`customer_risk`

## API

Routes:

- `/health`
- `/api/overview`
- `/api/customers`
- `/api/customers/{customer_id}`
- `/api/customers/priority`
- `/api/analytics/risk-distribution`
- `/api/analytics/value-vs-risk`

## Risk formula

High risk = churn_probability >= 0.70
Medium risk = 0.40 <= churn_probability < 0.70
Low risk = churn_probability < 0.40

Revenue exposure = monetary * churn_probability
Average order value = monetary / frequency
