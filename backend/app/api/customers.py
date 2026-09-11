from fastapi import APIRouter, HTTPException, Query

from ..services.customer_service import CustomerService

router = APIRouter()
service = CustomerService()


@router.get("/api/customers")
def get_customers(
    risk_segment: str | None = Query(default=None),
    min_churn: float | None = Query(default=None),
    max_churn: float | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    sort: str = Query(default="customer_id"),
):
    """Return a paginated customer list with basic filters and validated sort keys."""
    try:
        rows = service.get_customers(
            risk_segment=risk_segment,
            min_churn=min_churn,
            max_churn=max_churn,
            offset=offset,
            limit=limit,
            sort=sort,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {"items": rows, "offset": offset, "limit": limit, "count": len(rows)}


@router.get("/api/customers/priority")
def get_priority_customers(limit: int = Query(default=20, ge=1, le=50)):
    """Return a transparent, value-weighted priority customer view."""
    from ..services.analytics_service import AnalyticsService
    return {"items": AnalyticsService().priority_customers(limit=limit)}


@router.get("/api/customers/{customer_id}")
def get_customer(customer_id: int):
    """Return one customer-level CustomerIQ risk record."""
    row = service.get_customer(customer_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return row
