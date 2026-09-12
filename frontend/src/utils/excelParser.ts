import * as XLSX from 'xlsx';
import { BatchCustomerRow, BatchCustomerResult } from '../types';

export interface ColumnMapping {
  customerId: string;
  frequency: string;
  monetary: string;
  recency: string;
  customerLifespan: string;
  avgPurchaseInterval: string;
  medianPurchaseInterval: string;
  marketingStrategy: string; // The new strategy feature
}

export interface ParsedWorkbookData {
  sheetNames: string[];
  selectedSheet: string;
  headers: string[];
  rawRows: Record<string, any>[];
  detectedMapping: ColumnMapping;
}

/**
 * Fuzzy matching to find best column candidates from header names.
 */
export function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const norm = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const findBest = (patterns: string[]): string => {
    for (const p of patterns) {
      const match = headers.find((h) => norm(h) === norm(p));
      if (match) return match;
    }
    for (const p of patterns) {
      const match = headers.find((h) => norm(h).includes(norm(p)));
      if (match) return match;
    }
    return '';
  };

  return {
    customerId: findBest([
      'customer_id',
      'customerid',
      'cust_id',
      'id',
      'user_id',
      'account_id',
      'client_id',
      'email',
      'customer',
      'account',
    ]),
    frequency: findBest([
      'frequency',
      'orders',
      'order_count',
      'purchases',
      'transaction_count',
      'transactions',
      'count',
      'total_orders',
      'num_orders',
    ]),
    monetary: findBest([
      'monetary',
      'revenue',
      'spend',
      'total_spend',
      'total_revenue',
      'sales',
      'amount',
      'lifetime_value',
      'ltv',
      'clv',
      'value',
    ]),
    recency: findBest([
      'recency',
      'days_since_last_purchase',
      'last_order_days',
      'recency_days',
      'days_inactive',
      'last_active_days',
      'days_since_order',
    ]),
    customerLifespan: findBest([
      'customer_lifespan',
      'customerlifespan',
      'lifespan',
      'tenure',
      'tenure_days',
      'account_age',
      'account_age_days',
      'days_as_customer',
    ]),
    avgPurchaseInterval: findBest([
      'avg_purchase_interval',
      'avgpurchaseinterval',
      'avg_interval',
      'average_interval',
      'order_interval',
      'purchase_interval',
      'interval',
    ]),
    medianPurchaseInterval: findBest([
      'median_purchase_interval',
      'medianpurchaseinterval',
      'median_interval',
    ]),
    marketingStrategy: findBest([
      'marketing_strategy',
      'marketingstrategy',
      'strategy',
      'retention_strategy',
      'campaign',
      'current_campaign',
      'action',
      'proposed_strategy',
      'intervention',
    ]),
  };
}

/**
 * Read and parse an Excel (.xlsx, .xls) or CSV file.
 */
export async function parseExcelOrCsvFile(file: File): Promise<ParsedWorkbookData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

  const sheetNames = workbook.SheetNames;
  if (!sheetNames || sheetNames.length === 0) {
    throw new Error('The uploaded file does not contain any readable sheets.');
  }

  const selectedSheet = sheetNames[0];
  const worksheet = workbook.Sheets[selectedSheet];

  // Parse to JSON array of objects
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    defval: '',
    raw: false,
  });

  if (rawRows.length === 0) {
    throw new Error('The selected sheet is empty. Please upload a file containing customer records.');
  }

  // Extract unique headers
  const headers = Object.keys(rawRows[0] || {});
  const detectedMapping = autoDetectColumnMapping(headers);

  return {
    sheetNames,
    selectedSheet,
    headers,
    rawRows,
    detectedMapping,
  };
}

/**
 * Read specific sheet from existing workbook
 */
export function extractRowsFromWorksheet(
  workbook: XLSX.WorkBook,
  sheetName: string
): { headers: string[]; rawRows: Record<string, any>[]; detectedMapping: ColumnMapping } {
  const worksheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    defval: '',
    raw: false,
  });
  const headers = Object.keys(rawRows[0] || {});
  const detectedMapping = autoDetectColumnMapping(headers);

  return { headers, rawRows, detectedMapping };
}

/**
 * Convert raw parsed rows into standardized BatchCustomerRow format using mapping.
 */
export function mapRawRowsToBatchCustomers(
  rawRows: Record<string, any>[],
  mapping: ColumnMapping
): BatchCustomerRow[] {
  return rawRows.map((row, idx) => {
    // Customer ID
    const customerId = mapping.customerId && row[mapping.customerId]
      ? String(row[mapping.customerId]).trim()
      : `CUST-${String(idx + 1).padStart(4, '0')}`;

    // Frequency
    const rawFreq = mapping.frequency ? Number(row[mapping.frequency]) : 1;
    const frequency = isNaN(rawFreq) || rawFreq <= 0 ? 1 : Math.round(rawFreq);

    // Monetary
    const rawMonetary = mapping.monetary
      ? Number(String(row[mapping.monetary]).replace(/[^0-9.-]+/g, ''))
      : 150;
    const monetary = isNaN(rawMonetary) || rawMonetary < 0 ? 0 : rawMonetary;

    // Recency
    const rawRecency = mapping.recency ? Number(row[mapping.recency]) : 30;
    const recency = isNaN(rawRecency) || rawRecency < 0 ? 30 : Math.round(rawRecency);

    // Lifespan (fallback if missing)
    let customerLifespan = mapping.customerLifespan ? Number(row[mapping.customerLifespan]) : 0;
    if (isNaN(customerLifespan) || customerLifespan <= 0) {
      customerLifespan = Math.max(recency + 15, frequency * 30);
    }

    // Avg interval (fallback if missing)
    let avgPurchaseInterval = mapping.avgPurchaseInterval ? Number(row[mapping.avgPurchaseInterval]) : 0;
    if (isNaN(avgPurchaseInterval) || avgPurchaseInterval <= 0) {
      avgPurchaseInterval = frequency > 1 ? Math.round(customerLifespan / frequency) : 30;
    }

    // Median interval
    let medianPurchaseInterval = mapping.medianPurchaseInterval ? Number(row[mapping.medianPurchaseInterval]) : 0;
    if (isNaN(medianPurchaseInterval) || medianPurchaseInterval <= 0) {
      medianPurchaseInterval = avgPurchaseInterval;
    }

    // Marketing Strategy (New feature in Excel file)
    const marketingStrategy = mapping.marketingStrategy && row[mapping.marketingStrategy]
      ? String(row[mapping.marketingStrategy]).trim()
      : undefined;

    return {
      rowId: idx + 1,
      customerId,
      frequency,
      monetary,
      recency,
      customerLifespan,
      avgPurchaseInterval,
      medianPurchaseInterval,
      marketingStrategy,
      rawRowData: row,
    };
  });
}

/**
 * Generate and download a starter Excel template (.xlsx) with sample data
 * including the new Marketing Strategy column.
 */
export function generateSampleExcelTemplate(): void {
  const sampleData = [
    {
      customer_id: 'CUST-8492',
      frequency: 3,
      monetary: 3450.00,
      recency: 120,
      customer_lifespan: 240,
      avg_purchase_interval: 40.0,
      median_purchase_interval: 38.0,
      marketing_strategy: 'Send 25% discount coupon via email blast',
    },
    {
      customer_id: 'CUST-6104',
      frequency: 4,
      monetary: 1245.50,
      recency: 75,
      customer_lifespan: 195,
      avg_purchase_interval: 40.0,
      median_purchase_interval: 35.0,
      marketing_strategy: 'Snooze subscription cadence by 30 days & offer product swap',
    },
    {
      customer_id: 'CUST-1920',
      frequency: 8,
      monetary: 2150.00,
      recency: 14,
      customer_lifespan: 365,
      avg_purchase_interval: 21.0,
      median_purchase_interval: 20.0,
      marketing_strategy: 'VIP Tier recognition with double points and private drop invite',
    },
    {
      customer_id: 'CUST-5231',
      frequency: 1,
      monetary: 89.00,
      recency: 95,
      customer_lifespan: 100,
      avg_purchase_interval: 30.0,
      median_purchase_interval: 30.0,
      marketing_strategy: 'Onboarding check-in email with product starter guide',
    },
    {
      customer_id: 'CUST-7741',
      frequency: 12,
      monetary: 4890.00,
      recency: 85,
      customer_lifespan: 510,
      avg_purchase_interval: 35.0,
      median_purchase_interval: 32.0,
      marketing_strategy: 'Executive CSM review call with account productivity report',
    },
    {
      customer_id: 'CUST-3319',
      frequency: 5,
      monetary: 620.00,
      recency: 32,
      customer_lifespan: 160,
      avg_purchase_interval: 26.0,
      median_purchase_interval: 25.0,
      marketing_strategy: 'Curated feature digest showcasing new community templates',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths for polished presentation
  ws['!cols'] = [
    { wch: 14 }, // customer_id
    { wch: 12 }, // frequency
    { wch: 12 }, // monetary
    { wch: 10 }, // recency
    { wch: 18 }, // customer_lifespan
    { wch: 22 }, // avg_purchase_interval
    { wch: 24 }, // median_purchase_interval
    { wch: 55 }, // marketing_strategy
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customer_Telemetry');

  // Add documentation sheet
  const docData = [
    ['CustomerIQ Excel Data Format Guide', ''],
    ['', ''],
    ['Column Header', 'Description & Guidance'],
    ['customer_id', 'Unique client / account identifier (alphanumeric).'],
    ['frequency', 'Total lifetime orders, transactions, or active milestones.'],
    ['monetary', 'Total gross revenue or cumulative spend in currency units ($).'],
    ['recency', 'Days elapsed since the customer’s most recent transaction.'],
    ['customer_lifespan', 'Total days between first recorded event and latest event.'],
    ['avg_purchase_interval', 'Mean days elapsed between consecutive purchases.'],
    ['median_purchase_interval', 'Median days elapsed between consecutive purchases.'],
    ['marketing_strategy (NEW)', 'Optional: Proposed or current retention strategy to receive ML feedback against 10 real-world case studies.'],
  ];
  const docWs = XLSX.utils.aoa_to_sheet(docData);
  docWs['!cols'] = [{ wch: 28 }, { wch: 75 }];
  XLSX.utils.book_append_sheet(wb, docWs, 'Data_Dictionary');

  XLSX.writeFile(wb, 'CustomerIQ_Retention_Data_Template.xlsx');
}

/**
 * Export batch prediction results to Excel (.xlsx).
 */
export function exportBatchPredictionsToExcel(
  results: BatchCustomerResult[],
  originalFileName: string = 'Customer_Base'
): void {
  const exportRows = results.map((r) => ({
    'Customer ID': r.customerId,
    'Churn Probability (%)': (r.churnProbability * 100).toFixed(1) + '%',
    'Risk Segment': r.riskSegment,
    'Revenue Exposure ($)': Number(r.revenueExposure.toFixed(2)),
    'Recency (Days)': r.recency,
    'Frequency (Orders)': r.frequency,
    'Average Interval (Days)': Number(r.avgPurchaseInterval.toFixed(1)),
    'Recommended Strategy': r.recommendedStrategy,
    'Recommended Channel': r.recommendedChannel,
    'Key Behavioral Signals': r.keySignals.join(' | '),
    'Current Marketing Strategy': r.marketingStrategy || 'None Provided',
    'Strategy Evaluation Verdict': r.strategyEvaluation?.verdict || 'N/A',
    'Strategy Alignment Score': r.strategyEvaluation ? `${r.strategyEvaluation.score}/100` : 'N/A',
    'Strategy Feedback': r.strategyEvaluation?.rationale || 'N/A',
    'Matching Case Study Precedent': r.matchingCaseStudyName || 'N/A',
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  ws['!cols'] = [
    { wch: 15 }, // ID
    { wch: 20 }, // Churn Prob
    { wch: 14 }, // Risk
    { wch: 20 }, // Revenue
    { wch: 15 }, // Recency
    { wch: 18 }, // Frequency
    { wch: 22 }, // Avg Interval
    { wch: 40 }, // Recommended Strategy
    { wch: 30 }, // Channel
    { wch: 50 }, // Signals
    { wch: 40 }, // Current Strategy
    { wch: 25 }, // Verdict
    { wch: 22 }, // Score
    { wch: 50 }, // Feedback
    { wch: 35 }, // Case Study
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Predictions_&_Intelligence');

  const baseName = originalFileName.replace(/\.[^/.]+$/, '');
  XLSX.writeFile(wb, `${baseName}_CustomerIQ_Predictions.xlsx`);
}
