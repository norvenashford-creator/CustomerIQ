import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './components/Overview';
import { CustomerInputForm, PRESET_PROFILES } from './components/CustomerInputForm';
import { CustomerIntelligenceView } from './components/CustomerIntelligenceView';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { AboutCustomerIQ } from './components/AboutCustomerIQ';
import { BackendConfigModal } from './components/BackendConfigModal';
import { RecommendationCard } from './components/RecommendationCard';
import { EvidenceCard } from './components/EvidenceCard';
import { TestRecommendationCard } from './components/TestRecommendationCard';
import { BatchUploadView } from './components/BatchUploadView';
import { CaseStudiesView } from './components/CaseStudiesView';

import {
  checkBackendHealth,
  analyzeCustomer,
  fetchAggregateMetrics,
} from './api/customerIQ';
import { getStoredApiUrl } from './api/client';
import {
  ActiveTab,
  ApiStatus,
  CustomerInput,
  CustomerIntelligenceResult,
  AggregateMetrics,
  RiskLevel,
} from './types';
import { predictCustomerRiskLocally } from './utils/mlEngine';
import { evaluateMarketingStrategy } from './utils/strategyEvaluator';
import { Sparkles, ArrowRight, Lightbulb, UserCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [targetCaseStudyId, setTargetCaseStudyId] = useState<string | undefined>(undefined);

  // API Health & Telemetry State
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    connected: false,
    checking: true,
    url: getStoredApiUrl(),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aggregateMetrics, setAggregateMetrics] = useState<AggregateMetrics | null>(null);

  // Customer Analysis State
  const [formInputValues, setFormInputValues] = useState<Partial<CustomerInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | string | null>(null);
  const [result, setResult] = useState<CustomerIntelligenceResult | null>(null);

  // Check health and aggregate metrics
  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const status = await checkBackendHealth();
      setApiStatus(status);

      if (status.connected) {
        const metrics = await fetchAggregateMetrics();
        if (metrics) setAggregateMetrics(metrics);
      }
    } catch {
      setApiStatus((prev) => ({
        ...prev,
        connected: false,
        checking: false,
        error: 'CustomerIQ API is currently unavailable.',
      }));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Handle Form Submission with API priority and local model fallback
  const handleAnalyzeSubmit = async (data: CustomerInput) => {
    setFormInputValues(data);
    setIsLoading(true);
    setError(null);

    try {
      let intelligence: CustomerIntelligenceResult;
      try {
        // Try live FastAPI backend first
        intelligence = await analyzeCustomer(data);
      } catch (backendErr) {
        // If backend is offline/unreachable, gracefully compute using calibrated local ML model
        console.warn('Backend API request unfulfilled, utilizing calibrated local model:', backendErr);
        intelligence = predictCustomerRiskLocally(data);
      }

      // If user supplied a marketing strategy, evaluate it against 10 case studies
      if (data.marketingStrategy) {
        intelligence.marketing_strategy = data.marketingStrategy;
        intelligence.strategy_evaluation = evaluateMarketingStrategy({
          strategy: data.marketingStrategy,
          churnProbability: intelligence.churn_probability,
          riskSegment: intelligence.risk_segment as RiskLevel,
          recency: data.recency,
          frequency: data.frequency,
          monetary: data.monetary,
          customerLifespan: data.customerLifespan,
          avgPurchaseInterval: data.avgPurchaseInterval,
        });
      }

      setResult(intelligence);
      setActiveTab('intelligence');
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Inspect customer from Batch Upload table
  const handleInspectCustomerFromBatch = (batchIntelligence: CustomerIntelligenceResult) => {
    setResult(batchIntelligence);
    setActiveTab('intelligence');
  };

  // Navigate to Case Studies tab with focus
  const handleNavigateToCaseStudies = (caseStudyId?: string) => {
    setTargetCaseStudyId(caseStudyId);
    setActiveTab('case_studies');
  };

  // Handle Selecting a Preset from Overview or Empty State
  const handleSelectArchetype = (archetypeKey: string) => {
    const preset = PRESET_PROFILES[archetypeKey];
    if (preset) {
      setFormInputValues(preset.values);
      setActiveTab('intelligence');
    }
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setError(null);
        }}
        apiStatus={apiStatus}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Minimal Topbar */}
        <Topbar
          apiStatus={apiStatus}
          onRefresh={checkHealth}
          isRefreshing={isRefreshing}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 px-4 py-8 sm:px-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <Overview
              onAnalyzeClick={() => setActiveTab('intelligence')}
              onUploadClick={() => setActiveTab('batch_upload')}
              onCaseStudiesClick={() => setActiveTab('case_studies')}
              onSelectArchetype={handleSelectArchetype}
              metrics={aggregateMetrics}
              apiConnected={apiStatus.connected}
            />
          )}

          {/* TAB 2: BATCH CUSTOMER BASE UPLOAD (EXCEL / CSV) */}
          {activeTab === 'batch_upload' && (
            <BatchUploadView
              onInspectCustomer={handleInspectCustomerFromBatch}
              onNavigateToCaseStudies={handleNavigateToCaseStudies}
            />
          )}

          {/* TAB 3: CUSTOMER INTELLIGENCE */}
          {activeTab === 'intelligence' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <div className="space-y-6">
                  <ErrorState
                    error={error}
                    onRetry={() => {
                      if (formInputValues.frequency !== undefined) {
                        handleAnalyzeSubmit(formInputValues as CustomerInput);
                      } else {
                        setError(null);
                      }
                    }}
                    onOpenSettings={() => setIsConfigModalOpen(true)}
                  />
                  <CustomerInputForm
                    onSubmit={handleAnalyzeSubmit}
                    isLoading={isLoading}
                    initialValues={formInputValues}
                  />
                </div>
              ) : result ? (
                <CustomerIntelligenceView
                  result={result}
                  onAnalyzeAnother={handleAnalyzeAnother}
                  onExploreCaseStudy={handleNavigateToCaseStudies}
                />
              ) : (
                <div className="space-y-8">
                  <CustomerInputForm
                    onSubmit={handleAnalyzeSubmit}
                    isLoading={isLoading}
                    initialValues={formInputValues}
                  />
                  <EmptyState
                    onAnalyzeClick={() => {
                      const btn = document.getElementById('btn-analyze-customer');
                      btn?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onSamplePreset={handleSelectArchetype}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CASE STUDIES & STRATEGY FEEDBACK */}
          {activeTab === 'case_studies' && (
            <CaseStudiesView initialCaseStudyId={targetCaseStudyId} />
          )}

          {/* TAB 5: RECOMMENDATIONS FOCUS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              {result ? (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      <Lightbulb className="h-4 w-4" />
                      <span>Action Focus</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                      Retention Recommendations & Empirical Evidence
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Candidate intervention and supporting case evidence for {result.customer_id || 'active account'}
                    </p>
                  </div>

                  <RecommendationCard
                    potentialStrategy={result.potential_strategy}
                    recommendedChannel={result.recommended_channel}
                    rationale={result.rationale}
                  />

                  <EvidenceCard
                    caseStudies={result.relevant_case_studies}
                    evidenceStrength={result.evidence_strength}
                  />

                  <TestRecommendationCard
                    testRecommendation={result.test_recommendation}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 sm:p-12 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Lightbulb className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">
                    No Customer Recommendation Generated Yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                    Retention strategies and evidence matching require a customer behavioral analysis profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('intelligence')}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <span>Analyze Customer Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ABOUT CUSTOMERIQ */}
          {activeTab === 'about' && <AboutCustomerIQ />}
        </main>
      </div>

      {/* Backend API Configuration & Connection Inspector Modal */}
      <BackendConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        apiStatus={apiStatus}
        onStatusChange={(newStatus) => setApiStatus(newStatus)}
      />
    </div>
  );
}
