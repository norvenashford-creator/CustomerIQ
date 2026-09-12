import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface RiskScoreGaugeProps {
  probability: number; // 0.0 to 1.0 (or 0 to 100)
  riskSegment: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  probability,
  riskSegment,
}) => {
  // Normalize to 0 - 100
  const percent = Math.min(100, Math.max(0, probability > 1 ? probability : probability * 100));
  const normSegment = (riskSegment || '').toUpperCase();
  const isHigh = normSegment === 'HIGH' || percent >= 70;
  const isMedium = normSegment === 'MEDIUM' || (percent >= 40 && percent < 70);

  // SVG Gauge calculations
  // Semi-circle arc from -180 deg to 0 deg
  const radius = 80;
  const circumference = Math.PI * radius; // 251.3
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let accentColor = '#10B981'; // green
  let glowColor = 'rgba(16, 185, 129, 0.2)';
  let riskTitle = 'LOW RISK';
  let supportingText = 'Favorable engagement trajectory. Low estimated likelihood of churn based on observed patterns.';

  if (isHigh) {
    accentColor = '#EF4444'; // red
    glowColor = 'rgba(239, 68, 68, 0.25)';
    riskTitle = 'HIGH RISK';
    supportingText = 'Elevated likelihood of churn based on observed customer behavior.';
  } else if (isMedium) {
    accentColor = '#F59E0B'; // amber
    glowColor = 'rgba(245, 158, 11, 0.25)';
    riskTitle = 'MEDIUM RISK';
    supportingText = 'Moderate disengagement signals detected. Early intervention advised to arrest retention decline.';
  }

  return (
    <div
      id="risk-score-gauge-card"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-sm"
      style={{
        boxShadow: `0 0 40px -10px ${glowColor}`,
      }}
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Model Prediction
          </span>
          <h3 className="text-base font-semibold text-white">
            Churn Risk Probability
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {isHigh ? (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          ) : isMedium ? (
            <Shield className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-mono">{riskTitle}</span>
        </div>
      </div>

      {/* Gauge Visualization */}
      <div className="relative mt-6 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 200 115"
          className="w-56 sm:w-64 max-w-full overflow-visible"
        >
          <defs>
            {/* Threshold gradients */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Fill Arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={accentColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            filter="url(#gaugeGlow)"
          />

          {/* Threshold markers */}
          {/* 40% threshold marker */}
          <circle cx="70.5" cy="35.5" r="2" fill="#64748b" opacity="0.6" />
          {/* 70% threshold marker */}
          <circle cx="129.5" cy="35.5" r="2" fill="#64748b" opacity="0.6" />
        </svg>

        {/* Center Readout */}
        <div className="absolute top-[38px] flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-baseline"
          >
            <span
              id="churn-probability-value"
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono"
            >
              {percent.toFixed(1)}
            </span>
            <span className="ml-1 text-2xl font-bold text-slate-400 font-mono">%</span>
          </motion.div>
          <span
            className="mt-1 text-xs sm:text-sm font-bold tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {riskTitle}
          </span>
        </div>
      </div>

      {/* Threshold Zone Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
        <div className="rounded-lg bg-emerald-950/20 px-2 py-1.5 border border-emerald-900/30">
          <div className="text-[10px] uppercase font-semibold text-emerald-400">Low</div>
          <div className="text-xs text-slate-400 font-mono">&lt; 40%</div>
        </div>
        <div className="rounded-lg bg-amber-950/20 px-2 py-1.5 border border-amber-900/30">
          <div className="text-[10px] uppercase font-semibold text-amber-400">Medium</div>
          <div className="text-xs text-slate-400 font-mono">40% – 69%</div>
        </div>
        <div className="rounded-lg bg-rose-950/20 px-2 py-1.5 border border-rose-900/30">
          <div className="text-[10px] uppercase font-semibold text-rose-400">High</div>
          <div className="text-xs text-slate-400 font-mono">≥ 70%</div>
        </div>
      </div>

      {/* Supporting Text (Responsible AI language) */}
      <p className="mt-4 text-xs sm:text-sm text-slate-300/90 leading-relaxed text-center">
        {supportingText}
      </p>
    </div>
  );
};
