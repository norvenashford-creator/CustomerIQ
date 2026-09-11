import os
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.overview import router as overview_router
from .api.customers import router as customers_router
from .api.analytics import router as analytics_router
from .api.marketing import router as marketing_router

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description="CustomerIQ backend exposing the validated SQLite customer risk intelligence layer.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(overview_router)
app.include_router(customers_router)
app.include_router(analytics_router)
app.include_router(marketing_router)


@app.get("/health")
def health_check():
    """Return a health check that confirms the real SQLite database can be reached."""
    db_ok = os.path.exists(settings.database_path)
    if not db_ok:
        return {"status": "error", "app": settings.app_title, "environment": settings.environment, "database": "missing"}

    try:
        conn = sqlite3.connect(f"file:{settings.database_path}?mode=ro", uri=True)
        row = conn.execute("SELECT COUNT(*) FROM customer_risk").fetchone()
        conn.close()
    except Exception:
        return {"status": "error", "app": settings.app_title, "environment": settings.environment, "database": "unreachable"}

    return {
        "status": "ok",
        "app": settings.app_title,
        "environment": settings.environment,
        "database": "connected",
        "database_path": settings.database_path,
        "customer_count": int(row[0]),
    }
