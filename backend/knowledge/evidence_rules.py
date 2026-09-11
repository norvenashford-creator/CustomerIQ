"""Evidence matching rules for CustomerIQ retention intelligence.

These rules do not touch the model. They provide transparent, source-aware
case-study matching for a risk and behavioral row coming from the CustomerIQ DB.
"""

from __future__ import annotations

from typing import Any

from .retention_case_studies import CASE_STUDIES


def _score_and_evidence_quality(cases: list[dict[str, Any]]) -> str:
    # keep the evidence quality consistent and explainable
    if not cases:
        return "Low"
    if any(study.get("company") in {"Blacklane", "Showmax"} for study in cases):
        return "Medium-high"
    return "Medium"


def _signal_tokens(row: dict[str, Any]) -> list[str]:
    segments = []
    risk_segment = str(row.get("risk_segment", "")).upper()
    monetary = float(row.get("monetary") or 0.0)
    recency = int(row.get("recency") or 0)
    frequency = int(row.get("frequency") or 0)
    probability = float(row.get("churn_probability") or 0.0)

    if risk_segment == "HIGH" and monetary >= 5000.0:
        segments.append("HIGH RISK + HIGH VALUE")
    if risk_segment == "HIGH":
        segments.append("HIGH RISK")
    if recency >= 180:
        segments.append("LONG RECENCY")
    if frequency <= 2 and risk_segment != "LOW":
        segments.append("DECLINING USAGE")
    if probability >= 0.70:
        segments.append("CANCELLATION INTENT")

    return segments


def match_case_studies_for_customer(row: dict[str, Any]) -> list[dict[str, Any]]:
    """Return relevant case-study evidence records from the evidence library.

    Matching is explainable and signal-based. It is intentionally a fact layer:
    source-backed case studies are retrieved, then interpretation / recommendations
    are produced after the case-study evidence is surfaced.
    """
    signal_tokens = _signal_tokens(row)
    matched = []

    # Keep examples and common signal categories explicit in code but transparent.
    if "HIGH RISK + HIGH VALUE" in signal_tokens:
        matched.extend([study for study in CASE_STUDIES if study.company in {"Blacklane", "Panera", "LES MILLS+"}])
    if "LONG RECENCY" in signal_tokens:
        matched.extend([study for study in CASE_STUDIES if study.company in {"Upday", "Rappi", "Coches", "Showmax"}])
    if "DECLINING USAGE" in signal_tokens:
        matched.extend([study for study in CASE_STUDIES if study.company in {"LES MILLS+", "Showmax", "Panera"}])
    if "CANCELLATION INTENT" in signal_tokens:
        matched.extend([study for study in CASE_STUDIES if study.company == "Musora"])

    # Deduplicate while preserving order.
    seen = set()
    ordered = []
    for study in matched:
        key = study.company
        if key in seen:
            continue
        seen.add(key)
        ordered.append(study.to_dict())

    return ordered


def recommend_from_customer(row: dict[str, Any]) -> dict[str, Any]:
    """Map a CustomerIQ feature row to a transparent evidence-backed recommendation payload."""
    row = dict(row)
    risk_segment = str(row.get("risk_segment", "")).upper()
    monetary = float(row.get("monetary") or 0.0)
    recency = int(row.get("recency") or 0)
    frequency = int(row.get("frequency") or 0)
    probability = float(row.get("churn_probability") or 0.0)

    case_studies = match_case_studies_for_customer(row)
    evidence_strength = _score_and_evidence_quality(case_studies)

    potential_strategy = "general monitoring candidate: review customer record and maintain observation"
    recommended_channel = "email"
    lifecycle_context = "standard customer lifecycle"

    if risk_segment == "HIGH" and monetary >= 5000.0:
        potential_strategy = "Personalized win-back / service-recovery journey"
        recommended_channel = "customer success + email"
        lifecycle_context = "high-risk high-value lifecycle"
    elif recency >= 180:
        potential_strategy = "Long-recency reactivation journey"
        recommended_channel = "email + app push"
        lifecycle_context = "long-recency lifecycle"
    elif frequency <= 2:
        potential_strategy = "Declining-usage behavior recovery journey"
        recommended_channel = "email + push"
        lifecycle_context = "declining-usage lifecycle"
    elif probability >= 0.70:
        potential_strategy = "Cancellation-intent recovery journey"
        recommended_channel = "email + customer success"
        lifecycle_context = "cancellation-intent lifecycle"

    return {
        "risk_segment": risk_segment,
        "churn_probability": probability,
        "revenue_exposure": monetary * probability,
        "key_behavioral_signals": _signal_tokens(row),
        "lifecycle_context": lifecycle_context,
        "potential_strategy": potential_strategy,
        "recommended_channel": recommended_channel,
        "relevant_case_studies": case_studies,
        "evidence_strength": evidence_strength,
        "rationale": "The case studies provide source-supported precedents for signal patterns; they do not prove that the same intervention will work for this customer.",
        "limitations": "Evidence is observational and contextual; outcomes are not guaranteed. CustomerIQ must compare against holdout/control groups before scaling.",
        "test_recommendation": "Compare against a holdout/control group before scaling.",
    }
