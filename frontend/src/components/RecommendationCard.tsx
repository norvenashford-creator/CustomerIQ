import React from 'react';
import { Target, Send, Sparkles, HelpCircle, Compass } from 'lucide-react';

interface RecommendationCardProps {
  potentialStrategy: string;
  recommendedChannel: string;
  rationale: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  potentialStrategy,
  recommendedChannel,
  rationale,
}) => {
  return (
    <div
      id="recommended-retention-strategy"
      className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-b from-indigo-950/20 via-slate-900/80 to-slate-900/80 p-6 sm:p-7 backdrop-blur-sm"
    >
      {/* Decorative subtle ambient highlight */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header & Responsible AI Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Recommended Retention Strategy
            </h3>
            <p className="text-xs text-slate-400">
              Targeted candidate intervention tailored to customer profile
            </p>
          </div>
        </div>

        <span
          id="badge-evidence-informed"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 tracking-wide"
        >
          <Compass className="h-3 w-3" />
          <span>Evidence-informed recommendation</span>
        </span>
      </div>

      {/* Actionable Layout */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recommended Action */}
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-slate-800/40 p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Target className="h-3.5 w-3.5" />
            <span>Recommended Action</span>
          </div>
          <p className="mt-2 text-base sm:text-lg font-medium text-white leading-snug">
            {potentialStrategy || 'Direct re-engagement campaign'}
          </p>
        </div>

        {/* Best Channel */}
        <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Send className="h-3.5 w-3.5" />
            <span>Best Channel</span>
          </div>
          <p className="mt-2 text-base sm:text-lg font-medium text-white leading-snug">
            {recommendedChannel || 'Email / In-app'}
          </p>
        </div>
      </div>

      {/* Rationale */}
      <div className="mt-4 rounded-xl border border-white/5 bg-slate-800/25 p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Why</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {rationale}
        </p>
      </div>

      {/* Architectural Disclaimer note */}
      <p className="mt-4 text-[11px] sm:text-xs text-slate-400/80 leading-relaxed border-t border-white/5 pt-3">
        <span className="font-semibold text-slate-300">Methodology Note:</span> The machine-learning model estimates churn probability, while candidate retention strategies and channel pairings are informed by customer behavioral context and relevant historical cases.
      </p>
    </div>
  );
};
