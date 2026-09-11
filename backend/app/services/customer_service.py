from ..database import customeriq_db


class CustomerService:
    ALLOWED_SORTS = {
        "customer_id",
        "churn_probability",
        "monetary",
        "recency",
        "frequency",
        "average_order_value",
        "revenue_exposure",
    }
    ALLOWED_SEGMENTS = {"HIGH", "MEDIUM", "LOW"}

    def get_customers(self, risk_segment: str | None = None, min_churn: float | None = None,
                      max_churn: float | None = None, offset: int = 0, limit: int = 50,
                      sort: str = "customer_id") -> list[dict]:
        where = []
        params: list = []

        if risk_segment:
            normalized = risk_segment.upper()
            if normalized not in self.ALLOWED_SEGMENTS:
                raise ValueError("risk_segment must be one of HIGH, MEDIUM, LOW")
            where.append("risk_segment = ?")
            params.append(normalized)

        if min_churn is not None:
            if min_churn < 0.0 or min_churn > 1.0:
                raise ValueError("min_churn must be between 0 and 1")
            where.append("churn_probability >= ?")
            params.append(min_churn)

        if max_churn is not None:
            if max_churn < 0.0 or max_churn > 1.0:
                raise ValueError("max_churn must be between 0 and 1")
            where.append("churn_probability <= ?")
            params.append(max_churn)

        if min_churn is not None and max_churn is not None and min_churn > max_churn:
            raise ValueError("min_churn cannot be greater than max_churn")

        where_sql = " AND ".join(where)
        if where_sql:
            where_sql = "WHERE " + where_sql

        if sort not in self.ALLOWED_SORTS:
            raise ValueError("sort must be one of customer_id, churn_probability, monetary, recency, frequency, average_order_value, revenue_exposure")

        query = f"""
            SELECT customer_id, churn_probability, risk_segment, monetary, frequency, recency,
                   average_order_value, revenue_exposure
            FROM customer_risk
            {where_sql}
            ORDER BY {sort} ASC
            LIMIT ? OFFSET ?
        """
        params.extend([limit, offset])

        with customeriq_db.connect() as conn:
            cur = conn.execute(query, tuple(params))
            rows = cur.fetchall()

        return [dict(row) for row in rows]

    def get_customer(self, customer_id: int) -> dict | None:
        query = """
            SELECT customer_id, churn_probability, risk_segment, frequency, monetary, recency,
                   customer_lifespan, avg_purchase_interval, median_purchase_interval,
                   average_order_value, revenue_exposure
            FROM customer_risk
            WHERE customer_id = ?
        """
        row = customeriq_db.fetch_one(query, (customer_id,))
        if row is None:
            return None
        return dict(row)
