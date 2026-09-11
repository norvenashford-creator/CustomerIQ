"""Knowledge layer for CustomerIQ evidence-backed marketing intelligence.

This package intentionally separates case-study evidence from ML prediction logic:

Customer Data -> Behavioral Features -> Churn Prediction -> Risk Segment
-> Revenue Exposure -> Marketing Intelligence -> Relevant Evidence -> Potential Recommendation
"""

from .retention_case_studies import CASE_STUDIES
from .evidence_rules import (
    match_case_studies_for_customer,
    recommend_from_customer,
)

__all__ = [
    "CASE_STUDIES",
    "match_case_studies_for_customer",
    "recommend_from_customer",
]
