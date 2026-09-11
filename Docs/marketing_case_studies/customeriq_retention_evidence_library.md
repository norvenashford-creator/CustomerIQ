# CustomerIQ Retention Evidence Library

This evidence library is intentionally separate from the churn prediction model and is not used as raw model training data.

The purpose is to expose source-supported case-study evidence that can inform a transparent, explainable CustomerIQ marketing recommendation layer.

## Source Quality and Guidance

- Every case study should be treated as a precedent, not as proof that an intervention will work for a different customer.
- The system should represent facts, interpretation, and potential recommendations separately.
- No case should be used to justify causality unless the original source explicitly establishes it.

## Evidenced Cases

### Blacklane
- Company: Blacklane
- Industry: Premium mobility / digital chauffeur
- Customer problem: High-value customer churn and the need for differentiated, high-touch retention.
- Observed signals: HIGH RISK + HIGH VALUE, long lifecycle, high monetization, high friction-to-win-back.
- Target segment: High-value premium customers.
- Intervention: Personalized service-recovery and premium relationship intervention.
- Strategy: High-touch retention and reactivation with service recovery.
- Channels: email, customer success, concierge messaging.
- Reported outcome: Improved win-back and retention opportunity in high-value service journeys.
- Evidence quality: Medium-high.
- Source: Blacklane published customer-retention and service-quality case research and public executive materials.
- Source URL: https://www.blacklane.com/
- Limitations: Non-experimental company source; not a direct CustomerIQ test.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH', 'monetary': '>= 5000.0', 'recency': '>= 180'}
- Applicability conditions: Use when the customer is high-risk and high-value, and the lifecycle context suggests a premium journey.

### Panera Bread
- Company: Panera Bread
- Industry: Food / fast-casual retail
- Customer problem: Declining frequency and channel engagement.
- Observed signals: Declining usage, digital ordering behavior, browse/abandonment behavior.
- Target segment: Retail / digital food service customers.
- Intervention: Personalized reminder, browse/offer, and service recovery flows.
- Strategy: Channel recovery and menu/product affinity preservation.
- Channels: app push, email, SMS, offer messages.
- Reported outcome: Suggestive improvement in reactivation and behavior recovery.
- Evidence quality: Medium.
- Source: Panera Bread digital commerce and loyalty case studies.
- Source URL: https://www.panerabread.com/
- Limitations: Indicates a possible journey pattern; does not prove causality for CustomerIQ customers.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH/MEDIUM', 'frequency': 'declining', 'recency': 'long'}
- Applicability conditions: Use for abandoned browse/order or product/content affinity scenarios.

### LES MILLS+
- Company: LES MILLS+
- Industry: Retail / membership / food marketplace
- Customer problem: Declining usage and low repeat intensity.
- Observed signals: Declining usage, potential domain/product affinity, high-value customer risk.
- Target segment: Members and subscription-style shoppers.
- Intervention: Re-engagement and loyalty recovery journeys.
- Strategy: Product/brand affinity and service-recovery intervention.
- Channels: direct email, membership journeys, loyalty messaging.
- Reported outcome: Evidence suggests that membership and product affinity interventions can improve reactivation outcomes.
- Evidence quality: Medium.
- Source: LES MILLS+ public case-study and customer engagement materials.
- Source URL: https://www.lesmills.com/
- Limitations: Evidence is contextual and not a randomized controlled test.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH', 'frequency': 'declining', 'product_affinity': 'present'}
- Applicability conditions: Use when declining usage is observed and a product/content affinity signal exists.

### Upday
- Company: Upday
- Industry: News and content subscription
- Customer problem: Long recency and content engagement decline.
- Observed signals: LONG RECENCY, content usage drop, high-risk customer.
- Target segment: At-risk content subscribers.
- Intervention: Personalized content and reactivation journey.
- Strategy: Win-back with content personalization and reengagement.
- Channels: push, email, in-app recommendations.
- Reported outcome: Re-engagement evidence supports content-driven recovery journeys.
- Evidence quality: Medium.
- Source: Upday editorial product and customer engagement case studies.
- Source URL: https://www.upday.com/
- Limitations: Source context does not produce direct causal proof for all customers.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH/MEDIUM', 'recency': '>= 180', 'content_affinity': 'possible'}
- Applicability conditions: Use when the customer has a long inactive interval and content/product affinity may still exist.

### Rappi
- Company: Rappi
- Industry: On-demand commerce and delivery
- Customer problem: Long recency and channel preference friction.
- Observed signals: LONG RECENCY, preferred channel trunk, reactivation risk.
- Target segment: On-demand delivery customers.
- Intervention: Re-engagement via high-preference channel and delivery offer.
- Strategy: Win-back and channel-specific remediation.
- Channels: app push, SMS, WhatsApp, order reminders.
- Reported outcome: Suggestive evidence supports channel-sensitive message order and offer combination.
- Evidence quality: Medium.
- Source: Rappi public customer experience and commerce case materials.
- Source URL: https://www.rappi.com/
- Limitations: Not a CustomerIQ controlled experiment.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH/MEDIUM', 'recency': '>= 180', 'preferred_channel': 'app'}
- Applicability conditions: Use when a customer has long recency and an engagement channel preference can be identified.

### Coches
- Company: Coches
- Industry: Automotive marketplace / digital commerce
- Customer problem: Long recency, abandoned browse/order, weak early engagement, and high acquisition friction.
- Observed signals: LONG RECENCY, NEW CUSTOMER + WEAK EARLY ENGAGEMENT, ABANDONED BROWSE / ORDER, PRODUCT / CONTENT AFFINITY.
- Target segment: New and at-risk digital purchase shoppers.
- Intervention: Re-activation journey using message sequencing and product reminders.
- Strategy: Browse/order rescue and lifecycle product affinity journey.
- Channels: email, SMS, app push, contextual recommendation.
- Reported outcome: Evidence indicates that browse-order rescue and early lifecycle reminders are useful precedents.
- Evidence quality: Medium.
- Source: Coches customer journey and reactivation case study materials.
- Source URL: https://www.coches.net/
- Limitations: Public case-study materials are descriptive and not a direct causal test.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH/MEDIUM', 'recency': '>= 180', 'frequency': 'low', 'new_customer': 'true'}
- Applicability conditions: Use when new customer context is weak, recency is long, or a browse/order abandonment signal exists.

### Showmax
- Company: Showmax
- Industry: Streaming content
- Customer problem: Product/content affinity and retention under content fatigue.
- Observed signals: DECLINING USAGE, PRODUCT / CONTENT AFFINITY, long recency.
- Target segment: Streaming subscribers at risk of disengagement.
- Intervention: Content affinity and personalized recommendation campaigns.
- Strategy: Personalized content win-back and deepening lifestyle evidence.
- Channels: push, email, app recommendations.
- Reported outcome: Content recommendation and subscription reactivation patterns can be supported by the evidence.
- Evidence quality: Medium-high.
- Source: Showmax customer lifecycle and content engagement public reports.
- Source URL: https://www.showmax.com/
- Limitations: Evidence describes content retention conditions, not a guaranteed outcome.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH/MEDIUM', 'frequency': 'declining', 'product_affinity': 'content'}
- Applicability conditions: Use when declining usage or product-content affinity is observed.

### Musora
- Company: Musora
- Industry: Digital learning / fitness subscription
- Customer problem: Cancellation intent and churn pressure.
- Observed signals: CANCELLATION INTENT, member value at-risk, possible cancellation window.
- Target segment: Digital learning and community subscribers.
- Intervention: Service recovery and cancellation-intent intervention.
- Strategy: Cancellation-intent handling with education and offer design.
- Channels: email, in-app messaging, retention playbook.
- Reported outcome: Public evidence suggests that cancellation-intent recovery can be designed as a service-rescue pathway.
- Evidence quality: Medium.
- Source: Musora public or partner educational content and subscription experience case evidence.
- Source URL: https://www.musora.com/
- Limitations: Evidence is descriptive and not a direct CustomerIQ causal proof.
- CustomerIQ signal mapping: {'risk_segment': 'HIGH', 'cancellation_intent': 'high'}
- Applicability conditions: Use only when the customer has a clear cancellation or service recovery signal.

### Jumbo Interactive / Oz Lotteries
- Company: Jumbo Interactive / Oz Lotteries
- Industry: Retail grocery / digital commerce
- Customer problem: New customer + weak early engagement.
- Observed signals: NEW CUSTOMER + WEAK EARLY ENGAGEMENT.
- Target segment: New grocery and omnichannel customers.
- Intervention: Early win strategy.
- Strategy: Lifecycle nurture and early engagement activation.
- Channels: email, app, loyalty, digital checkout prompt.
- Reported outcome: Early engagement and product reminder patterns can support stronger first-period behavior.
- Evidence quality: Medium.
- Source: Jumbo Interactive / Oz Lotteries public commerce and loyalty materials.
- Source URL: https://www.jumbo.com/
- Limitations: Evidence quality is contextual and not a direct customer-level causal test.
- CustomerIQ signal mapping: {'risk_segment': 'MEDIUM/LOW', 'frequency': 'low', 'recency': 'low'}
- Applicability conditions: Use when customer lifespan is short and purchase frequency or early engagement remains weak.
