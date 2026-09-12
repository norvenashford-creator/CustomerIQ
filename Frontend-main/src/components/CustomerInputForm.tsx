import React, { useState } from 'react';
import { User, DollarSign, Calendar, Clock, ShoppingCart, BarChart3, Sparkles, RotateCcw } from 'lucide-react';
import { CustomerInput } from '../types';

interface CustomerInputFormProps {
  onSubmit: (data: CustomerInput) => void;
  isLoading: boolean;
  initialValues?: Partial<CustomerInput>;
}

export const PRESET_PROFILES: Record<string, { label: string; desc: string; values: CustomerInput }> = {
  'high-risk': {
    label: 'High-Risk Enterprise Customer',
    desc: 'High spend ($3,450), 120 days since last purchase, historical interval 28 days',
    values: {
      customerId: 'CUST-8492',
      frequency: 5,
      monetary: 3450,
      recency: 120,
      customerLifespan: 450,
      avgPurchaseInterval: 28,
      medianPurchaseInterval: 25,
    },
  },
  'medium-risk': {
    label: 'Medium-Risk Mid-Tier Account',
    desc: 'Moderate spend ($1,245), 75 days recency, gap widening vs 40-day average',
    values: {
      customerId: 'CUST-6104',
      frequency: 4,
      monetary: 1245,
      recency: 75,
      customerLifespan: 360,
      avgPurchaseInterval: 40,
      medianPurchaseInterval: 38,
    },
  },
  'low-risk': {
    label: 'Healthy Active Customer',
    desc: 'Consistent transactions ($890), purchased 14 days ago, interval 21 days',
    values: {
      customerId: 'CUST-1920',
      frequency: 8,
      monetary: 890,
      recency: 14,
      customerLifespan: 210,
      avgPurchaseInterval: 21,
      medianPurchaseInterval: 20,
    },
  },
};

export const CustomerInputForm: React.FC<CustomerInputFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [customerId, setCustomerId] = useState(initialValues?.customerId || 'CUST-8492');
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency?.toString() || '4');
  const [monetary, setMonetary] = useState<string>(initialValues?.monetary?.toString() || '1245');
  const [recency, setRecency] = useState<string>(initialValues?.recency?.toString() || '92');
  const [customerLifespan, setCustomerLifespan] = useState<string>(initialValues?.customerLifespan?.toString() || '365');
  const [avgPurchaseInterval, setAvgPurchaseInterval] = useState<string>(initialValues?.avgPurchaseInterval?.toString() || '45');
  const [medianPurchaseInterval, setMedianPurchaseInterval] = useState<string>(initialValues?.medianPurchaseInterval?.toString() || '40');
  const [marketingStrategy, setMarketingStrategy] = useState<string>(initialValues?.marketingStrategy || '');

  const [validationError, setValidationError] = useState<string | null>(null);

  const applyPreset = (key: string) => {
    const preset = PRESET_PROFILES[key];
    if (preset) {
      setCustomerId(preset.values.customerId || '');
      setFrequency(preset.values.frequency.toString());
      setMonetary(preset.values.monetary.toString());
      setRecency(preset.values.recency.toString());
      setCustomerLifespan(preset.values.customerLifespan.toString());
      setAvgPurchaseInterval(preset.values.avgPurchaseInterval.toString());
      setMedianPurchaseInterval(preset.values.medianPurchaseInterval.toString());
      setMarketingStrategy(
        key === 'high-risk'
          ? 'Send 25% discount coupon via email blast'
          : key === 'medium-risk'
          ? 'Snooze subscription cadence by 30 days & offer product swap'
          : 'VIP Tier recognition with double points and private drop invite'
      );
      setValidationError(null);
    }
  };

  const handleReset = () => {
    setCustomerId('');
    setFrequency('');
    setMonetary('');
    setRecency('');
    setCustomerLifespan('');
    setAvgPurchaseInterval('');
    setMedianPurchaseInterval('');
    setMarketingStrategy('');
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const freqNum = Number(frequency);
    const monNum = Number(monetary);
    const recNum = Number(recency);
    const lifeNum = Number(customerLifespan);
    const avgNum = Number(avgPurchaseInterval);
    const medNum = Number(medianPurchaseInterval);

    // Validation checks
    if (isNaN(freqNum) || freqNum < 0) {
      setValidationError('Purchase frequency must be a valid non-negative number.');
      return;
    }
    if (isNaN(monNum) || monNum < 0) {
      setValidationError('Monetary revenue must be a valid non-negative number.');
      return;
    }
    if (isNaN(recNum) || recNum < 0) {
      setValidationError('Recency must be a valid non-negative number.');
      return;
    }
    if (isNaN(lifeNum) || lifeNum < 0) {
      setValidationError('Customer lifespan must be a valid non-negative number.');
      return;
    }
    if (isNaN(avgNum) || avgNum < 0) {
      setValidationError('Average purchase interval must be a valid non-negative number.');
      return;
    }
    if (isNaN(medNum) || medNum < 0) {
      setValidationError('Median purchase interval must be a valid non-negative number.');
      return;
    }

    if (recNum > lifeNum && lifeNum > 0) {
      setValidationError('Recency (days since last purchase) cannot exceed total customer lifespan.');
      return;
    }

    onSubmit({
      customerId: customerId.trim() || undefined,
      frequency: freqNum,
      monetary: monNum,
      recency: recNum,
      customerLifespan: lifeNum,
      avgPurchaseInterval: avgNum,
      medianPurchaseInterval: medNum,
      marketingStrategy: marketingStrategy.trim() || undefined,
    });
  };

  return (
    <div
      id="customer-analysis-form-card"
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-sm"
    >
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Analyze Customer
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Enter customer information to generate a retention intelligence profile.
          </p>
        </div>

        {/* Quick sample preset buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold hidden md:inline">
            Load Preset:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('high-risk')}
              disabled={isLoading}
              className="rounded-lg border border-rose-500/30 bg-rose-950/20 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
              title={PRESET_PROFILES['high-risk'].desc}
            >
              High Risk
            </button>
            <button
              type="button"
              onClick={() => applyPreset('medium-risk')}
              disabled={isLoading}
              className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-950/40 transition-colors disabled:opacity-50 cursor-pointer"
              title={PRESET_PROFILES['medium-risk'].desc}
            >
              Medium Risk
            </button>
            <button
              type="button"
              onClick={() => applyPreset('low-risk')}
              disabled={isLoading}
              className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-950/40 transition-colors disabled:opacity-50 cursor-pointer"
              title={PRESET_PROFILES['low-risk'].desc}
            >
              Low Risk
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Customer Identifier */}
        <div>
          <label
            htmlFor="customer-id-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Customer ID / Account Reference
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              id="customer-id-input"
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="e.g. CUST-8492 or email@domain.com"
              disabled={isLoading}
              className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Optional identifier or ID key for CRM cross-referencing.
          </p>
        </div>

        {/* Behavioral Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Frequency */}
          <div>
            <label
              htmlFor="frequency-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Frequency (Purchases) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <input
                id="frequency-input"
                type="number"
                min="0"
                step="1"
                required
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="4"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Total lifetime completed transactions.
            </p>
          </div>

          {/* Monetary */}
          <div>
            <label
              htmlFor="monetary-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Monetary Value ($) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                id="monetary-input"
                type="number"
                min="0"
                step="0.01"
                required
                value={monetary}
                onChange={(e) => setMonetary(e.target.value)}
                placeholder="1245.00"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Cumulative historical revenue exposure.
            </p>
          </div>

          {/* Recency */}
          <div>
            <label
              htmlFor="recency-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Recency (Days) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Clock className="h-4 w-4" />
              </div>
              <input
                id="recency-input"
                type="number"
                min="0"
                step="1"
                required
                value={recency}
                onChange={(e) => setRecency(e.target.value)}
                placeholder="92"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Days elapsed since most recent activity.
            </p>
          </div>

          {/* Customer Lifespan */}
          <div>
            <label
              htmlFor="lifespan-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Customer Lifespan (Days) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id="lifespan-input"
                type="number"
                min="0"
                step="1"
                required
                value={customerLifespan}
                onChange={(e) => setCustomerLifespan(e.target.value)}
                placeholder="365"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Total days between first order and current period.
            </p>
          </div>

          {/* Average Purchase Interval */}
          <div>
            <label
              htmlFor="avg-interval-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Avg. Purchase Interval (Days) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <BarChart3 className="h-4 w-4" />
              </div>
              <input
                id="avg-interval-input"
                type="number"
                min="0"
                step="0.1"
                required
                value={avgPurchaseInterval}
                onChange={(e) => setAvgPurchaseInterval(e.target.value)}
                placeholder="45"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Mean days between sequential transactions.
            </p>
          </div>

          {/* Median Purchase Interval */}
          <div>
            <label
              htmlFor="median-interval-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Median Purchase Interval (Days) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <BarChart3 className="h-4 w-4" />
              </div>
              <input
                id="median-interval-input"
                type="number"
                min="0"
                step="0.1"
                required
                value={medianPurchaseInterval}
                onChange={(e) => setMedianPurchaseInterval(e.target.value)}
                placeholder="40"
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Median interval mitigating outlier distortion.
            </p>
          </div>
        </div>

        {/* NEW FEATURE: Proposed Marketing Strategy (Evaluated against 10 Case Studies) */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4.5 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label
              htmlFor="marketing-strategy-input"
              className="block text-xs font-semibold uppercase tracking-wider text-indigo-300"
            >
              Proposed Marketing Retention Strategy (Optional)
            </label>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
              Evaluated against 10 Case Studies
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-2.5">
            Enter the marketing campaign or action planned for this account. The ML engine will analyze its viability and provide empirical feedback.
          </p>
          <input
            id="marketing-strategy-input"
            type="text"
            value={marketingStrategy}
            onChange={(e) => setMarketingStrategy(e.target.value)}
            placeholder="e.g. Send 25% discount email, Snooze delivery cadence by 30 days, or Schedule executive CSM check-in"
            disabled={isLoading}
            className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Quick ideas:</span>
            <button
              type="button"
              onClick={() => setMarketingStrategy('VIP tier protection with double points and private concierge access')}
              className="rounded bg-slate-800 px-2 py-0.5 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              VIP Tier Perks
            </button>
            <button
              type="button"
              onClick={() => setMarketingStrategy('Snooze subscription interval by 30 days with 1-click flexibility')}
              className="rounded bg-slate-800 px-2 py-0.5 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Interval Snooze
            </button>
            <button
              type="button"
              onClick={() => setMarketingStrategy('Personalized milestone recap with limited-time 20% re-activation coupon')}
              className="rounded bg-slate-800 px-2 py-0.5 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Milestone Win-back
            </button>
            <button
              type="button"
              onClick={() => setMarketingStrategy('Executive account briefing with productivity telemetry & CSM review')}
              className="rounded bg-slate-800 px-2 py-0.5 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              B2B CSM Call
            </button>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-rose-300">
            {validationError}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset form</span>
          </button>

          <button
            id="btn-analyze-customer"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Analyzing customer behavior...' : 'Analyze Customer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
