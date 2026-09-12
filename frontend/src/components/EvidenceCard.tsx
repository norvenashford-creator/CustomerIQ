import React from 'react';
import { BookOpen, ExternalLink, Award, Info } from 'lucide-react';
import { CaseStudy, EvidenceStrength } from '../types';

interface EvidenceCardProps {
  caseStudies?: CaseStudy[];
  evidenceStrength?: EvidenceStrength | string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  caseStudies = [],
  evidenceStrength = 'Moderate',
}) => {
  const normStrength = (evidenceStrength || '').toUpperCase();
  const isStrong = normStrength.includes('STRONG');
  const isLimited = normStrength.includes('LIMITED');

  const strengthBadgeConfig = isStrong
    ? { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Strong Evidence' }
    : isLimited
    ? { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'Limited Evidence' }
    : { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Moderate Evidence' };

  return (
    <div
      id="supporting-evidence-section"
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Supporting Evidence
            </h3>
            <p className="text-xs text-slate-400">
              Analogous historical retention cases & empirical benchmarks
            </p>
          </div>
        </div>

        {/* Evidence Strength Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Evidence Strength:</span>
          <span
            id="evidence-strength-badge"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${strengthBadgeConfig.bg} ${strengthBadgeConfig.border} ${strengthBadgeConfig.text}`}
          >
            <Award className="h-3 w-3" />
            <span>{evidenceStrength || 'Moderate'}</span>
          </span>
        </div>
      </div>

      {/* Case studies list */}
      <div className="mt-5">
        {caseStudies && caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudies.map((cs, idx) => {
              const name = cs.name || cs.company || cs.case_name || `Case Study #${idx + 1}`;
              const pattern = cs.relevant_pattern || cs.pattern || 'Similar behavioral cadence & customer segment';
              const strategy = cs.strategy;
              const rationale = cs.rationale;
              const url = cs.url || cs.source;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-slate-800/40 p-5 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      {name}
                    </h4>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                        title="View Case Source"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {pattern && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-slate-400 font-medium">Pattern: </span>
                      {pattern}
                    </div>
                  )}

                  {strategy && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-slate-400 font-medium">Intervention: </span>
                      {strategy}
                    </div>
                  )}

                  {rationale && (
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2.5">
                      {rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-800/20 p-6 text-center">
            <p className="text-sm text-slate-400">
              No directly relevant case evidence was found.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Intervention should follow baseline retention protocol and conservative holdout testing.
            </p>
          </div>
        )}
      </div>

      {/* Mandatory responsible AI explanation */}
      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-slate-800/20 border border-white/5 p-3.5 text-xs text-slate-400 leading-relaxed">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Evidence strength reflects the relevance of available historical cases, not a guarantee of intervention success.
        </p>
      </div>
    </div>
  );
};
