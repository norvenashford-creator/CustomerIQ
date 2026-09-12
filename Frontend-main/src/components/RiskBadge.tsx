import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const norm = (level || '').toUpperCase();

  const isHigh = norm === 'HIGH' || norm.includes('HIGH');
  const isMedium = norm === 'MEDIUM' || norm.includes('MED');
  const isLow = norm === 'LOW' || norm.includes('LOW');

  let config = {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'LOW RISK',
    Icon: CheckCircle2,
  };

  if (isHigh) {
    config = {
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      label: 'HIGH RISK',
      Icon: AlertCircle,
    };
  } else if (isMedium) {
    config = {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'MEDIUM RISK',
      Icon: AlertTriangle,
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium tracking-wide',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2 font-semibold tracking-wider',
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2.5 font-bold tracking-wider',
  };

  const IconComponent = config.Icon;

  return (
    <span
      id={`risk-badge-${norm.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4'} />}
      <span>{config.label}</span>
    </span>
  );
};
