import React from 'react';
import { StrategyEvaluation } from '../types';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
} from 'lucide-react';

interface StrategyFeedbackCardProps {
  evaluation: StrategyEvaluation;
  strategyName?: string;
  onExploreCaseStudy?: (caseStudyId: string) => void;
}

export const StrategyFeedbackCard: React.FC<StrategyFeedbackCardProps> = ({
  evaluation,
  strategyName,
  onExploreCaseStudy,
}) => {
  const isOptimal = evaluation.score >= 75;
  const isModerate = evaluation.score >= 55 && evaluation.score < 75;

  const badgeColor = isOptimal
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    : isModerate
    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    : 'border-rose-500/30 bg-rose-500/10 text-rose-400';

  const barColor = isOptimal
    ? 'bg-emerald-500'
    : isModerate
    ? 'bg-amber-500'
    : 'bg-rose-500';

  return (
    <div
      id="strategy-evaluation-card"
      className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/90 to-slate-900 p-6 sm:p-7 backdrop-blur-sm shadow-xl space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Lightbulb className="h-4 w-4 text-indigo-400" />
            <span>ML Marketing Strategy Evaluation</span>
          </div>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-white tracking-tight">
            Retention Strategy Feedback
          </h3>
          {strategyName && (
            <p className="mt-1 text-xs text-slate-300 font-mono italic bg-slate-800/60 py-1 px-2.5 rounded-lg border border-white/5 inline-block">
              "{strategyName}"
            </p>
          )}
        </div>

        {/* Score & Verdict Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Alignment Score
            </span>
            <div className="text-2xl font-extrabold text-white font-mono flex items-baseline justify-end gap-1">
              <span>{evaluation.score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold ${badgeColor}`}>
            {evaluation.verdict}
          </span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Alignment Calibration</span>
          <span>{evaluation.score}% compatible with behavioral velocity</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${evaluation.score}%` }}
          />
        </div>
      </div>

      {/* Rationale / Behavioral Diagnosis */}
      <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <span className="font-semibold text-white block mb-1">Behavioral Telemetry Diagnosis:</span>
        {evaluation.rationale}
      </div>

      {/* Matched Case Study Precedent */}
      {evaluation.matchedCaseStudy && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Empirical Case Study Precedent (1 of 10)</span>
            </div>
            <h4 className="mt-1 text-sm font-bold text-white">
              {evaluation.matchedCaseStudy.name}
            </h4>
            <p className="mt-0.5 text-xs text-slate-300">
              {evaluation.matchedCaseStudy.empirical_outcome}
            </p>
          </div>

          {onExploreCaseStudy && (
            <button
              type="button"
              onClick={() => onExploreCaseStudy(evaluation.matchedCaseStudy!.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <span>View Case Details</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Strengths & Potential Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Observed Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evaluation.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks & Flaws */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Risks & Margin Considerations</span>
          </div>
          {evaluation.risksOrFlaws.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {evaluation.risksOrFlaws.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              No critical flaws detected. Strategy complies with empirical retention guidelines.
            </p>
          )}
        </div>
      </div>

      {/* Concrete Tactical Recommendations */}
      {evaluation.recommendations.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Tactical Refinements to Maximize Retention Lift:
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            {evaluation.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
