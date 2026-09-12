/**
 * CustomerIQ — Customer Retention Intelligence Types
 */

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type EvidenceStrength = 'Strong' | 'Moderate' | 'Limited';

export interface CustomerInput {
  customerId?: string;
  frequency: number;
  monetary: number;
  recency: number;
  customerLifespan: number;
  avgPurchaseInterval: number;
  medianPurchaseInterval: number;
  marketingStrategy?: string; // New feature: user's proposed or current retention strategy
}

export interface CaseStudy {
  id: string;
  name: string;
  company: string;
  industry: string;
  relevant_pattern: string;
  strategy: string;
  evidence_strength: EvidenceStrength;
  empirical_outcome: string;
  rationale: string;
  key_takeaways: string[];
  best_channels: string[];
  matched_risk_levels: RiskLevel[];
  source?: string;
}

export interface StrategyEvaluation {
  score: number; // 0 to 100
  verdict: 'Optimal Alignment' | 'Moderate Alignment' | 'Potential Risk / Ineffective';
  rationale: string;
  matchedCaseStudy?: CaseStudy;
  strengths: string[];
  risksOrFlaws: string[];
  recommendations: string[];
}

export interface TestRecommendationData {
  recommendation?: string;
  goal?: string;
  metric?: string;
}

export interface CustomerIntelligenceResult {
  customer_id?: string;
  churn_probability: number;
  risk_segment: RiskLevel | string;
  revenue_exposure: number;
  key_behavioral_signals: string[] | Array<{ signal: string; direction?: 'up' | 'down' | 'neutral'; impact?: string }>;
  lifecycle_context: string;
  potential_strategy: string;
  recommended_channel: string;
  relevant_case_studies?: CaseStudy[];
  evidence_strength: EvidenceStrength | string;
  rationale: string;
  limitations: string | string[];
  test_recommendation: string | TestRecommendationData;
  marketing_strategy?: string;
  strategy_evaluation?: StrategyEvaluation;
  model_metadata?: {
    model_name?: string;
    version?: string;
    thresholds?: {
      high: number;
      medium: number;
    };
  };
}

export interface BatchCustomerRow {
  rowId: string | number;
  customerId: string;
  frequency: number;
  monetary: number;
  recency: number;
  customerLifespan: number;
  avgPurchaseInterval: number;
  medianPurchaseInterval: number;
  marketingStrategy?: string;
  rawRowData?: Record<string, any>;
}

export interface BatchCustomerResult extends BatchCustomerRow {
  churnProbability: number;
  riskSegment: RiskLevel;
  revenueExposure: number;
  keySignals: string[];
  recommendedStrategy: string;
  recommendedChannel: string;
  strategyEvaluation?: StrategyEvaluation;
  matchingCaseStudyName?: string;
  fullIntelligence?: CustomerIntelligenceResult;
}

export interface BatchUploadSummary {
  fileName: string;
  fileSize: number;
  totalRows: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageChurnProbability: number;
  totalRevenueExposure: number;
  strategyMatchAverage: number;
  processedAt: Date;
}

export interface AggregateMetrics {
  total_customers: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  average_churn_probability: number;
  total_revenue_exposure: number;
  is_live?: boolean;
}

export interface ApiStatus {
  connected: boolean;
  checking: boolean;
  url: string;
  version?: string;
  lastChecked?: Date;
  error?: string;
}

export type ActiveTab = 'overview' | 'batch_upload' | 'intelligence' | 'case_studies' | 'recommendations' | 'about';
