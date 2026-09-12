import React from 'react';
import { FlaskConical, CheckSquare, Target } from 'lucide-react';
import { TestRecommendationData } from '../types';

interface TestRecommendationCardProps {
  testRecommendation: string | TestRecommendationData;
}

export const TestRecommendationCard: React.FC<TestRecommendationCardProps> = ({
  testRecommendation,
}) => {
  if (!testRecommendation) return null;

  let recommendationText = '';
  let goalText = '';

  if (typeof testRecommendation === 'string') {
    recommendationText = testRecommendation;
    goalText = 'Measure 30-day retention and reactivation lift relative to a randomized holdout group.';
  } else {
    recommendationText = testRecommendation.recommendation || 'Deploy targeted intervention with a randomized holdout group.';
    goalText = testRecommendation.goal || (testRecommendation.metric ? `Evaluate retention against target metric: ${testRecommendation.metric}` : 'Measure retention lift against control group.');
  }

  return (
    <div
      id="recommended-next-test-card"
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
          <FlaskConical className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            Recommended Next Test
          </h3>
          <p className="text-xs text-slate-400">
            Empirical experiment structure before widespread roll-out
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Next Test</span>
          </div>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed font-medium">
            {recommendationText}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Target className="h-3.5 w-3.5" />
            <span>Goal</span>
          </div>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {goalText}
          </p>
        </div>
      </div>
    </div>
  );
};
