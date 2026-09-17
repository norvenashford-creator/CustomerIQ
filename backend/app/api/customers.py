from io import BytesIO

import pandas as pd
from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from ...ml.inference import CustomerIQInference
from ..services.customer_service import CustomerService

router = APIRouter()
service = CustomerService()
inference = CustomerIQInference()

REQUIRED_BATCH_COLUMNS = [
    "customer_id",
    "Frequency",
    "Monetary",
    "Recency",
    "Customer Lifespan",
    "Average Purchase Interval",
    "Median Purchase Interval",
]


def _read_batch_file(file: UploadFile) -> pd.DataFrame:
    filename = (file.filename or "").lower()
    if not filename:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    raw = file.file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        if filename.endswith(".csv"):
            return pd.read_csv(BytesIO(raw))
        if filename.endswith((".xls", ".xlsx")):
            return pd.read_excel(BytesIO(raw))
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a CSV or Excel file.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to parse uploaded file: {exc}",
        ) from exc


@router.post("/api/customers/batch-analyze")
async def batch_analyze_customers(file: UploadFile = File(...)):
    """Analyze a CSV or Excel batch of customer records using the live CustomerIQ model."""
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="A file upload is required.")

    df = _read_batch_file(file)

    missing = [column for column in REQUIRED_BATCH_COLUMNS if column not in df.columns]
    if missing:
        raise HTTPException(
            status_code=422,
            detail=("Uploaded file is missing required columns: " + ", ".join(missing)),
        )

    results = []
    for row_index, row in df.iterrows():
        try:
            record = {
                "customer_id": int(row["customer_id"]),
                "Frequency": float(row["Frequency"]),
                "Monetary": float(row["Monetary"]),
                "Recency": float(row["Recency"]),
                "Customer Lifespan": float(row["Customer Lifespan"]),
                "Average Purchase Interval": float(row["Average Purchase Interval"]),
                "Median Purchase Interval": float(row["Median Purchase Interval"]),
            }
        except (TypeError, ValueError) as exc:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Row {row_index + 2} has invalid values or missing data; "
                    "all required columns must be numeric except customer_id."
                ),
            ) from exc

        try:
            prediction = inference.predict_from_customer_record(record)
        except ValueError as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Row {row_index + 2}: {exc}",
            ) from exc

        results.append(prediction)

    return results


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
