from ..database import customeriq_db


class AnalyticsService:
    def overview(self) -> dict:
        query = """
            SELECT
                COUNT(*) AS total_customers,
                SUM(CASE WHEN risk_segment='HIGH' THEN 1 ELSE 0 END) AS high_risk_customers,
                SUM(CASE WHEN risk_segment='MEDIUM' THEN 1 ELSE 0 END) AS medium_risk_customers,
                SUM(CASE WHEN risk_segment='LOW' THEN 1 ELSE 0 END) AS low_risk_customers,
                ROUND(SUM(monetary), 2) AS total_monetary_value,
                ROUND(SUM(revenue_exposure), 2) AS total_revenue_exposure,
                ROUND(AVG(churn_probability), 4) AS average_churn_probability,
                ROUND(AVG(average_order_value), 2) AS average_order_value
            FROM customer_risk
        """
        row = customeriq_db.fetch_one(query)
        return dict(row)

    def risk_distribution(self) -> list[dict]:
        query = """
            SELECT risk_segment,
                   COUNT(*) AS customer_count,
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_risk), 2) AS percentage
            FROM customer_risk
            GROUP BY risk_segment
            ORDER BY CASE risk_segment WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END
        """
        rows = customeriq_db.fetch_all(query)
        return [dict(row) for row in rows]

    def value_vs_risk(self, limit: int = 100) -> list[dict]:
        query = """
            SELECT customer_id, churn_probability, risk_segment,
                   monetary, revenue_exposure
            FROM customer_risk
            ORDER BY churn_probability DESC, monetary DESC
            LIMIT ?
        """
        rows = customeriq_db.fetch_all(query, (limit,))
        return [dict(row) for row in rows]

    def priority_customers(self, limit: int = 20) -> list[dict]:
        query = """
            SELECT customer_id, churn_probability, risk_segment,
                   monetary, revenue_exposure, recency, frequency,
                   ROUND(revenue_exposure, 2) AS priority_score
            FROM customer_risk
            ORDER BY revenue_exposure DESC, churn_probability DESC
            LIMIT ?
        """
        rows = customeriq_db.fetch_all(query, (limit,))
        result = []
        for row in rows:
            segment = row['risk_segment']
            score = row['priority_score']
            result.append({
                "customer_id": row['customer_id'],
                "risk_segment": segment,
                "churn_probability": row['churn_probability'],
                "monetary": row['monetary'],
                "revenue_exposure": row['revenue_exposure'],
                "priority_score": score,
                "recency": row['recency'],
                "frequency": row['frequency'],
                "rationale": f"Priority rule: revenue exposure first, then churn probability for {segment} customer.",
            })
        return result
