import React from 'react';
import {
  Users,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Percent,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Database,
  LineChart
} from 'lucide-react';
import { AggregateMetrics } from '../types';
import { FileSpreadsheet, BookOpen } from 'lucide-react';

interface OverviewProps {
  onAnalyzeClick: () => void;
  onUploadClick?: () => void;
  onCaseStudiesClick?: () => void;
  onSelectArchetype: (archetypeKey: string) => void;
  metrics?: AggregateMetrics | null;
  apiConnected: boolean;
}

export const Overview: React.FC<OverviewProps> = ({
  onAnalyzeClick,
  onUploadClick,
  onCaseStudiesClick,
  onSelectArchetype,
  metrics,
  apiConnected,
}) => {
  // Reference figures from prompt
  const displayMetrics = metrics || {
    total_customers: 3705,
    high_risk: 690,
    medium_risk: 1511,
    low_risk: 1504,
    average_churn_probability: 0.466,
    total_revenue_exposure: 3162052.94,
    is_live: false,
  };

  const isLive = Boolean(metrics?.is_live);

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(displayMetrics.total_revenue_exposure);

  const avgProbPercent = (
    displayMetrics.average_churn_probability > 1
      ? displayMetrics.average_churn_probability
      : displayMetrics.average_churn_probability * 100
  ).toFixed(2);

  const scrollToMetrics = () => {
    document.getElementById('overview-metrics-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="overview-screen" className="space-y-10 pb-12">
      {/* -------------------------------------
          HERO SECTION
          ------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/20 p-8 sm:p-12 backdrop-blur-sm shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Customer Retention Intelligence</span>
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Understand who is at risk. <br />
            <span className="text-slate-300">Know what to do next.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            CustomerIQ analyzes customer behavior, estimates churn risk, and provides evidence-informed retention recommendations.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {onUploadClick && (
              <button
                id="hero-upload-cta"
                type="button"
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-indigo-600 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Upload Customer Base (Excel / CSV)</span>
              </button>
            )}

            <button
              id="hero-primary-cta"
              type="button"
              onClick={onAnalyzeClick}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-slate-800/90 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <span>Single Customer Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onCaseStudiesClick && (
              <button
                id="hero-case-studies-cta"
                type="button"
                onClick={onCaseStudiesClick}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>10 Case Studies & Strategy Feedback</span>
              </button>
            )}

            <button
              id="hero-secondary-cta"
              type="button"
              onClick={scrollToMetrics}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/40 px-4 py-3.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <LineChart className="h-4 w-4 text-indigo-400" />
              <span>Explore Benchmark</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------
          QUICK START ARCHETYPES
          ------------------------------------- */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Immediate Customer Profiles
            </h3>
            <p className="text-xs text-slate-400">
              Select an archetype to populate verified behavioral parameters into the analysis engine
            </p>
          </div>
          <span className="text-xs text-indigo-400 font-medium">1-Click Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* High risk archetype */}
          <div
            onClick={() => onSelectArchetype('high-risk')}
            className="group rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 hover:border-rose-500/40 hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                HIGH RISK COHORT
              </span>
              <span className="text-xs font-mono text-slate-400">CUST-8492</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-white group-hover:text-rose-200 transition-colors">
              High-Risk Enterprise Customer
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              $3,450 historical spend with 120 days of silence; purchase interval gap widening 4x.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-rose-400">
              <span>Load Profile</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Medium risk archetype */}
          <div
            onClick={() => onSelectArchetype('medium-risk')}
            className="group rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 hover:border-amber-500/40 hover:bg-amber-950/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                MEDIUM RISK COHORT
              </span>
              <span className="text-xs font-mono text-slate-400">CUST-6104</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
              Mid-Tier Account At Inflexion
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              $1,245 exposure, 75 days recency vs 40-day average. Early disengagement indicator.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>Load Profile</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Low risk archetype */}
          <div
            onClick={() => onSelectArchetype('low-risk')}
            className="group rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                LOW RISK COHORT
              </span>
              <span className="text-xs font-mono text-slate-400">CUST-1920</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
              Healthy Loyal Account
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              8 purchases, 14 days recency on a 21-day average interval with steady engagement.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Load Profile</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------
          OVERVIEW METRICS SECTION
          ------------------------------------- */}
      <div id="overview-metrics-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Retention Cohort Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              Macro risk distribution and portfolio revenue exposure
            </p>
          </div>

          {/* Explicit label distinguishing live API vs static reference benchmark */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isLive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-slate-800 text-slate-300'
              }`}
            >
              <Database className="h-3 w-3 text-indigo-400" />
              <span>{isLive ? 'Live API Cohort' : 'Model Reference Cohort (Benchmark)'}</span>
            </span>
          </div>
        </div>

        {/* Informational disclaimer respecting Prompt Section 18 */}
        {!isLive && (
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Reference Benchmark Data:</span> These metrics reflect the CustomerIQ gradient boosting model calibration cohort (3,705 customer accounts). Individual customer analyses below communicate directly with the live FastAPI prediction service.
          </div>
        )}

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Total Customers */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Accounts</span>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-white font-mono">
              {displayMetrics.total_customers.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Calibrated cohort</span>
          </div>

          {/* 2. High Risk */}
          <div className="rounded-2xl border border-rose-500/20 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">High Risk</span>
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-rose-400 font-mono">
              {displayMetrics.high_risk.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {((displayMetrics.high_risk / displayMetrics.total_customers) * 100).toFixed(1)}% of total
            </span>
          </div>

          {/* 3. Medium Risk */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Medium Risk</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              {displayMetrics.medium_risk.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {((displayMetrics.medium_risk / displayMetrics.total_customers) * 100).toFixed(1)}% of total
            </span>
          </div>

          {/* 4. Low Risk */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Low Risk</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              {displayMetrics.low_risk.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {((displayMetrics.low_risk / displayMetrics.total_customers) * 100).toFixed(1)}% of total
            </span>
          </div>

          {/* 5. Average Churn Probability */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Avg. Churn Risk</span>
              <Percent className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-white font-mono">
              {avgProbPercent}%
            </div>
            <span className="text-[11px] text-slate-400">Mean probability</span>
          </div>

          {/* 6. Total Revenue Exposure */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Revenue at Stake</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              {formattedRevenue}
            </div>
            <span className="text-[11px] text-slate-400">Gross cohort value</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------
          PRODUCT ARCHITECTURE PREVIEW
          "Separating Prediction from Recommendation"
          ------------------------------------- */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg font-bold text-white">
          How CustomerIQ Works
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          A dual-layer intelligence platform that isolates statistical risk estimation from evidence-informed intervention design
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold text-sm">
              01
            </div>
            <h4 className="mt-3 text-base font-semibold text-white">
              Behavioral Signals
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Synthesizes transaction cadence, recency decay, purchasing rhythm, and tenure velocity without relying on noisy subjective surveys.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold text-sm">
              02
            </div>
            <h4 className="mt-3 text-base font-semibold text-white">
              ML Churn Estimation
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              A calibrated Gradient Boosting classifier evaluates behavioral markers to estimate an exact, probabilistic risk score and segment tier.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold text-sm">
              03
            </div>
            <h4 className="mt-3 text-base font-semibold text-white">
              Evidence-Informed Actions
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Retrieves real-world retention case studies matching the behavioral pattern, generating candidate interventions and test hypotheses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
