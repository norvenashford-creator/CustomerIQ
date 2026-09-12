import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Building2,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { TEN_CASE_STUDIES, getCaseStudyById } from '../data/caseStudies';
import { evaluateMarketingStrategy } from '../utils/strategyEvaluator';
import { StrategyFeedbackCard } from './StrategyFeedbackCard';
import { CaseStudy, StrategyEvaluation, RiskLevel } from '../types';

interface CaseStudiesViewProps {
  initialCaseStudyId?: string;
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({ initialCaseStudyId }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    initialCaseStudyId || null
  );
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Strategy Evaluator State
  const [testStrategy, setTestStrategy] = useState<string>(
    'Send 25% discount coupon via email blast'
  );
  const [testRiskTier, setTestRiskTier] = useState<RiskLevel>('HIGH');
  const [testMonetary, setTestMonetary] = useState<number>(3200);
  const [testRecency, setTestRecency] = useState<number>(95);
  const [testFrequency, setTestFrequency] = useState<number>(5);
  const [evaluationResult, setEvaluationResult] = useState<StrategyEvaluation | null>(() =>
    evaluateMarketingStrategy({
      strategy: 'Send 25% discount coupon via email blast',
      churnProbability: 0.82,
      riskSegment: 'HIGH',
      monetary: 3200,
      recency: 95,
      frequency: 5,
    })
  );

  const handleRunEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const result = evaluateMarketingStrategy({
      strategy: testStrategy,
      churnProbability: testRiskTier === 'HIGH' ? 0.82 : testRiskTier === 'MEDIUM' ? 0.54 : 0.18,
      riskSegment: testRiskTier,
      monetary: testMonetary,
      recency: testRecency,
      frequency: testFrequency,
    });
    setEvaluationResult(result);
  };

  const industries = Array.from(new Set(TEN_CASE_STUDIES.map((c) => c.industry.split(' ')[0])));

  const filteredCaseStudies = TEN_CASE_STUDIES.filter((cs) => {
    if (industryFilter !== 'ALL' && !cs.industry.includes(industryFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cs.name.toLowerCase().includes(q);
      const matchCompany = cs.company.toLowerCase().includes(q);
      const matchPattern = cs.relevant_pattern.toLowerCase().includes(q);
      const matchStrategy = cs.strategy.toLowerCase().includes(q);
      return matchName || matchCompany || matchPattern || matchStrategy;
    }
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Empirical Retention Knowledge Base (10 Case Studies)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Marketing Strategy Feedback & Case Studies
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            CustomerIQ’s strategy recommendation and feedback engine is grounded in 10 empirical retention case studies across enterprise SaaS, subscription streaming, e-commerce, mobile habits, and D2C commerce. Test any marketing retention strategy below or explore the empirical precedent database.
          </p>
        </div>
      </div>

      {/* Interactive Strategy Evaluator Sandbox */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Interactive Retention Strategy Evaluator</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Test Any Retention Strategy Against the 10 Case Studies
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate customer behavioral telemetry to receive evidence-based feedback on planned retention marketing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTestStrategy('VIP tier protection with double points and private concierge access');
                setTestRiskTier('HIGH');
                setTestMonetary(3800);
                setTestRecency(85);
                setTestFrequency(8);
              }}
              className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              VIP Archetype
            </button>
            <button
              type="button"
              onClick={() => {
                setTestStrategy('Snooze delivery cadence by 30 days & offer product swap');
                setTestRiskTier('MEDIUM');
                setTestMonetary(950);
                setTestRecency(55);
                setTestFrequency(4);
              }}
              className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Cadence Snooze
            </button>
          </div>
        </div>

        <form onSubmit={handleRunEvaluation} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Strategy Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Proposed Marketing / Retention Strategy *
              </label>
              <input
                type="text"
                value={testStrategy}
                onChange={(e) => setTestStrategy(e.target.value)}
                placeholder="e.g. Proactive CSM outreach with time-saved executive brief"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Target Risk Tier */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Risk Tier
              </label>
              <select
                value={testRiskTier}
                onChange={(e) => setTestRiskTier(e.target.value as RiskLevel)}
                className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="HIGH">High Risk (Prob ≥ 70%)</option>
                <option value="MEDIUM">Medium Risk (Prob 40-69%)</option>
                <option value="LOW">Low Risk (Prob &lt; 40%)</option>
              </select>
            </div>

            {/* Customer Spend */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Spend ($ Monetary)
              </label>
              <input
                type="number"
                min="0"
                value={testMonetary}
                onChange={(e) => setTestMonetary(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Evaluate Strategy Alignment</span>
            </button>
          </div>
        </form>

        {/* Live Evaluation Result */}
        {evaluationResult && (
          <div className="pt-2">
            <StrategyFeedbackCard
              evaluation={evaluationResult}
              strategyName={testStrategy}
              onExploreCaseStudy={(csId) => setSelectedCaseId(csId)}
            />
          </div>
        )}
      </div>

      {/* 10 Case Studies Library Explorer */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <span>The 10 Retention Case Studies</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical evidence backing CustomerIQ's behavioral guidance rules.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies..."
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-48"
              />
            </div>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Industries (10)</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCaseStudies.map((cs, idx) => {
            const isSelected = selectedCaseId === cs.id;

            return (
              <div
                key={cs.id}
                id={`case-study-${cs.id}`}
                className={`rounded-2xl border transition-all p-6 backdrop-blur-sm space-y-4 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Case Study #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {cs.company}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {cs.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{cs.industry}</p>
                  </div>

                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {cs.evidence_strength} Evidence
                  </span>
                </div>

                {/* Behavioral Pattern */}
                <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3 space-y-1 text-xs">
                  <span className="font-semibold text-slate-300 block">
                    Target Behavioral Pattern:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {cs.relevant_pattern}
                  </p>
                </div>

                {/* Strategy Tested */}
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-indigo-300 block">
                    Tested Marketing Strategy:
                  </span>
                  <p className="text-slate-200 font-medium">
                    {cs.strategy}
                  </p>
                </div>

                {/* Empirical Outcome */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-3 text-xs text-emerald-300 space-y-0.5">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Empirical Outcome:</span>
                  </span>
                  <p>{cs.empirical_outcome}</p>
                </div>

                {/* Key Takeaways */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Strategic Takeaways:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {cs.key_takeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold mt-0.5">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Channels */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-semibold">Recommended Channels:</span>
                  {cs.best_channels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-mono"
                    >
                      {ch}
                    </span>
                  ))}
                </div>

                {/* Source Citation */}
                {cs.source && (
                  <div className="text-[10px] text-slate-500 italic pt-1">
                    Source: {cs.source}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
