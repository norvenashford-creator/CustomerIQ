import React from 'react';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

interface EmptyStateProps {
  onAnalyzeClick: () => void;
  onSamplePreset?: (preset: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAnalyzeClick,
  onSamplePreset,
}) => {
  return (
    <div
      id="customeriq-empty-state"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-8 sm:p-12 text-center backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
        <Sparkles className="h-8 w-8 text-indigo-400" />
      </div>

      <h3 className="mt-5 text-xl sm:text-2xl font-semibold text-white tracking-tight">
        Ready to analyze a customer
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
        Enter customer information to generate a CustomerIQ retention profile.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAnalyzeClick}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          <span>Analyze Customer</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Quick sample archetypes */}
      {onSamplePreset && (
        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or test with a sample behavioral profile
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onSamplePreset('high-risk')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:border-rose-500/40 hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>High Risk Enterprise ($4,200)</span>
            </button>

            <button
              type="button"
              onClick={() => onSamplePreset('medium-risk')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-950/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:border-amber-500/40 hover:bg-amber-950/40 transition-colors cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Medium Risk Account ($1,245)</span>
            </button>

            <button
              type="button"
              onClick={() => onSamplePreset('low-risk')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Healthy Loyal Customer ($890)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
