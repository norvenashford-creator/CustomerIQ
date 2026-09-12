import { TEN_CASE_STUDIES } from '../data/caseStudies';
import { CaseStudy, StrategyEvaluation, RiskLevel } from '../types';

interface StrategyEvaluationInput {
  strategy: string;
  churnProbability: number;
  riskSegment: RiskLevel | string;
  recency: number;
  frequency: number;
  monetary: number;
  customerLifespan?: number;
  avgPurchaseInterval?: number;
}

/**
 * Evaluates a marketing retention strategy against customer behavioral telemetry
 * and empirical evidence from the 10 real-world case studies.
 */
export function evaluateMarketingStrategy(input: StrategyEvaluationInput): StrategyEvaluation {
  const strategyLower = (input.strategy || '').toLowerCase().trim();
  const risk = (input.riskSegment || 'MEDIUM').toUpperCase() as RiskLevel;
  const churn = input.churnProbability > 1 ? input.churnProbability / 100 : input.churnProbability;
  const recency = input.recency || 0;
  const monetary = input.monetary || 0;
  const frequency = input.frequency || 1;

  if (!strategyLower) {
    return {
      score: 50,
      verdict: 'Moderate Alignment',
      rationale: 'No specific strategy supplied. Evaluating general retention baseline.',
      strengths: ['Standard retention monitoring'],
      risksOrFlaws: ['Lacks tactical channel and incentive personalization'],
      recommendations: [
        'Define a targeted channel (email, SMS, or CSM outreach).',
        'Incorporate behavioral trigger based on purchase interval gap.',
      ],
    };
  }

  // Find best fitting case study based on strategy keywords and customer profile
  let bestCase: CaseStudy = TEN_CASE_STUDIES[0];
  let highestCaseScore = 0;

  for (const cs of TEN_CASE_STUDIES) {
    let matchScore = 0;
    const csText = (cs.name + ' ' + cs.strategy + ' ' + cs.relevant_pattern + ' ' + cs.rationale).toLowerCase();

    // Keyword matching with proposed strategy
    const words = strategyLower.split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && csText.includes(w)) {
        matchScore += 2;
      }
    }

    // Risk alignment
    if (cs.matched_risk_levels.includes(risk)) {
      matchScore += 3;
    }

    // Specific domain signals
    if ((strategyLower.includes('discount') || strategyLower.includes('coupon') || strategyLower.includes('offer')) && cs.id.includes('winback')) {
      matchScore += 4;
    }
    if ((strategyLower.includes('vip') || strategyLower.includes('loyalty') || strategyLower.includes('status') || monetary > 1000) && cs.id.includes('sephora')) {
      matchScore += 5;
    }
    if ((strategyLower.includes('streak') || strategyLower.includes('habit') || strategyLower.includes('freeze') || strategyLower.includes('daily')) && cs.id.includes('freeze')) {
      matchScore += 5;
    }
    if ((strategyLower.includes('csm') || strategyLower.includes('call') || strategyLower.includes('admin') || strategyLower.includes('b2b') || strategyLower.includes('enterprise')) && cs.id.includes('slack')) {
      matchScore += 5;
    }
    if ((strategyLower.includes('content') || strategyLower.includes('recommend') || strategyLower.includes('watch') || strategyLower.includes('playlist')) && cs.id.includes('netflix')) {
      matchScore += 4;
    }
    if ((strategyLower.includes('snooze') || strategyLower.includes('cadence') || strategyLower.includes('frequency') || strategyLower.includes('pause')) && cs.id.includes('snooze')) {
      matchScore += 5;
    }
    if ((strategyLower.includes('annual') || strategyLower.includes('renew') || strategyLower.includes('saving') || strategyLower.includes('summary')) && cs.id.includes('savings')) {
      matchScore += 4;
    }
    if ((strategyLower.includes('template') || strategyLower.includes('workflow') || strategyLower.includes('starter')) && cs.id.includes('adobe')) {
      matchScore += 4;
    }

    if (matchScore > highestCaseScore) {
      highestCaseScore = matchScore;
      bestCase = cs;
    }
  }

  // Calculate qualitative scoring & evaluation
  let score = 70;
  const strengths: string[] = [];
  const risksOrFlaws: string[] = [];
  const recommendations: string[] = [];

  // Analyze strategy mechanics:
  const hasDiscount = /discount|coupon|promo|off|price cut|free month|credit/i.test(strategyLower);
  const hasPersonalization = /personal|custom|tailor|curated|specific|segment/i.test(strategyLower);
  const hasStatusOrPerk = /vip|exclusive|access|reward|points|tier|status|gift/i.test(strategyLower);
  const hasEducationOrContent = /template|tutorial|guide|webinar|content|showcase|onboarding/i.test(strategyLower);
  const hasCadenceTuning = /snooze|pause|cadence|interval|frequency|schedule/i.test(strategyLower);
  const hasDirectHuman = /csm|call|phone|manager|adviser|executive|meeting/i.test(strategyLower);
  const hasLossAversionOrSavings = /loss|streak|freeze|save|savings|preserve|keep|expire/i.test(strategyLower);

  // High Risk evaluation
  if (risk === 'HIGH') {
    if (hasDiscount && monetary > 1500) {
      score -= 15;
      risksOrFlaws.push('Heavy price discounting for high-spend accounts ($' + monetary.toFixed(0) + ') devalues your brand and erodes gross margins.');
      recommendations.push('Pivot from blanket discounting to VIP status protection and exclusive concierge access (similar to the Sephora Case Study).');
    } else if (hasDiscount && recency > 90) {
      score += 10;
      strengths.push('A strong economic incentive is essential for re-activating deeply dormant accounts (recency > 90 days).');
    }

    if (hasDirectHuman && monetary >= 1000) {
      score += 20;
      strengths.push('Deploying dedicated human outreach on high-revenue accounts is well-justified by the Slack B2B Case Study (65% save rate).');
    }

    if (!hasDirectHuman && !hasDiscount && !hasStatusOrPerk && monetary > 1500) {
      score -= 10;
      risksOrFlaws.push('Automated passive email messaging is typically insufficient for high-risk accounts with significant financial exposure.');
      recommendations.push('Escalate to high-touch multi-channel intervention: combine executive notification with phone or concierge touchpoint.');
    }
  }

  // Medium Risk evaluation
  if (risk === 'MEDIUM') {
    if (hasCadenceTuning) {
      score += 20;
      strengths.push('Cadence flexibility and interval adjustment is proven to retain up to 43% of at-risk subscribers (Dollar Shave Club Case Study).');
    }
    if (hasLossAversionOrSavings) {
      score += 15;
      strengths.push('Highlighting earned benefits, loss prevention, or cumulative savings removes hesitation (Amazon Prime & Duolingo Case Studies).');
    }
    if (hasDiscount) {
      score -= 5;
      risksOrFlaws.push('Premature discounting on moderately disengaged customers conditions them to wait for coupons rather than purchasing normally.');
      recommendations.push('Test utility-led or content-led triggers (like Netflix or Adobe starter templates) before giving away margin.');
    }
  }

  // Low Risk evaluation
  if (risk === 'LOW') {
    if (hasDiscount) {
      score -= 20;
      risksOrFlaws.push('Offering retention discounts to healthy, low-risk customers cannibalizes natural baseline revenue with zero incremental gain.');
      recommendations.push('Reserve discounts strictly for high churn cohorts; focus on loyalty recognition and product expansion (Dropbox Case Study).');
    } else {
      score += 15;
      strengths.push('Avoids margin-eroding discounts for healthy accounts, preserving full transaction profitability.');
    }
  }

  // Personalization bonus
  if (hasPersonalization) {
    score += 10;
    strengths.push('Personalized communications generate 2x to 3x higher response velocity than broad cohort blasts.');
  }

  // Channel alignment
  if (/sms|text/i.test(strategyLower) && risk === 'HIGH') {
    strengths.push('Direct mobile / SMS channel yields immediate open rates for urgent churn intervention.');
  }

  // Fallback strengths/recommendations if sparse
  if (strengths.length === 0) {
    strengths.push('Proactively addresses disengagement before total account abandonment.');
  }
  if (recommendations.length === 0) {
    recommendations.push(`Cross-benchmark against the ${bestCase.name} strategy to refine offer timing and messaging.`);
  }

  // Clamp score
  score = Math.max(25, Math.min(96, score));

  let verdict: StrategyEvaluation['verdict'] = 'Moderate Alignment';
  if (score >= 75) verdict = 'Optimal Alignment';
  else if (score < 55) verdict = 'Potential Risk / Ineffective';

  const rationale = `This strategy achieves a ${score}/100 alignment with the customer's behavioral velocity (${risk} risk, ${(churn * 100).toFixed(0)}% churn likelihood, recency ${recency}d). It closely mirrors patterns examined in the ${bestCase.company} case study.`;

  return {
    score,
    verdict,
    rationale,
    matchedCaseStudy: bestCase,
    strengths,
    risksOrFlaws,
    recommendations,
  };
}
