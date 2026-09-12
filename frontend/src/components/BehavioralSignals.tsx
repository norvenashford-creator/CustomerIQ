import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus, Activity } from 'lucide-react';

interface BehavioralSignalsProps {
  signals: string[] | Array<{ signal: string; direction?: 'up' | 'down' | 'neutral'; impact?: string }>;
}

export const BehavioralSignals: React.FC<BehavioralSignalsProps> = ({ signals }) => {
  if (!signals || (Array.isArray(signals) && signals.length === 0)) {
    return null;
  }

  // Normalize string[] or object[]
  const items = Array.isArray(signals)
    ? signals.map((s) => {
        if (typeof s === 'string') {
          // Infer icon if string contains directional cues
          const lower = s.toLowerCase();
          let direction: 'up' | 'down' | 'neutral' = 'neutral';
          if (
            lower.includes('↑') ||
            lower.includes('high recency') ||
            lower.includes('increased interval') ||
            lower.includes('gap widening')
          ) {
            direction = 'up';
          } else if (
            lower.includes('↓') ||
            lower.includes('low frequency') ||
            lower.includes('declining') ||
            lower.includes('drop') ||
            lower.includes('inactive')
          ) {
            direction = 'down';
          }
          return { text: s, direction };
        }
        return {
          text: s.signal || JSON.stringify(s),
          direction: s.direction || 'neutral',
        };
      })
    : [];

  return (
    <div
      id="behavioral-signals-section"
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            Why is this customer at risk?
          </h3>
          <p className="text-xs text-slate-400">
            Key behavioral signals identified from transactional cadence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const isDown = item.direction === 'down';
          const isUp = item.direction === 'up';

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 rounded-xl p-3.5 border transition-all ${
                isDown
                  ? 'border-rose-500/20 bg-rose-950/10 hover:border-rose-500/30'
                  : isUp
                  ? 'border-amber-500/20 bg-amber-950/10 hover:border-amber-500/30'
                  : 'border-white/5 bg-slate-800/40 hover:border-white/15'
              }`}
            >
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  isDown
                    ? 'bg-rose-500/20 text-rose-400'
                    : isUp
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-700/50 text-slate-300'
                }`}
              >
                {isDown ? (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                ) : isUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
