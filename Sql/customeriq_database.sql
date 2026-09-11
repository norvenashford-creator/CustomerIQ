-- ==========================================
-- CustomerIQ — SQL Schema and Data Model
-- Day 9 Database Initialization Script
-- Database engine: SQLite
-- ==========================================

-- Drop table if exists to ensure clean run
DROP TABLE IF EXISTS customer_risk;

-- 1. Create the main customer risk table with appropriate data types and constraints
CREATE TABLE customer_risk (
    customer_id INTEGER PRIMARY KEY,
    churn_probability REAL NOT NULL CHECK(churn_probability >= 0.0 AND churn_probability <= 1.0),
    risk_segment TEXT NOT NULL CHECK(risk_segment IN ('HIGH', 'MEDIUM', 'LOW')),
    frequency INTEGER NOT NULL CHECK(frequency >= 0),
    monetary REAL NOT NULL,
    recency INTEGER NOT NULL CHECK(recency >= 0),
    customer_lifespan INTEGER NOT NULL CHECK(customer_lifespan >= 0),
    avg_purchase_interval REAL NOT NULL,
    median_purchase_interval REAL NOT NULL,
    -- Derived Business Fields
    average_order_value REAL NOT NULL,
    revenue_exposure REAL NOT NULL
);

-- 2. Create performance indexes for frequent query access paths
CREATE INDEX idx_customer_risk_segment ON customer_risk(risk_segment);
CREATE INDEX idx_customer_churn_prob ON customer_risk(churn_probability);
CREATE INDEX idx_customer_recency ON customer_risk(recency);
CREATE INDEX idx_customer_monetary ON customer_risk(monetary);

-- 3. Initial Validation Queries (to verify data loading integrity)
-- These can be run after the table is populated to ensure all records match expectations.

-- Count total records (Expected: 3,705)
-- SELECT COUNT(*) AS total_customers FROM customer_risk;

-- Check for NULLs in critical fields (Expected: 0)
-- SELECT COUNT(*) AS null_count FROM customer_risk 
-- WHERE customer_id IS NULL OR churn_probability IS NULL OR risk_segment IS NULL;

-- Count unique risk segments (Expected: HIGH, MEDIUM, LOW only, total count = 3)
-- SELECT risk_segment, COUNT(*) AS customer_count FROM customer_risk GROUP BY risk_segment;
