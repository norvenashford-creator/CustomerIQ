"""Structured retention case studies for CustomerIQ evidence-backed intelligence.

These records are facts and source-backed observational context from the repository
retention evidence library. They are intentionally NOT ML training data, and they
are not interpreted as proof that a recommendation will work for a CustomerIQ customer.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any


@dataclass(frozen=True)
class RetentionCaseStudy:
    company: str
    industry: str
    customer_problem: str
    observed_signals: list[str]
    target_segment: str
    intervention: str
    strategy: str
    channels: list[str]
    reported_outcome: str
    evidence_quality: str
    source: str
    source_url: str
    limitations: str
    customeriq_signal_mapping: dict[str, Any]
    applicability_conditions: list[str]

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        return data


CASE_STUDIES: list[RetentionCaseStudy] = [
    RetentionCaseStudy(
        company="Blacklane",
        industry="Premium mobility / digital chauffeur",
        customer_problem="High-value customer churn and differentiated service recovery need",
        observed_signals=["HIGH RISK + HIGH VALUE", "high monetary value", "service recovery context"],
        target_segment="High-value premium customers",
        intervention="Personalized service-recovery and premium relationship intervention",
        strategy="High-touch retention and reactivation with service recovery",
        channels=["email", "customer success", "concierge messaging"],
        reported_outcome="Retention opportunity and customer-recovery precedent",
        evidence_quality="Medium-high",
        source="Blacklane public customer-retention / service-quality materials",
        source_url="https://www.blacklane.com/",
        limitations="Not a randomized CustomerIQ test and not proof of causal success",
        customeriq_signal_mapping={"risk_segment": "HIGH", "monetary": ">= 5000.0", "recency": ">= 180"},
        applicability_conditions=["high-risk high-value customer", "premium-retention journey"],
    ),
    RetentionCaseStudy(
        company="Panera Bread",
        industry="Food / fast-casual retail",
        customer_problem="Declining frequency and digital channel engagement",
        observed_signals=["DECLINING USAGE", "ABANDONED BROWSE / ORDER", "PRODUCT / CONTENT AFFINITY"],
        target_segment="Retail / digital food service customers",
        intervention="Personalized reminder, browse/offer, and service recovery flows",
        strategy="Channel recovery and product affinity preservation",
        channels=["app push", "email", "SMS", "offer messaging"],
        reported_outcome="Suggestive improvement in reactivation and behavior recovery",
        evidence_quality="Medium",
        source="Panera Bread digital commerce and loyalty case materials",
        source_url="https://www.panerabread.com/",
        limitations="Descriptive case context, not direct causal CustomerIQ proof",
        customeriq_signal_mapping={"risk_segment": "HIGH/MEDIUM", "frequency": "declining", "recency": "long"},
        applicability_conditions=["abandoned browse/order", "declining usage", "product/content affinity"],
    ),
    RetentionCaseStudy(
        company="LES MILLS+",
        industry="Retail / membership / wellness",
        customer_problem="Declining usage and low repeat intensity",
        observed_signals=["DECLINING USAGE", "PRODUCT / CONTENT AFFINITY", "high-risk value context"],
        target_segment="Members and subscription-style shoppers",
        intervention="Re-engagement and loyalty recovery journeys",
        strategy="Product/brand affinity and service-recovery intervention",
        channels=["direct email", "membership journeys", "loyalty messaging"],
        reported_outcome="Evidence suggests that membership and product affinity interventions can improve reactivation outcomes",
        evidence_quality="Medium",
        source="LES MILLS+ public case-study and engagement materials",
        source_url="https://www.lesmills.com/",
        limitations="Evidence is contextual and not a randomized controlled test",
        customeriq_signal_mapping={"risk_segment": "HIGH", "frequency": "declining", "product_affinity": "present"},
        applicability_conditions=["declining usage", "product/content affinity"],
    ),
    RetentionCaseStudy(
        company="Upday",
        industry="News and content subscription",
        customer_problem="Long recency and content engagement decline",
        observed_signals=["LONG RECENCY", "content usage drop", "subscription recovery"],
        target_segment="At-risk content subscribers",
        intervention="Personalized content and reactivation journey",
        strategy="Win-back with content personalization and reengagement",
        channels=["push", "email", "in-app recommendations"],
        reported_outcome="Re-engagement evidence supports content-driven recovery journeys",
        evidence_quality="Medium",
        source="Upday editorial product and content engagement materials",
        source_url="https://www.upday.com/",
        limitations="Source context does not provide direct causal proof for all customers",
        customeriq_signal_mapping={"risk_segment": "HIGH/MEDIUM", "recency": ">= 180", "content_affinity": "possible"},
        applicability_conditions=["long inactive interval", "content/product affinity may exist"],
    ),
    RetentionCaseStudy(
        company="Rappi",
        industry="On-demand commerce and delivery",
        customer_problem="Long recency and channel preference friction",
        observed_signals=["LONG RECENCY", "preferred channel signal", "reactivation risk"],
        target_segment="On-demand delivery customers",
        intervention="Re-engagement via preferred channel and delivery offer",
        strategy="Win-back and channel-sensitive journey",
        channels=["app push", "SMS", "WhatsApp", "order reminders"],
        reported_outcome="Suggestive evidence supports channel-sensitive message and offer sequencing",
        evidence_quality="Medium",
        source="Rappi public customer experience and commerce case materials",
        source_url="https://www.rappi.com/",
        limitations="Not a CustomerIQ controlled experiment",
        customeriq_signal_mapping={"risk_segment": "HIGH/MEDIUM", "recency": ">= 180", "preferred_channel": "app"},
        applicability_conditions=["long recency", "channel preference known"],
    ),
    RetentionCaseStudy(
        company="Coches",
        industry="Automotive marketplace / digital commerce",
        customer_problem="Long recency, weak early engagement, and browse/order drop-off",
        observed_signals=["LONG RECENCY", "NEW CUSTOMER + WEAK EARLY ENGAGEMENT", "ABANDONED BROWSE / ORDER", "PRODUCT / CONTENT AFFINITY"],
        target_segment="New and at-risk digital purchase shoppers",
        intervention="Re-activation and browse/order rescue journeys",
        strategy="Browse/order rescue and lifecycle product affinity intervention",
        channels=["email", "SMS", "app push", "recommended product reminders"],
        reported_outcome="Evidence indicates that early lifecycle reminders and browse/order rescue are useful precedents",
        evidence_quality="Medium",
        source="Coches customer journey and reactivation public materials",
        source_url="https://www.coches.net/",
        limitations="Public case-study materials are descriptive and not a direct causal test",
        customeriq_signal_mapping={"risk_segment": "HIGH/MEDIUM", "recency": ">= 180", "frequency": "low", "new_customer": "true"},
        applicability_conditions=["new customer with weak early engagement", "long recency", "abandoned browse/order"],
    ),
    RetentionCaseStudy(
        company="Showmax",
        industry="Streaming content",
        customer_problem="Product/content affinity and churn from content fatigue",
        observed_signals=["DECLINING USAGE", "PRODUCT / CONTENT AFFINITY", "long recency"],
        target_segment="Streaming subscribers at risk of disengagement",
        intervention="Content affinity and personalized recommendation campaigns",
        strategy="Personalized content win-back and customer lifestyle evidence",
        channels=["push", "email", "app recommendations"],
        reported_outcome="Content recommendation and subscription reactivation patterns can be supported by evidence",
        evidence_quality="Medium-high",
        source="Showmax content engagement and subscription reports",
        source_url="https://www.showmax.com/",
        limitations="Evidence is contextual and not a guaranteed intervention effect",
        customeriq_signal_mapping={"risk_segment": "HIGH/MEDIUM", "frequency": "declining", "product_affinity": "content"},
        applicability_conditions=["declining usage", "content/product affinity signal"],
    ),
    RetentionCaseStudy(
        company="Musora",
        industry="Digital learning / fitness subscription",
        customer_problem="Cancellation intent and churn pressure",
        observed_signals=["CANCELLATION INTENT"],
        target_segment="Digital learning and community subscribers",
        intervention="Cancellation-intent intervention and service recovery",
        strategy="Cancellation-intent handling with education and offer design",
        channels=["email", "in-app messaging", "retention playbook"],
        reported_outcome="Public evidence suggests that cancellation-intent recovery can be designed as a service-rescue pathway",
        evidence_quality="Medium",
        source="Musora public subscription experience and customer-recovery materials",
        source_url="https://www.musora.com/",
        limitations="Evidence is descriptive and not a direct CustomerIQ causal proof",
        customeriq_signal_mapping={"risk_segment": "HIGH", "cancellation_intent": "high"},
        applicability_conditions=["cancellation intent signal"],
    ),
    RetentionCaseStudy(
        company="Jumbo Interactive / Oz Lotteries",
        industry="Retail grocery / digital commerce",
        customer_problem="New customer with weak early engagement",
        observed_signals=["NEW CUSTOMER + WEAK EARLY ENGAGEMENT"],
        target_segment="New grocery and omnichannel customers",
        intervention="Early win strategy and lifecycle nurture",
        strategy="Lifecycle nurture and early engagement activation",
        channels=["email", "app", "loyalty", "digital checkout prompt"],
        reported_outcome="Early engagement and product reminder patterns can support first-period behavior",
        evidence_quality="Medium",
        source="Jumbo Interactive / Oz Lotteries public commerce and loyalty materials",
        source_url="https://www.jumbo.com/",
        limitations="Evidence is contextual and not a direct customer-level causal test",
        customeriq_signal_mapping={"risk_segment": "MEDIUM/LOW", "frequency": "low", "recency": "low"},
        applicability_conditions=["new customer", "low early engagement", "lifecycle short"],
    ),
]
