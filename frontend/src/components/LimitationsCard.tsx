import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LimitationsCardProps {
  limitations: string | string[];
}

export const LimitationsCard: React.FC<LimitationsCardProps> = ({ limitations }) => {
  if (!limitations) return null;

  const items = Array.isArray(limitations)
    ? limitations
    : [limitations];

  if (items.length === 0) return null;

  return (
    <div
      id="important-limitations-section"
      className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-4 w-4 text-slate-400" />
        <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
          Important Limitations
        </h4>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-500 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-slate-400/90 border-t border-white/5 pt-2.5">
        Predictions are probabilistic risk scores derived from historical cadence patterns. Recommendations reflect evidence-informed hypotheses rather than guaranteed outcomes.
      </p>
    </div>
  );
};
