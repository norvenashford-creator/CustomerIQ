from typing import Any

from backend.knowledge.evidence_rules import recommend_from_customer, match_case_studies_for_customer


class MarketingIntelligenceService:
    """Transparent marketing intelligence rules on top of CustomerIQ risk data.

    Rules intentionally avoid causal claims and are framed as behavior signals
    associated with higher or lower predicted risk. They also surface source-aware
    case-study evidence through a separate knowledge layer rather than pretending
    the evidence proves a recommendation will work.
    """

    def __init__(self):
        self.high_value_threshold = 5000.0
        self.long_recency_threshold = 180
        self.high_frequency_threshold = 5

    def generate_recommendation(self, row: dict[str, Any]) -> dict[str, Any]:
        """Return the transparent evidence-rule contract for one customer record.

        The knowledge rule layer is the source of truth for the required
        response keys. This service should pass through that contract and add
        the customer_id that routes already know from the row.
        """
        evidence = recommend_from_customer(row)
        evidence['customer_id'] = int(row['customer_id'])
        return evidence

    def match_case_studies(self, row: dict[str, Any]) -> list[dict[str, Any]]:
        return match_case_studies_for_customer(row)
