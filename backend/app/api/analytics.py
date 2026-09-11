from fastapi import APIRouter, Query

from ..services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()


@router.get("/api/analytics/risk-distribution")
def get_risk_distribution():
    """Return the distribution of HIGH, MEDIUM, and LOW risk customers."""
    return {"segments": service.risk_distribution()}


@router.get("/api/analytics/value-vs-risk")
def get_value_vs_risk(limit: int = Query(default=100, ge=1, le=1000)):
    """Return a value-vs-risk point view for downstream frontends."""
    return {"items": service.value_vs_risk(limit=limit)}
