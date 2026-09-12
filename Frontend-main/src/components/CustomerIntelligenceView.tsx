import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, User, ShieldAlert, FileText, ArrowLeft, Download } from 'lucide-react';
import { CustomerIntelligenceResult } from '../types';
import { RiskBadge } from './RiskBadge';
import { RiskScoreGauge } from './RiskScoreGauge';
import { BehavioralSignals } from './BehavioralSignals';
import { LifecycleCard } from './LifecycleCard';
import { RecommendationCard } from './RecommendationCard';
import { EvidenceCard } from './EvidenceCard';
import { LimitationsCard } from './LimitationsCard';
import { TestRecommendationCard } from './TestRecommendationCard';
import { StrategyFeedbackCard } from './StrategyFeedbackCard';

interface CustomerIntelligenceViewProps {
  result: CustomerIntelligenceResult;
  onAnalyzeAnother: () => void;
  onExploreCaseStudy?: (caseStudyId?: string) => void;
}

export const CustomerIntelligenceView: React.FC<CustomerIntelligenceViewProps> = ({
  result,
  onAnalyzeAnother,
  onExploreCaseStudy,
}) => {
  // Format revenue exposure professionally as currency
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(result.revenue_exposure || 0);

  const customerRef = result.customer_id || 'Account Profile (Direct Telemetry)';

  // Handle export or print
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      id="customer-intelligence-result-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>New Analysis</span>
          </button>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Intelligence Dossier
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Customer Intelligence
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Export summary or print"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------
          1. TOP SUMMARY CARD:
          Customer Reference | RISK LEVEL | CHURN PROBABILITY | REVENUE EXPOSURE
          ------------------------------------- */}
      <div
        id="customer-summary-highlight-card"
        className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-900/70 p-6 sm:p-7 backdrop-blur-sm shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Customer Reference & Risk Level */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span className="uppercase tracking-wider font-semibold">Customer Identifier</span>
            </div>
            <h1
              id="customer-reference-heading"
              className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono"
            >
              {customerRef}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <RiskBadge level={result.risk_segment} size="md" />
              {result.model_metadata?.model_name && (
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {result.model_metadata.model_name}
                </span>
              )}
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
            {/* Churn Probability */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Churn Probability
              </span>
              <div className="mt-1 flex items-baseline">
                <span
                  id="metric-churn-probability"
                  className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight"
                >
                  {(result.churn_probability > 1 ? result.churn_probability : result.churn_probability * 100).toFixed(1)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Probabilistic risk estimate
              </span>
            </div>

            {/* Revenue Exposure */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Revenue Exposure
              </span>
              <div className="mt-1 flex items-baseline">
                <span
                  id="metric-revenue-exposure"
                  className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight"
                >
                  {formattedRevenue}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Historical value at stake
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Risk Gauge & Quick Signals Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreGauge
            probability={result.churn_probability}
            riskSegment={result.risk_segment}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {/* -------------------------------------
              2. BEHAVIORAL SIGNALS:
              "Why is this customer at risk?"
              ------------------------------------- */}
          <BehavioralSignals signals={result.key_behavioral_signals} />

          {/* -------------------------------------
              3. CUSTOMER LIFECYCLE:
              Lifecycle context
              ------------------------------------- */}
          <LifecycleCard lifecycleContext={result.lifecycle_context} />
        </div>
      </div>

      {/* -------------------------------------
          STRATEGY EVALUATION & FEEDBACK (IF PROVIDED)
          ------------------------------------- */}
      {result.strategy_evaluation && (
        <StrategyFeedbackCard
          evaluation={result.strategy_evaluation}
          strategyName={result.marketing_strategy}
          onExploreCaseStudy={onExploreCaseStudy}
        />
      )}

      {/* -------------------------------------
          4. RECOMMENDED RETENTION STRATEGY:
          Evidence-informed recommendation | Recommended Action | Best Channel | Why
          ------------------------------------- */}
      <RecommendationCard
        potentialStrategy={result.potential_strategy}
        recommendedChannel={result.recommended_channel}
        rationale={result.rationale}
      />

      {/* -------------------------------------
          5. SUPPORTING EVIDENCE:
          Relevant Case Studies | Evidence Strength
          ------------------------------------- */}
      <EvidenceCard
        caseStudies={result.relevant_case_studies}
        evidenceStrength={result.evidence_strength}
      />

      {/* -------------------------------------
          6. IMPORTANT LIMITATIONS:
          Probabilistic nature, limitations
          ------------------------------------- */}
      <LimitationsCard limitations={result.limitations} />

      {/* -------------------------------------
          7. RECOMMENDED NEXT TEST:
          Next Test | Goal (Experimentation Framing)
          ------------------------------------- */}
      <TestRecommendationCard testRecommendation={result.test_recommendation} />
    </motion.div>
  );
};
