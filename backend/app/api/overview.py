from fastapi import APIRouter

from ..services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()


@router.get("/api/overview")
def get_overview():
    """Return high-level CustomerIQ portfolio metrics."""
    return service.overview()
