import React from 'react';
import {
  Brain,
  Layers,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Target,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Compass
} from 'lucide-react';

export const AboutCustomerIQ: React.FC = () => {
  const steps = [
    { title: 'Customer Data', desc: 'Raw transactional timestamps, order values, and account telemetry' },
    { title: 'Behavioral Features', desc: 'Recency, frequency, monetary value, lifespan, and interval consistency' },
    { title: 'Churn Prediction', desc: 'Statistical likelihood of disengagement calculated via supervised ML' },
    { title: 'Risk Scoring', desc: 'Classification into High (≥70%), Medium (40-69%), and Low (<40%) tiers' },
    { title: 'Revenue Exposure', desc: 'Financial quantification of cumulative account value at risk' },
    { title: 'Marketing Intelligence', desc: 'Lifecycle placement, disengagement triggers, and interaction channel fit' },
    { title: 'Evidence / Case Studies', desc: 'Empirical cross-matching against analogous documented retention interventions' },
    { title: 'Retention Recommendation', desc: 'Candidate action plan formulated as an experiment with test metrics' },
  ];

  return (
    <div id="about-customeriq-view" className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
          <Brain className="h-3.5 w-3.5" />
          <span>Product Architecture & Philosophy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About CustomerIQ
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Customer Retention Intelligence engineered to turn observed customer behavioral velocity into defensible, high-leverage retention decisions.
        </p>
      </div>

      {/* Core Architectural Distinction */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-900/80 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-indigo-300">
          <Compass className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">
            CustomerIQ separates prediction from recommendation.
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          Most automated retention tools suffer from a fundamental flaw: they conflate statistical probability with business action, generating opaque recommendations with false certainty. CustomerIQ maintains strict architectural separation:
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Layer 1: ML Model
            </span>
            <h3 className="mt-1 text-sm font-semibold text-white">Estimates Risk</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Analyzes transaction frequency, recency, monetary value, and intervals to output a calibrated churn probability.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Layer 2: Evidence Layer
            </span>
            <h3 className="mt-1 text-sm font-semibold text-white">Retrieves Relevant Cases</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Surfaces documented real-world case studies with similar behavioral signals and intervention outcomes.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Layer 3: Recommendation
            </span>
            <h3 className="mt-1 text-sm font-semibold text-white">Synthesizes Next Test</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Combines customer context with evidence to propose candidate strategies and structured A/B experiments.
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------
          ARCHITECTURE PIPELINE FLOWCHART
          ------------------------------------- */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-white">
          Data & Intelligence Pipeline
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          The end-to-end transformation from raw customer events to empirical test design
        </p>

        <div className="mt-8 flex flex-col items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="w-full max-w-lg rounded-xl border border-white/10 bg-slate-800/60 p-4 flex items-center justify-between shadow-sm hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 hidden sm:block" />
              </div>

              {idx < steps.length - 1 && (
                <div className="my-1.5 flex items-center justify-center text-slate-500">
                  <ArrowDown className="h-4 w-4 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* -------------------------------------
          ABOUT THE MODEL (Section 20)
          ------------------------------------- */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <Cpu className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">About the Machine-Learning Model</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Algorithm
            </span>
            <div className="mt-1 text-base font-bold text-white">
              Gradient Boosting
            </div>
            <p className="mt-1 text-xs text-slate-400">Ensemble decision trees</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Purpose
            </span>
            <div className="mt-1 text-base font-bold text-white">
              Risk Estimation
            </div>
            <p className="mt-1 text-xs text-slate-400">Customer churn probability</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Model Output
            </span>
            <div className="mt-1 text-base font-bold text-white">
              Probability Score
            </div>
            <p className="mt-1 text-xs text-slate-400">Continuous value (0.0% to 100%)</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Risk Tiers
            </span>
            <div className="mt-1 text-base font-bold text-white">
              High / Med / Low
            </div>
            <p className="mt-1 text-xs text-slate-400">≥70% / 40-69% / &lt;40%</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-slate-800/20 p-4 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Responsible AI Commitment:</span> CustomerIQ avoids deterministic claims ("this customer will churn" or "this strategy is guaranteed to work"). Predictions are calibrated statistical estimates designed to help retention teams allocate finite customer success bandwidth effectively.
        </div>
      </div>
    </div>
  );
};
