import React from 'react';
import { Clock, GitCommit } from 'lucide-react';

interface LifecycleCardProps {
  lifecycleContext: string;
}

export const LifecycleCard: React.FC<LifecycleCardProps> = ({ lifecycleContext }) => {
  if (!lifecycleContext) return null;

  return (
    <div
      id="customer-lifecycle-card"
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            Customer Lifecycle
          </h3>
          <p className="text-xs text-slate-400">
            Current tenure stage & behavioral context
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-800/30 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 shrink-0" />
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {lifecycleContext}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 border-t border-white/5 pt-3">
          <GitCommit className="h-3.5 w-3.5 text-blue-400/80" />
          <span>Calculated from transaction history span and recency decay</span>
        </div>
      </div>
    </div>
  );
};
