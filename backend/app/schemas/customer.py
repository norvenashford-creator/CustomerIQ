from typing import Optional
from pydantic import BaseModel, Field


class CustomerRisk(BaseModel):
    customer_id: int
    churn_probability: float = Field(..., ge=0.0, le=1.0)
    risk_segment: str
    frequency: int
    monetary: float
    recency: int
    customer_lifespan: int
    avg_purchase_interval: float
    median_purchase_interval: float
    average_order_value: float
    revenue_exposure: float


class CustomerRiskListItem(BaseModel):
    customer_id: int
    churn_probability: float
    risk_segment: str
    monetary: float
    frequency: int
    recency: int


class CustomerCreate(BaseModel):
    customer_id: int
