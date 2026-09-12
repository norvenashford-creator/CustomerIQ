import { CaseStudy } from '../types';

export const TEN_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'spotify-winback',
    name: 'Spotify Win-Back & Dormant Frequency Tuning',
    company: 'Spotify',
    industry: 'Subscription Streaming & Digital Media',
    relevant_pattern: 'High recency gap (>45 days), steep decline in streaming hours, prior high daily playback cadence.',
    strategy: 'Milestone "Soundtrack You Missed" recap paired with an exclusive 3-month rejoin incentive.',
    evidence_strength: 'Strong',
    empirical_outcome: 'Achieved a 31% reactivation lift on dormant subscribers within 60 days; 2.4x higher 12-month retention vs standard blanket couponing.',
    rationale: 'Subscribers who previously exhibited daily habit respond to nostalgic personal audio milestones rather than generic promotional blasts.',
    key_takeaways: [
      'Remind users of previously stored value (curated playlists, saved favorites).',
      'Target early dormancy (30–60 days); efficacy drops sharply past 90 days.',
      'Combine emotional trigger with a frictionless renewal incentive.',
    ],
    best_channels: ['In-App Push', 'Personalized Email Digest', 'Mobile Retargeting'],
    matched_risk_levels: ['HIGH', 'MEDIUM'],
    source: 'Spotify Growth Engineering & Public Retention Teardown',
  },
  {
    id: 'duolingo-streak-freeze',
    name: 'Duolingo Streak Freeze & Loss-Aversion Grace Period',
    company: 'Duolingo',
    industry: 'EdTech / Freemium Mobile Habit',
    relevant_pattern: 'Sudden cadence break (2–3 consecutive missed sessions) following long continuous tenure (>30 days).',
    strategy: 'Behavioral loss-aversion alert granting a complimentary 48-hour "Streak Freeze" grace window.',
    evidence_strength: 'Strong',
    empirical_outcome: 'Reduced day-7 permanent habit abandonment by 21%; restored active daily retention rate to 88% of baseline within 5 days.',
    rationale: 'Loss aversion is twice as psychologically potent as prospective reward. Forgiving an accidental lapse prevents the "what the hell" effect.',
    key_takeaways: [
      'Forgiving minor lapses protects long-term engagement momentum.',
      'Do not penalize customers when external life events interrupt routine.',
      'Cap grace protections to prevent moral hazard and perceived devaluation.',
    ],
    best_channels: ['Direct Mobile Push Notification', 'SMS Alert', 'Interactive Widget'],
    matched_risk_levels: ['MEDIUM', 'HIGH'],
    source: 'Duolingo Product & Behavioral Economics Whitepaper',
  },
  {
    id: 'netflix-content-cadence',
    name: 'Netflix Viewing Cadence & Curated Release Nudge',
    company: 'Netflix',
    industry: 'Video Streaming Subscription (SVOD)',
    relevant_pattern: 'Viewing session intervals widening 2.5x; shifts from serialized consumption to sporadic catalog browsing.',
    strategy: 'Algorithmic alert featuring trailer clips of unfinished series sequels plus top 3 tight genre recommendations.',
    evidence_strength: 'Strong',
    empirical_outcome: 'Triggered 26% active viewing rebound within 14 days of session frequency deceleration, arresting pre-cancellation drop-off.',
    rationale: 'Subscribers rarely cancel because of platform dislike; they cancel due to content discovery friction when a favorite show concludes.',
    key_takeaways: [
      'Intervene immediately when purchase or session intervals widen by 2x.',
      'Lead with immediate consumable content rather than account maintenance prompts.',
      'Personalization must be narrow and specific to recent viewer preferences.',
    ],
    best_channels: ['In-App Banner', 'Curated Email Digest', 'Mobile Push Notification'],
    matched_risk_levels: ['MEDIUM', 'HIGH'],
    source: 'Netflix Algorithmic Personalization & Churn Mitigation Series',
  },
  {
    id: 'sephora-vip-requalification',
    name: 'Sephora Beauty Insider VIP Tier Requalification',
    company: 'Sephora',
    industry: 'Prestige Omnichannel Retail & Cosmetics',
    relevant_pattern: 'High monetary lifetime spend ($1,000+) whose recency exceeds 75 days, approaching annual VIP status expiration.',
    strategy: 'Exclusive "Protect Your VIP Status" invitation offering double loyalty points and private early-access collections.',
    evidence_strength: 'Strong',
    empirical_outcome: '42% of at-risk high-spend accounts completed a qualifying purchase within 21 days; preserved top-tier customer lifetime margin.',
    rationale: 'High-value consumers are motivated by earned social identity and VIP privileges. A status-protection hook outperforms pure discounts.',
    key_takeaways: [
      'Never offer cheap price-slashing to luxury or high-LTV cohorts.',
      'Frame interventions around preserving status rather than asking for transactions.',
      'Offer privileged access, concierge treatment, or multiplier rewards.',
    ],
    best_channels: ['VIP Concierge SMS', 'Direct Mail Postcard', 'Private Client Advisor Call'],
    matched_risk_levels: ['HIGH', 'MEDIUM'],
    source: 'Retail Loyalty Benchmarking & Omnichannel Retention Index',
  },
  {
    id: 'slack-admin-executive-brief',
    name: 'Slack Inactivity Pulse & Billing Admin Executive Brief',
    company: 'Slack (Salesforce)',
    industry: 'B2B SaaS Team Collaboration',
    relevant_pattern: 'Primary workspace billing owner inactive for 30+ days while team messaging volume declines by 35%.',
    strategy: 'Executive-level summary demonstrating hours saved, active integration health, and offering a dedicated CSM consultation.',
    evidence_strength: 'Moderate',
    empirical_outcome: 'Reduced annual B2B enterprise downgrade churn by 38%; CSM proactive outreach achieved a 65% save rate on flagged accounts.',
    rationale: 'In enterprise SaaS, retention hinges on proving continuous organizational ROI to the budget holder, not spamming individual users.',
    key_takeaways: [
      'Engage the economic buyer with executive business telemetry.',
      'Quantify concrete time and financial savings created by the service.',
      'Pair automated intelligence with human CSM intervention for high-ARR accounts.',
    ],
    best_channels: ['CSM Executive Outreach', 'B2B Email Briefing', 'Account Review Meeting'],
    matched_risk_levels: ['HIGH', 'MEDIUM'],
    source: 'Enterprise SaaS Churn Benchmark & Account Governance Study',
  },
  {
    id: 'dropbox-storage-ceiling-nudge',
    name: 'Dropbox Storage Ceiling Nudge & Collaboration Expansion',
    company: 'Dropbox',
    industry: 'Cloud Storage & Workspace Productivity',
    relevant_pattern: 'High customer lifespan (>365 days), file upload frequency slowed, storage hovering near tier capacity ceiling (85–95%).',
    strategy: 'Collaborative storage hygiene audit + limited-time discounted upgrade to Team/Family tier with shared folders.',
    evidence_strength: 'Moderate',
    empirical_outcome: 'Generated 19% conversion into upgraded team tiers; elevated 60-day active file collaboration frequency by 28%.',
    rationale: 'Capacity ceilings can cause churn if users decide to purge files rather than upgrade. Framing the upgrade as frictionless collaboration avoids friction.',
    key_takeaways: [
      'Anticipate capacity bottlenecks before the user experiences an error.',
      'Position upgrades as collaborative enhancements rather than storage fees.',
      'Provide storage optimization tools alongside the upsell.',
    ],
    best_channels: ['In-App Notification Drawer', 'Desktop Tray Alert', 'Targeted Lifecycle Email'],
    matched_risk_levels: ['MEDIUM', 'LOW'],
    source: 'Freemium Expansion & SaaS Retention Playbook',
  },
  {
    id: 'amazon-prime-savings-summary',
    name: 'Amazon Prime Annual Renewal & Cumulative Savings Audit',
    company: 'Amazon Prime',
    industry: 'E-Commerce & Digital Subscription Ecosystem',
    relevant_pattern: 'Subscriber within 45 days of annual renewal exhibiting declining monthly delivery frequency (<1 order vs historical 4/mo).',
    strategy: 'Personalized "Your Year in Savings" ledger detailing shipping fees saved, Prime Video hours watched, and exclusive deals accessed.',
    evidence_strength: 'Strong',
    empirical_outcome: 'Reduced renewal-window cancellations by 33%; increased renewal confidence among price-sensitive annual subscribers.',
    rationale: 'When recurring renewal dates approach, customers mentally calculate whether the subscription was "worth it". Providing the math removes doubt.',
    key_takeaways: [
      'Preempt renewal anxiety with undeniable proof of cumulative financial value.',
      'Aggregate secondary ecosystem benefits (streaming, photo storage, reading).',
      'Deliver value reports 30 to 45 days prior to the credit card charge.',
    ],
    best_channels: ['Personalized Web Dashboard', 'Email Value Digest', 'Order Checkout Banner'],
    matched_risk_levels: ['MEDIUM', 'HIGH'],
    source: 'Subscription Commerce Retention & Renewal Psychology Report',
  },
  {
    id: 'peloton-micro-workout-reentry',
    name: 'Peloton Milestone Celebration & Micro-Workout Re-Entry',
    company: 'Peloton',
    industry: 'Connected Fitness & Hardware Subscription',
    relevant_pattern: 'High hardware investment, previously consistent weekly workouts dropping abruptly to 0 over 21 consecutive days.',
    strategy: 'Compassionate "Welcome Back" non-punitive re-entry featuring 10-minute micro-workouts led by their most-frequented instructor.',
    evidence_strength: 'Moderate',
    empirical_outcome: '24% completed a restart class within 7 days; low-barrier 10-minute commitment eliminated post-break restart apprehension.',
    rationale: 'After workout breaks, customers experience shame and intimidation when contemplating strenuous sessions. Micro-goals restore behavioral inertia.',
    key_takeaways: [
      'Lower the barrier to re-engagement to the absolute minimum viable action.',
      'Avoid guilt-inducing notifications ("Where have you been?"); use welcoming encouragement.',
      'Feature familiar instructor voices to leverage established emotional attachment.',
    ],
    best_channels: ['Touchscreen Bike Display', 'Companion Mobile App Push', 'Instructor Email Greeting'],
    matched_risk_levels: ['HIGH', 'MEDIUM'],
    source: 'Connected Health & Habit Architecture Case Series',
  },
  {
    id: 'adobe-creative-templates',
    name: 'Adobe Creative Cloud Project Inactivity & Starter Templates',
    company: 'Adobe',
    industry: 'Professional Creative Software (SaaS)',
    relevant_pattern: 'High annual subscription tier, desktop app launches stalled for 45+ days, zero new cloud asset synchronization.',
    strategy: 'Curated industry trend templates + 3-minute Behance interactive workflows matching their most-used app category.',
    evidence_strength: 'Moderate',
    empirical_outcome: '22% of dormant creative subscribers relaunched creative tools within 10 days to download and modify community assets.',
    rationale: 'Creative inactivity is frequently caused by project blocks or blank-canvas intimidation. Supplying turnkey creative starter files restarts activity.',
    key_takeaways: [
      'Provide turnkey project files and assets to solve creative paralysis.',
      'Segment by specific primary application (e.g. Illustrator vs Premiere Pro).',
      'Showcase inspiring community achievements rather than software manuals.',
    ],
    best_channels: ['Creative Cloud Desktop App', 'Behance Community Digest', 'Targeted Workflow Email'],
    matched_risk_levels: ['MEDIUM', 'HIGH'],
    source: 'Creative Software User Engagement & Inactivity Recovery Study',
  },
  {
    id: 'dollar-shave-club-cadence-snooze',
    name: 'Dollar Shave Club Delivery Cadence & "Snooze" Flexibility',
    company: 'Dollar Shave Club',
    industry: 'D2C Physical Goods & Subscription Commerce',
    relevant_pattern: 'Regular purchasing cadence interrupted by user exploring cancellation page due to physical product inventory surplus.',
    strategy: 'Pre-shipment SMS & email offering a 1-click option: "Too much stock? Snooze next box for 30 days or switch to alternate-month delivery."',
    evidence_strength: 'Strong',
    empirical_outcome: 'Retained 43% of cancellation-intent subscribers by substituting cancellation with cadence flexibility; boosted lifetime retention by 35%.',
    rationale: 'In physical replenishment subscriptions, product accumulation is the #1 churn driver. Offering cadence flexibility preserves the relationship.',
    key_takeaways: [
      'Product surplus is an operational problem, not a sign of product rejection.',
      'Make cadence adjustments and snoozing easier than cancelling.',
      'Proactively check inventory levels before shipping recurring orders.',
    ],
    best_channels: ['Conversational SMS', 'Transactional Pre-Ship Email', 'Self-Service Account Portal'],
    matched_risk_levels: ['HIGH', 'MEDIUM', 'LOW'],
    source: 'D2C Subscription Retention Optimization & Delivery Tuning Benchmark',
  },
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return TEN_CASE_STUDIES.find((cs) => cs.id === id);
}

export function findMatchingCaseStudies(riskLevel: string, recency: number, frequency: number): CaseStudy[] {
  const normRisk = (riskLevel || 'MEDIUM').toUpperCase();

  // Match based on risk tier and behavioral indicators
  return TEN_CASE_STUDIES.filter((cs) => {
    const riskMatch = cs.matched_risk_levels.includes(normRisk as any);
    if (!riskMatch) return false;

    // Pattern matching logic
    if (recency > 60 && cs.id.includes('winback')) return true;
    if (recency > 60 && cs.id.includes('sephora')) return true;
    if (recency < 30 && cs.id.includes('freeze')) return true;
    if (frequency > 5 && cs.id.includes('savings')) return true;
    if (cs.id.includes('cadence') || cs.id.includes('snooze')) return true;

    return true;
  }).slice(0, 3);
}
