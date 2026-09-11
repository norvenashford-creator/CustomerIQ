-- ==========================================
-- CustomerIQ — Business Analytics Queries
-- Day 9 SQL Business Intelligence Layer
-- Database engine: SQLite
-- ==========================================

-- 1. Total Customers
-- Count of unique customers in the scored dataset.
SELECT 
    COUNT(*) AS total_customers 
FROM customer_risk;


-- 2. HIGH/MEDIUM/LOW Risk Counts
-- Count of customers belonging to each risk segment.
SELECT 
    risk_segment, 
    COUNT(*) AS customer_count 
FROM customer_risk 
GROUP BY risk_segment
ORDER BY 
    CASE risk_segment 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
    END;


-- 3. Risk Percentage Distribution
-- Percentage breakdown of the customer base by risk segment.
SELECT 
    risk_segment, 
    COUNT(*) AS customer_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_risk), 2) AS risk_percentage
FROM customer_risk 
GROUP BY risk_segment
ORDER BY 
    CASE risk_segment 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
    END;


-- 4. Average Churn Probability by Risk Segment
-- Mean predictive churn probability within each segment to validate scoring ranges.
SELECT 
    risk_segment, 
    ROUND(AVG(churn_probability), 4) AS average_churn_probability,
    ROUND(MIN(churn_probability), 4) AS min_churn_probability,
    ROUND(MAX(churn_probability), 4) AS max_churn_probability
FROM customer_risk 
GROUP BY risk_segment
ORDER BY average_churn_probability DESC;


-- 5. Highest-Risk Customers
-- Top 20 customers with the absolute highest churn probability.
SELECT 
    customer_id, 
    churn_probability, 
    risk_segment, 
    monetary, 
    frequency, 
    recency
FROM customer_risk 
ORDER BY churn_probability DESC 
LIMIT 20;


-- 6. Customers with Highest Monetary Value and High Churn Risk
-- Identifying high-value customers (monetary spend) who are in the HIGH risk segment.
SELECT 
    customer_id, 
    monetary, 
    churn_probability, 
    risk_segment, 
    frequency, 
    recency
FROM customer_risk 
WHERE risk_segment = 'HIGH' 
ORDER BY monetary DESC 
LIMIT 20;


-- 7. Customers with High Frequency but High Churn Risk
-- Identifying highly active buyers (transaction count) who are at high risk of churning.
SELECT 
    customer_id, 
    frequency, 
    churn_probability, 
    risk_segment, 
    monetary, 
    recency
FROM customer_risk 
WHERE risk_segment = 'HIGH' 
ORDER BY frequency DESC 
LIMIT 20;


-- 8. Revenue Exposure by Risk Segment
-- Financial impact analysis: aggregate spent amount (monetary value) and expected revenue loss (exposure) by risk.
SELECT 
    risk_segment, 
    COUNT(*) AS customer_count,
    ROUND(SUM(monetary), 2) AS total_monetary_value,
    ROUND(SUM(revenue_exposure), 2) AS expected_revenue_exposure,
    ROUND(AVG(churn_probability), 4) AS average_churn_probability
FROM customer_risk 
GROUP BY risk_segment
ORDER BY 
    CASE risk_segment 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
    END;


-- 9. Customer Distribution by Behavioral Characteristics
-- Analysis of how customer risk aligns with Recency segments and Purchase Frequency buckets.

-- 9a. Recency Segments Distribution
SELECT 
    CASE 
        WHEN recency <= 30 THEN 'Active (0-30 days)'
        WHEN recency <= 90 THEN 'Recent (31-90 days)'
        WHEN recency <= 180 THEN 'Lapsing (91-180 days)'
        ELSE 'Inactive (180+ days)'
    END AS recency_bucket,
    COUNT(*) AS customer_count,
    ROUND(AVG(churn_probability), 4) AS average_churn_probability,
    ROUND(SUM(monetary), 2) AS total_monetary_value
FROM customer_risk
GROUP BY recency_bucket
ORDER BY recency_bucket;

-- 9b. Purchase Frequency Segments Distribution
SELECT 
    CASE 
        WHEN frequency = 1 THEN 'One-time buyer'
        WHEN frequency <= 5 THEN 'Occasional (2-5)'
        WHEN frequency <= 10 THEN 'Frequent (6-10)'
        ELSE 'Loyal (10+)'
    END AS frequency_bucket,
    COUNT(*) AS customer_count,
    ROUND(AVG(churn_probability), 4) AS average_churn_probability,
    ROUND(SUM(monetary), 2) AS total_monetary_value
FROM customer_risk
GROUP BY frequency_bucket
ORDER BY frequency_bucket;


-- 10. Power BI-ready Summary Table
-- A unified summary table compiling all essential high-level KPI metrics per risk segment.
SELECT 
    risk_segment,
    COUNT(*) AS total_customers,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_risk), 2) AS pct_customers,
    ROUND(AVG(churn_probability), 4) AS avg_churn_probability,
    ROUND(AVG(monetary), 2) AS avg_monetary_value,
    ROUND(SUM(monetary), 2) AS total_monetary_value,
    ROUND(AVG(recency), 1) AS avg_recency_days,
    ROUND(AVG(frequency), 1) AS avg_purchase_frequency,
    ROUND(SUM(revenue_exposure), 2) AS total_revenue_exposure
FROM customer_risk
GROUP BY risk_segment
ORDER BY 
    CASE risk_segment
        WHEN 'HIGH' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 3
    END;
