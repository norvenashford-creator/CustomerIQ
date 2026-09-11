# CustomerIQ AI Studio Handoff

## Product

CustomerIQ is a customer retention intelligence product that turns validated transactional behavior data and a trained churn model into a customer-level risk and revenue-exposure intelligence layer. The system reads from the SQLite source-of-truth table `customer_risk`, provides an API contract, and supports a static frontend dashboard contract.

## Architecture

The repository follows a layered pipeline:

DATA → VALIDATION → CLEANING → FEATURE ENGINEERING → MODEL INFERENCE → CHURN PROBABILITY → RISK SEGMENT → REVENUE EXPOSURE → API → STATIC FRONTEND

The analytic source of truth is the existing CSV and SQL artifacts in the repository. The database source of truth is `Sql/customeriq.db` and the table `customer_risk`.

## Data Flow

1. Raw/cleaned retail data is validated and shaped into `Data/Processed/customer_risk_scores.csv`.
2. Derived CustomerIQ fields are loaded into `Sql/customeriq.db` as `customer_risk`.
3. FastAPI reads the database through `backend/app/database.py` and serves read-only routes.
4. The frontend consumes the API at `http://127.0.0.1:8000`.

## Database

Database: `Sql/customeriq.db`
Primary table: `customer_risk`
Key columns:
- `customer_id`
- `churn_probability`
- `risk_segment`
- `frequency`
- `monetary`
- `recency`
- `customer_lifespan`
- `avg_purchase_interval`
- `median_purchase_interval`
- `average_order_value`
- `revenue_exposure`

## ML Pipeline

The repository methodology identifies Gradient Boosting as the selected model from the comparison notebook and validation CSV. The model artifact is not committed directly in the repository; the reproducible source is the final Day 6/7 model comparison and validation outputs.

Selected model: Gradient Boosting

Training:
- Existing methodology from notebooks and CSV metrics.
- Target: churn outcome / predicted churn probability.
- Features: existing behavioral features from the customer-risk score and behavioral scoring artifact.

Inference:
- Load the validated `customer_risk` table from SQLite.
- Generate probability and risk segment from the model output and rules.
- Compute average order value and revenue exposure using the repository formulas.

## Risk Logic

Risk thresholds used by the system:

- HIGH: `churn_probability >= 0.70`
- MEDIUM: `0.40 <= churn_probability < 0.70`
- LOW: `churn_probability < 0.40`

Derived formulas:

- `average_order_value = monetary / frequency`
- `revenue_exposure = monetary * churn_probability`

The database table already materializes `average_order_value` and `revenue_exposure`.

## Customer Intelligence

Each customer record in the API should expose:

- `customer_id`
- `churn_probability`
- `risk_segment`
- `frequency`
- `monetary`
- `recency`
- `customer_lifespan`
- `avg_purchase_interval`
- `median_purchase_interval`
- `average_order_value`
- `revenue_exposure`

## Marketing Intelligence

Marketing intelligence is a separate, rule-based recommendation layer. It uses behavioral signals plus the ML prediction and business rules to generate retention recommendations without claiming causal certainty.

## Case Study System

CustomerIQ should distinguish the source of evidence:

CUSTOMER DATA → MODEL PREDICTION → BUSINESS RULE → CASE-STUDY EVIDENCE → MARKETING RECOMMENDATION

The repository includes a case-study knowledge framework directory at `docs/marketing_case_studies/` and a source-backed knowledge module in `backend/knowledge/`.

The new evidence-aware route should return a JSON object in this form:

```json
{
  "customer_id": 12346,
  "risk_segment": "HIGH",
  "churn_probability": 0.5996865081,
  "revenue_exposure": 77556.46,
  "key_behavioral_signals": [
    "HIGH RISK + HIGH VALUE",
    "HIGH RISK",
    "LONG RECENCY"
  ],
  "lifecycle_context": "high-risk high-value lifecycle",
  "potential_strategy": "Personalized win-back / service-recovery journey",
  "recommended_channel": "customer success + email",
  "relevant_case_studies": [
    {
      "company": "Blacklane",
      "source_url": "https://www.blacklane.com/",
      "evidence_quality": "Medium-high",
      "customeriq_signal_mapping": {
        "risk_segment": "HIGH",
        "monetary": ">= 5000.0",
        "recency": ">= 180"
      }
    }
  ],
  "evidence_strength": "Medium-high",
  "rationale": "Source-backed case studies provide a transparent precedent for signal patterns; they do not prove that the same intervention will work for this customer.",
  "limitations": "Evidence is observational and contextual; outcomes are not guaranteed. CustomerIQ must compare against a holdout/control group before scaling.",
  "test_recommendation": "Compare against a holdout/control group before scaling."
}
```

The future Google AI Studio front-end should be able to answer:

- Why is this customer at risk?
- What signals are driving the risk?
- What could we potentially do?
- What real-world evidence supports this strategy?
- What are the limitations?

The evidence layer must preserve a strict distinction between:

A. Source-supported facts
B. CustomerIQ interpretation
C. Potential recommendation

In no case should interpretation be represented as a fact the source organization actually performed, and the system must avoid causality claims unless the source explicitly establishes causality.

## API

Includes endpoints:

- `GET /health`
- `GET /api/overview`
- `GET /api/customers`
- `GET /api/customers/{customer_id}`
- `GET /api/customers/priority`
- `GET /api/analytics/risk-distribution`
- `GET /api/analytics/value-vs-risk`

## Frontend Requirements

The frontend must consume this API rather than re-create calculations. It must present the dashboard contract:

1. Executive overview
2. Risk intelligence
3. Revenue at risk
4. Value vs risk
5. Priority customers
6. Customer explorer
7. Customer profile
8. Retention intelligence
9. Marketing playbook / case studies

The frontend must not invent new thresholds, ML calculations, or causal explanations. It should display transparent signals only.

## OpenAPI

FastAPI provides default OpenAPI docs at `/docs` and `/openapi.json` when the app is running.

## Endpoint Contract

For every route the contract is:

- `GET /api/overview`
  - Parameters: none
  - Response: summary metrics
  - Errors: 500 only from service/data layer

- `GET /api/customers`
  - Parameters: `risk_segment`, `min_churn`, `max_churn`, `offset`, `limit`, `sort`
  - Response: `{items, offset, limit, count}`
  - Errors: `422` for invalid sort/risk or out-of-range churn bounds

- `GET /api/customers/{customer_id}`
  - Parameters: `customer_id`
  - Response: customer risk profile object
  - Errors: `404` for missing customer

- `GET /api/customers/priority`
  - Parameters: `limit`
  - Response: `{items}`

- `GET /api/analytics/risk-distribution`
  - Parameters: none
  - Response: `{segments}` list of risk buckets

- `GET /api/analytics/value-vs-risk`
  - Parameters: `limit`
  - Response: `{items}` list of points
