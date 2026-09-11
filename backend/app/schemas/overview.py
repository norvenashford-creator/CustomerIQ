from pydantic import BaseModel


class Overview(BaseModel):
    total_customers: int
    high_risk_customers: int
    medium_risk_customers: int
    low_risk_customers: int
    total_monetary_value: float
    total_revenue_exposure: float
    average_churn_probability: float
