# CustomerIQ — Day 9 SQL & Business Intelligence Preparation

This document outlines the migration of the CustomerIQ project from Python-based machine learning files to a structured SQL database layer, preparing the data for the Power BI Business Intelligence dashboard.

---

## 1. Objective
The objective of Day 9 is to bridge the gap between Python/ML models and business users. By moving the predictive customer churn risk results from a raw CSV format into a SQLite database with computed business metrics, we enable fast, robust SQL queries and a direct interface for Power BI.

---

## 2. Input Dataset Profile
The input dataset used is `Data/Processed/customer_risk_scores.csv` (generated in Day 8). 
- **Row Count**: 3,705 unique customers.
- **Key Columns**:
  - `Customer ID` (Float representation in source CSV, representing unique identifier).
  - `churn_probability` (Predictive score between 0.0 and 1.0).
  - `risk_segment` (Categorical risk mapping: `HIGH`, `MEDIUM`, `LOW`).
  - `Frequency` (Total number of purchase transactions).
  - `Monetary` (Total monetary value/revenue spend).
  - `Recency` (Days since last purchase).
  - `Customer Lifespan` (Total active relationship duration in days).
  - `Average Purchase Interval` / `Median Purchase Interval` (Interval statistics).

---

## 3. SQL Data Model
A SQLite database was created at [`Sql/customeriq.db`](file:///d:/CustomerIQ/Sql/customeriq.db). The table structure, types, and constraints are defined in [`Sql/customeriq_database.sql`](file:///d:/CustomerIQ/Sql/customeriq_database.sql).

### Table Schema: `customer_risk`

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `customer_id` | INTEGER | PRIMARY KEY | Unique identifier (cast to integer from float) |
| `churn_probability` | REAL | NOT NULL, CHECK (0.0 to 1.0) | Prediction probability from gradient boosting model |
| `risk_segment` | TEXT | NOT NULL, CHECK (HIGH, MEDIUM, LOW) | Churn risk category |
| `frequency` | INTEGER | NOT NULL, CHECK (>= 0) | Count of orders |
| `monetary` | REAL | NOT NULL | Total expenditure amount |
| `recency` | INTEGER | NOT NULL, CHECK (>= 0) | Days since last transaction |
| `customer_lifespan` | INTEGER | NOT NULL, CHECK (>= 0) | Lifespan in days |
| `avg_purchase_interval` | REAL | NOT NULL | Average interval in days between orders |
| `median_purchase_interval`| REAL | NOT NULL | Median interval in days between orders |
| **`average_order_value`** | REAL | NOT NULL (Derived) | Calculated as: `monetary / frequency` |
| **`revenue_exposure`** | REAL | NOT NULL (Derived) | Expected loss: `monetary * churn_probability` |

### Indexes
For query speed optimization, indexes were created on:
* `risk_segment`
* `churn_probability`
* `recency`
* `monetary`

---

## 4. Key Business Analytics Queries & Results
Queries are stored in [`Sql/customeriq_business_queries.sql`](file:///d:/CustomerIQ/Sql/customeriq_business_queries.sql).

### Query 1: Total Scored Customers
```sql
SELECT COUNT(*) AS total_customers FROM customer_risk;
```
* **Result**: `3,705`

### Query 2: Risk Segment Distribution
```sql
SELECT risk_segment, COUNT(*) AS customer_count 
FROM customer_risk 
GROUP BY risk_segment;
```
* **Result**:
  * `HIGH`: 690 customers
  * `MEDIUM`: 1,511 customers
  * `LOW`: 1,504 customers

### Query 3: Risk Percentage Distribution
```sql
SELECT risk_segment, COUNT(*) AS customer_count,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_risk), 2) AS risk_percentage
FROM customer_risk GROUP BY risk_segment;
```
* **Result**:
  * `HIGH`: 18.62%
  * `MEDIUM`: 40.78%
  * `LOW`: 40.59%

### Query 4: Average Churn Probability by Risk Segment
```sql
SELECT risk_segment, ROUND(AVG(churn_probability), 4) AS average_churn_probability
FROM customer_risk GROUP BY risk_segment;
```
* **Result**:
  * `HIGH`: 0.8182
  * `MEDIUM`: 0.5601
  * `LOW`: 0.2098

### Query 8: Revenue Exposure by Risk Segment
Evaluating total customer monetary value and expected revenue exposure (monetary multiplied by churn probability):
```sql
SELECT risk_segment, 
       ROUND(SUM(monetary), 2) AS total_monetary_value,
       ROUND(SUM(revenue_exposure), 2) AS expected_revenue_exposure
FROM customer_risk GROUP BY risk_segment;
```
* **Result**:
  * `HIGH`: Total Spend: `$818,537.26` | Expected Revenue Loss: `$681,535.60` (83.2% exposure)
  * `MEDIUM`: Total Spend: `$2,199,169.53` | Expected Revenue Loss: `$1,211,308.76` (55.1% exposure)
  * `LOW`: Total Spend: `$10,376,429.96` | Expected Revenue Loss: `$1,269,208.59` (12.2% exposure)
  * **Aggregate Portfolio**: Total Spend: `$13,394,136.75` | Total Exposure: `$3,162,052.95` (23.6% average exposure)

### Query 9: Customer Distribution by Behavioral Characteristics
* **Recency Distribution**:
  * `Active (0-30 days)`: 868 customers (Avg Churn Prob: 0.2359)
  * `Recent (31-90 days)`: 828 customers (Avg Churn Prob: 0.3472)
  * `Lapsing (91-180 days)`: 703 customers (Avg Churn Prob: 0.4686)
  * `Inactive (180+ days)`: 1,306 customers (Avg Churn Prob: 0.6927)
* **Frequency Distribution**:
  * `Occasional (2-5 orders)`: 2,219 customers (Avg Churn Prob: 0.6042)
  * `Frequent (6-10 orders)`: 813 customers (Avg Churn Prob: 0.3425)
  * `Loyal (10+ orders)`: 673 customers (Avg Churn Prob: 0.1591)
  * *Note: There are no single-order (one-time) buyers in this dataset.*

---

## 5. Power BI Dataset Definition
The export dataset for Power BI is stored at [`Data/Processed/customeriq_powerbi_dataset.csv`](file:///d:/CustomerIQ/Data/Processed/customeriq_powerbi_dataset.csv). 
It contains 3,705 rows (plus headers) and contains both original metrics and the two new computed metrics:
* **`average_order_value`**: Enables Average Order Value (AOV) analyses.
* **`revenue_exposure`**: Represents the expected loss if the customer churns.

---

## 6. Validation Results (Day 9 verification script)
The verification script [`Sql/verify_day9.py`](file:///d:/CustomerIQ/Sql/verify_day9.py) was executed with the following results:
* **Row count**: 3,705 records (PASS)
* **One record per customer (unique customer IDs)**: No duplicates (PASS)
* **No missing critical fields**: 0 null records (PASS)
* **Risk categories**: Exactly `HIGH`, `MEDIUM`, `LOW` (PASS)
* **Churn probabilities**: Strictly between 0.0 and 1.0 (PASS)
* **Source file modification check**: `customer_risk_scores.csv` structure and contents completely unmodified (PASS)

---

## 7. Next Steps: Power BI Dashboard
The SQL database and clean CSV prepared in Day 9 enable:
1. **Direct Connection**: Connect Power BI Desktop to `customeriq_powerbi_dataset.csv` or `Sql/customeriq.db`.
2. **Visualizations**: Build dashboards depicting Churn Risk Segments, Revenue at Risk, Recency Cohorts, and top high-value/high-risk customers.
3. **Actionable Insights**: Support client retention teams by highlighting specific accounts for outreach based on monetary value and churn likelihood.
