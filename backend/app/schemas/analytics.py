from typing import List
from pydantic import BaseModel


class RiskBucket(BaseModel):
    risk_segment: str
    customer_count: int
    percentage: float


class RiskDistribution(BaseModel):
    segments: List[RiskBucket]


class ValueRiskPoint(BaseModel):
    customer_id: int
    churn_probability: float
    risk_segment: str
    monetary: float
    revenue_exposure: float


class PriorityCustomer(BaseModel):
    customer_id: int
    risk_segment: str
    churn_probability: float
    monetary: float
    revenue_exposure: float
    priority_score: float
    rationale: str
