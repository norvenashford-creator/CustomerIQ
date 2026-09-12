/**
 * CustomerIQ Service Layer
 * Interfaces with FastAPI endpoints on Railway
 */

import { apiClient, ApiError, getStoredApiUrl } from './client';
import { CustomerInput, CustomerIntelligenceResult, AggregateMetrics, ApiStatus } from '../types';

export interface OpenApiRoute {
  path: string;
  method: string;
  summary?: string;
  operationId?: string;
}

/**
 * Check if the backend is reachable
 */
export async function checkBackendHealth(): Promise<ApiStatus> {
  const currentUrl = getStoredApiUrl();
  if (!currentUrl) {
    return {
      connected: false,
      checking: false,
      url: '',
      error: 'API URL is not configured.',
    };
  }

  // Common FastAPI health paths
  const healthEndpoints = ['/health', '/api/health', '/docs', '/openapi.json', '/'];

  for (const endpoint of healthEndpoints) {
    try {
      const response = await fetch(`${currentUrl.replace(/\/+$/, '')}${endpoint}`, {
        method: 'GET',
        headers: { Accept: 'application/json, text/html' },
      });

      if (response.ok || response.status === 200 || response.status === 307 || response.status === 308) {
        let version = 'v1.0.0';
        try {
          const json = await response.json();
          if (json.version) version = json.version;
          if (json.status) version = `Status: ${json.status}`;
        } catch {
          // not json, but responded
        }

        return {
          connected: true,
          checking: false,
          url: currentUrl,
          version,
          lastChecked: new Date(),
        };
      }
    } catch {
      // Continue to next probe
    }
  }

  return {
    connected: false,
    checking: false,
    url: currentUrl,
    lastChecked: new Date(),
    error: 'CustomerIQ API is currently unavailable.',
  };
}

/**
 * Inspect FastAPI OpenAPI schema to discover exact endpoints
 */
export async function inspectOpenApi(): Promise<{ routes: OpenApiRoute[]; title?: string; version?: string } | null> {
  try {
    const schema = await apiClient<any>('/openapi.json');
    if (!schema || !schema.paths) return null;

    const routes: OpenApiRoute[] = [];
    for (const [path, methods] of Object.entries(schema.paths)) {
      for (const [method, details] of Object.entries(methods as Record<string, any>)) {
        if (['get', 'post', 'put'].includes(method.toLowerCase())) {
          routes.push({
            path,
            method: method.toUpperCase(),
            summary: details.summary || details.description,
            operationId: details.operationId,
          });
        }
      }
    }

    return {
      routes,
      title: schema.info?.title,
      version: schema.info?.version,
    };
  } catch {
    return null;
  }
}

/**
 * Normalize raw backend response into typed CustomerIntelligenceResult
 */
function normalizeIntelligenceResult(raw: any, fallbackId?: string): CustomerIntelligenceResult {
  // Support both snake_case and camelCase from backend
  const churnProbRaw = raw.churn_probability ?? raw.churnProbability ?? raw.probability ?? raw.risk_score ?? raw.riskScore ?? 0;
  // If probability is returned as 0-100 percentage, normalize to decimal 0-1, or keep as is if formatted
  const churnProbability = churnProbRaw > 1 ? churnProbRaw / 100 : churnProbRaw;

  // Determine or use risk segment
  const rawSegment = (raw.risk_segment || raw.riskSegment || raw.risk_tier || raw.riskTier || '').toUpperCase();
  let risk_segment = rawSegment;
  if (!risk_segment) {
    if (churnProbability >= 0.70) risk_segment = 'HIGH';
    else if (churnProbability >= 0.40) risk_segment = 'MEDIUM';
    else risk_segment = 'LOW';
  }

  const revenue_exposure = Number(raw.revenue_exposure ?? raw.revenueExposure ?? raw.monetary ?? raw.exposure ?? 0);

  // Behavioral signals
  let key_behavioral_signals = raw.key_behavioral_signals ?? raw.keyBehavioralSignals ?? raw.behavioral_signals ?? raw.signals ?? [];
  if (typeof key_behavioral_signals === 'string') {
    key_behavioral_signals = [key_behavioral_signals];
  }

  const lifecycle_context = raw.lifecycle_context ?? raw.lifecycleContext ?? raw.lifecycle ?? 'Active customer profile';
  const potential_strategy = raw.potential_strategy ?? raw.potentialStrategy ?? raw.retention_strategy ?? raw.strategy ?? 'Targeted re-engagement intervention';
  const recommended_channel = raw.recommended_channel ?? raw.recommendedChannel ?? raw.channel ?? 'Direct Email / Dedicated CSM Outreach';
  const evidence_strength = raw.evidence_strength ?? raw.evidenceStrength ?? 'Moderate';
  const rationale = raw.rationale ?? raw.reason ?? raw.strategy_rationale ?? 'Identified based on behavioral trajectory and matching historical retention cases.';
  const limitations = raw.limitations ?? raw.model_limitations ?? [
    'Predictions are probabilistic based on observed behavioral indicators.',
    'Evidence-informed candidate strategies reflect historical analogies, not guaranteed outcomes.',
  ];
  const test_recommendation = raw.test_recommendation ?? raw.testRecommendation ?? {
    recommendation: 'Run an A/B pilot intervention with a matched control holdout group.',
    goal: 'Measure 30-day reactivation and retention lift versus standard cadence.',
  };

  const relevant_case_studies = raw.relevant_case_studies ?? raw.relevantCaseStudies ?? raw.case_studies ?? [];

  return {
    customer_id: raw.customer_id ?? raw.customerId ?? raw.id ?? fallbackId,
    churn_probability: churnProbability,
    risk_segment,
    revenue_exposure,
    key_behavioral_signals,
    lifecycle_context,
    potential_strategy,
    recommended_channel,
    relevant_case_studies,
    evidence_strength,
    rationale,
    limitations,
    test_recommendation,
    model_metadata: raw.model_metadata ?? {
      model_name: 'Gradient Boosting Classifier',
      version: '1.0.0',
      thresholds: { high: 0.70, medium: 0.40 },
    },
  };
}

/**
 * Analyze a customer using the FastAPI backend
 */
export async function analyzeCustomer(input: CustomerInput): Promise<CustomerIntelligenceResult> {
  const payload = {
    customer_id: input.customerId,
    frequency: Number(input.frequency),
    monetary: Number(input.monetary),
    recency: Number(input.recency),
    customer_lifespan: Number(input.customerLifespan),
    avg_purchase_interval: Number(input.avgPurchaseInterval),
    median_purchase_interval: Number(input.medianPurchaseInterval),
    // Also include camelCase versions in payload to maximize compatibility
    customerId: input.customerId,
    customerLifespan: Number(input.customerLifespan),
    avgPurchaseInterval: Number(input.avgPurchaseInterval),
    medianPurchaseInterval: Number(input.medianPurchaseInterval),
  };

  // List of candidate FastAPI endpoints for prediction/analysis
  const candidateEndpoints = [
    '/analyze',
    '/predict',
    '/api/analyze',
    '/api/predict',
    '/customer/analyze',
    '/customer/predict',
    '/retention/analyze',
  ];

  let lastError: ApiError | null = null;

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await apiClient<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        return normalizeIntelligenceResult(response, input.customerId);
      }
    } catch (err: any) {
      lastError = err;
      // If error was 404, this endpoint doesn't exist on this router, try next
      if (err instanceof ApiError && err.status === 404) {
        continue;
      }
      // If validation error or server error, bubble it up immediately
      if (err instanceof ApiError && (err.kind === 'validation' || err.kind === 'server')) {
        throw err;
      }
    }
  }

  // If none of the POST endpoints succeeded, check if there is a GET /customer/{id} or /predict?params
  if (input.customerId) {
    try {
      const getRes = await apiClient<any>(`/customer/${encodeURIComponent(input.customerId)}`);
      if (getRes) {
        return normalizeIntelligenceResult(getRes, input.customerId);
      }
    } catch {
      // ignore
    }
  }

  throw lastError || new ApiError('CustomerIQ API is currently unavailable.', 'offline');
}

/**
 * Fetch aggregate metrics if backend exposes them
 */
export async function fetchAggregateMetrics(): Promise<AggregateMetrics | null> {
  const metricEndpoints = ['/metrics', '/stats', '/overview', '/api/metrics', '/api/stats'];

  for (const ep of metricEndpoints) {
    try {
      const res = await apiClient<any>(ep, { method: 'GET' });
      if (res && (res.total_customers || res.totalCustomers)) {
        return {
          total_customers: res.total_customers ?? res.totalCustomers,
          high_risk: res.high_risk ?? res.highRisk,
          medium_risk: res.medium_risk ?? res.mediumRisk,
          low_risk: res.low_risk ?? res.lowRisk,
          average_churn_probability: res.average_churn_probability ?? res.avgChurnProbability ?? res.average_churn ?? 0.466,
          total_revenue_exposure: res.total_revenue_exposure ?? res.totalRevenueExposure ?? 0,
          is_live: true,
        };
      }
    } catch {
      // endpoint not available
    }
  }

  return null;
}
