from fastapi import APIRouter, HTTPException, Query

from ..services.customer_service import CustomerService
from ..services.marketing_intelligence import MarketingIntelligenceService

router = APIRouter()
service = CustomerService()
marketing_service = MarketingIntelligenceService()


@router.get('/api/customers/{customer_id}/retention-intelligence')
def get_retention_intelligence(customer_id: int):
    """Return transparent, rule-based marketing intelligence for one customer."""
    row = service.get_customer(customer_id)
    if row is None:
        raise HTTPException(status_code=404, detail='Customer not found')

    # Normalize the database row shape to the service rule layer while
    # carrying through the validated revenue_exposure value from the
    # customer risk record, which is already joined into the row.
    marketing_input = {
        'customer_id': row['customer_id'],
        'risk_segment': row['risk_segment'],
        'monetary': row['monetary'],
        'recency': row['recency'],
        'frequency': row['frequency'],
        'churn_probability': row['churn_probability'],
        'revenue_exposure': row['revenue_exposure'],
    }
    return marketing_service.generate_recommendation(marketing_input)
