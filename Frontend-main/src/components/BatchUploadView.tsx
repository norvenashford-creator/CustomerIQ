import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingDown,
  DollarSign,
  Users,
  ShieldAlert,
} from 'lucide-react';
import {
  BatchCustomerRow,
  BatchCustomerResult,
  BatchUploadSummary,
  RiskLevel,
  CustomerIntelligenceResult,
} from '../types';
import {
  parseExcelOrCsvFile,
  ColumnMapping,
  mapRawRowsToBatchCustomers,
  generateSampleExcelTemplate,
  exportBatchPredictionsToExcel,
  ParsedWorkbookData,
} from '../utils/excelParser';
import { processBatchCustomerData } from '../utils/mlEngine';
import { StrategyFeedbackCard } from './StrategyFeedbackCard';
import { RiskBadge } from './RiskBadge';

interface BatchUploadViewProps {
  onInspectCustomer: (result: CustomerIntelligenceResult) => void;
  onNavigateToCaseStudies?: (caseStudyId?: string) => void;
}

export const BatchUploadView: React.FC<BatchUploadViewProps> = ({
  onInspectCustomer,
  onNavigateToCaseStudies,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedWorkbookData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [isMappingOpen, setIsMappingOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Processed results
  const [batchResults, setBatchResults] = useState<BatchCustomerResult[] | null>(null);
  const [batchSummary, setBatchSummary] = useState<BatchUploadSummary | null>(null);

  // Table filtering & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<'ALL' | 'WITH_STRATEGY'>('ALL');
  const [selectedResultForFeedback, setSelectedResultForFeedback] = useState<BatchCustomerResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setErrorMessage(null);
    setFile(selectedFile);
    setIsProcessing(true);
    setProgressPercent(15);

    try {
      const parsed = await parseExcelOrCsvFile(selectedFile);
      setParsedData(parsed);
      setColumnMapping(parsed.detectedMapping);
      setProgressPercent(100);

      // Auto run prediction if mapped correctly
      runBatchPrediction(parsed.rawRows, parsed.detectedMapping, selectedFile);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse the uploaded file.');
      setParsedData(null);
      setColumnMapping(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const runBatchPrediction = (
    rawRows: Record<string, any>[],
    mapping: ColumnMapping,
    currentFile: File
  ) => {
    setIsProcessing(true);
    setProgressPercent(40);

    setTimeout(() => {
      try {
        const batchRows = mapRawRowsToBatchCustomers(rawRows, mapping);
        setProgressPercent(75);

        const { results, summary } = processBatchCustomerData(
          batchRows,
          currentFile.name,
          currentFile.size
        );

        setBatchResults(results);
        setBatchSummary(summary);
        setProgressPercent(100);
      } catch (err: any) {
        setErrorMessage(`Prediction processing error: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  const handleReRunPrediction = () => {
    if (parsedData && columnMapping && file) {
      runBatchPrediction(parsedData.rawRows, columnMapping, file);
    }
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    if (columnMapping) {
      setColumnMapping({
        ...columnMapping,
        [field]: value,
      });
    }
  };

  const handleResetUpload = () => {
    setFile(null);
    setParsedData(null);
    setColumnMapping(null);
    setBatchResults(null);
    setBatchSummary(null);
    setErrorMessage(null);
    setSelectedResultForFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered table rows
  const filteredResults = (batchResults || []).filter((r) => {
    if (riskFilter !== 'ALL' && r.riskSegment !== riskFilter) {
      return false;
    }
    if (strategyFilter === 'WITH_STRATEGY' && !r.marketingStrategy) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.customerId.toLowerCase().includes(q);
      const matchStrategy = (r.marketingStrategy || '').toLowerCase().includes(q);
      const matchRec = r.recommendedStrategy.toLowerCase().includes(q);
      return matchId || matchStrategy || matchRec;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-3">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Customer Base Batch Prediction & Strategy Feedback</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Excel / CSV Customer Base Upload
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Upload your customer base spreadsheet (any Excel format or CSV). CustomerIQ will automatically detect columns, compute behavioral recency-to-interval ratios, predict churn likelihood across your customer base, and evaluate your planned marketing strategies against 10 real-world retention case studies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-download-sample-template"
              type="button"
              onClick={generateSampleExcelTemplate}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-indigo-400" />
              <span>Download Excel Template (.xlsx)</span>
            </button>

            {batchResults && (
              <button
                id="btn-export-predictions"
                type="button"
                onClick={() => exportBatchPredictionsToExcel(batchResults, file?.name)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Export Analyzed Results (.xlsx)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Dropzone Section */}
      {!batchResults && (
        <div
          id="excel-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer rounded-2xl border-2 border-dashed border-white/20 bg-slate-900/40 p-10 text-center hover:border-indigo-500/60 hover:bg-slate-900/60 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:scale-105 transition-transform">
            <Upload className="h-8 w-8" />
          </div>

          <h3 className="mt-4 text-base sm:text-lg font-bold text-white">
            Click to browse or drag & drop your Excel or CSV customer file
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Supports <span className="text-white font-mono">.xlsx</span>,{' '}
            <span className="text-white font-mono">.xls</span>, and{' '}
            <span className="text-white font-mono">.csv</span> with any customer column names.
          </p>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400">
            <span className="rounded-md border border-white/10 bg-slate-800/80 px-2.5 py-1">
              ✓ Frequency & Spend
            </span>
            <span className="rounded-md border border-white/10 bg-slate-800/80 px-2.5 py-1">
              ✓ Recency & Interval
            </span>
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold px-2.5 py-1">
              ★ Marketing Strategy Column Supported
            </span>
          </div>
        </div>
      )}

      {/* Loading / Progress State */}
      {isProcessing && (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-semibold">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Analyzing customer base and predicting churn risks...</span>
          </div>
          <div className="h-2 w-full max-w-md mx-auto rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm text-rose-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">File Error:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Column Mapping & File Header Card (When file is parsed) */}
      {parsedData && columnMapping && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {file?.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {parsedData.rawRows.length} customer records parsed across{' '}
                  {parsedData.headers.length} spreadsheet columns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMappingOpen(!isMappingOpen)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                <span>{isMappingOpen ? 'Hide Column Mapping' : 'Inspect Column Mapping'}</span>
                {isMappingOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleResetUpload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <span>Upload Different File</span>
              </button>
            </div>
          </div>

          {/* Expandable Column Mapper */}
          {isMappingOpen && (
            <div className="pt-2 space-y-4">
              <div className="text-xs text-slate-300 flex items-center justify-between">
                <span>
                  Adjust how CustomerIQ maps your spreadsheet columns. Derived fallbacks are applied for missing fields.
                </span>
                <button
                  type="button"
                  onClick={handleReRunPrediction}
                  className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Re-run Analysis with New Mapping</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Customer ID */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Customer ID Column
                  </label>
                  <select
                    value={columnMapping.customerId}
                    onChange={(e) => handleMappingChange('customerId', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Auto-generate IDs --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Frequency / Orders *
                  </label>
                  <select
                    value={columnMapping.frequency}
                    onChange={(e) => handleMappingChange('frequency', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- None (Default: 1) --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monetary */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Monetary / Spend ($) *
                  </label>
                  <select
                    value={columnMapping.monetary}
                    onChange={(e) => handleMappingChange('monetary', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- None (Default: $150) --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recency */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Recency (Days Inactive) *
                  </label>
                  <select
                    value={columnMapping.recency}
                    onChange={(e) => handleMappingChange('recency', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- None (Default: 30) --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lifespan */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Customer Lifespan (Days)
                  </label>
                  <select
                    value={columnMapping.customerLifespan}
                    onChange={(e) => handleMappingChange('customerLifespan', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Derived: max(recency, freq*30) --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Avg Interval */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Avg. Purchase Interval (Days)
                  </label>
                  <select
                    value={columnMapping.avgPurchaseInterval}
                    onChange={(e) => handleMappingChange('avgPurchaseInterval', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Derived: lifespan / frequency --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Median Interval */}
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">
                    Median Purchase Interval
                  </label>
                  <select
                    value={columnMapping.medianPurchaseInterval}
                    onChange={(e) => handleMappingChange('medianPurchaseInterval', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Derived: same as average --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marketing Strategy (The new feature in Excel) */}
                <div className="bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/30">
                  <label className="font-semibold text-indigo-300 block mb-1">
                    Marketing Strategy (Optional Feature)
                  </label>
                  <select
                    value={columnMapping.marketingStrategy}
                    onChange={(e) => handleMappingChange('marketingStrategy', e.target.value)}
                    className="w-full rounded-lg border border-indigo-500/40 bg-slate-800 px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-400 font-semibold"
                  >
                    <option value="">-- None in File --</option>
                    {parsedData.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Summary Metrics Dashboard */}
      {batchSummary && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Customers */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Analyzed Customer Base
                </span>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                {batchSummary.totalRows.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Processed from {batchSummary.fileName}
              </div>
            </div>

            {/* High Risk Customers */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                  High Churn Risk
                </span>
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-rose-200 font-mono flex items-baseline gap-2">
                <span>{batchSummary.highRiskCount.toLocaleString()}</span>
                <span className="text-xs text-rose-400 font-normal">
                  ({((batchSummary.highRiskCount / (batchSummary.totalRows || 1)) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="mt-1 text-xs text-rose-300/70">
                Probability ≥ 70% (Urgent action required)
              </div>
            </div>

            {/* Total Revenue Exposure */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Portfolio Revenue at Risk
                </span>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-amber-200 font-mono">
                ${batchSummary.totalRevenueExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-1 text-xs text-amber-300/70">
                Cumulative monetary value of at-risk base
              </div>
            </div>

            {/* Strategy Alignment Score */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/15 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Strategy Case Alignment
                </span>
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-white font-mono flex items-baseline gap-1">
                <span>{batchSummary.strategyMatchAverage}</span>
                <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <div className="mt-1 text-xs text-indigo-300/70">
                Empirically validated vs 10 case studies
              </div>
            </div>
          </div>

          {/* Risk Distribution Bar */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-300 gap-2">
              <span className="font-semibold uppercase tracking-wider text-slate-400">
                Cohort Risk Distribution
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span>High: {batchSummary.highRiskCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Medium: {batchSummary.mediumRiskCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Low: {batchSummary.lowRiskCount}</span>
                </span>
              </div>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all"
                style={{ width: `${(batchSummary.highRiskCount / (batchSummary.totalRows || 1)) * 100}%` }}
                title="High Risk"
              />
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${(batchSummary.mediumRiskCount / (batchSummary.totalRows || 1)) * 100}%` }}
                title="Medium Risk"
              />
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${(batchSummary.lowRiskCount / (batchSummary.totalRows || 1)) * 100}%` }}
                title="Low Risk"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Table Controls & Filtering */}
      {batchResults && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer ID, strategy, or recommendations..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter:</span>
              </span>

              <button
                type="button"
                onClick={() => setRiskFilter('ALL')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  riskFilter === 'ALL'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({batchResults.length})
              </button>

              <button
                type="button"
                onClick={() => setRiskFilter('HIGH')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  riskFilter === 'HIGH'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-950/20 text-rose-300 border border-rose-500/20 hover:bg-rose-950/40'
                }`}
              >
                High Risk ({batchSummary?.highRiskCount})
              </button>

              <button
                type="button"
                onClick={() => setRiskFilter('MEDIUM')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  riskFilter === 'MEDIUM'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-950/20 text-amber-300 border border-amber-500/20 hover:bg-amber-950/40'
                }`}
              >
                Medium Risk ({batchSummary?.mediumRiskCount})
              </button>

              <button
                type="button"
                onClick={() => setRiskFilter('LOW')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  riskFilter === 'LOW'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-950/40'
                }`}
              >
                Low Risk ({batchSummary?.lowRiskCount})
              </button>

              <button
                type="button"
                onClick={() =>
                  setStrategyFilter(strategyFilter === 'ALL' ? 'WITH_STRATEGY' : 'ALL')
                }
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer border ${
                  strategyFilter === 'WITH_STRATEGY'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-indigo-300 border-indigo-500/30 hover:bg-slate-700'
                }`}
              >
                ★ Has Strategy Column
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/60 text-slate-300 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Customer ID</th>
                    <th className="py-3.5 px-4">Churn Probability</th>
                    <th className="py-3.5 px-4">Risk Tier</th>
                    <th className="py-3.5 px-4">Spend Exposure</th>
                    <th className="py-3.5 px-4">Velocity (Recency / Interval)</th>
                    <th className="py-3.5 px-4">Strategy Feedback & Precedent</th>
                    <th className="py-3.5 px-4">Recommended Intervention</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No customers match the active filters or search term.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((row) => {
                      const probPercent = (row.churnProbability * 100).toFixed(1);
                      const isHigh = row.riskSegment === 'HIGH';
                      const isMed = row.riskSegment === 'MEDIUM';

                      return (
                        <tr
                          key={row.rowId}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Customer ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {row.customerId}
                          </td>

                          {/* Churn Probability */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  isHigh
                                    ? 'text-rose-400'
                                    : isMed
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {probPercent}%
                              </span>
                              <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                                <div
                                  className={`h-full ${
                                    isHigh
                                      ? 'bg-rose-500'
                                      : isMed
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${row.churnProbability * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Risk Segment */}
                          <td className="py-3.5 px-4">
                            <RiskBadge level={row.riskSegment} size="sm" />
                          </td>

                          {/* Spend Exposure */}
                          <td className="py-3.5 px-4 font-mono text-slate-200">
                            ${row.revenueExposure.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </td>

                          {/* Velocity */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                            <span>{row.recency}d inactive</span>
                            <span className="block text-slate-500">
                              (cadence ~{row.avgPurchaseInterval.toFixed(0)}d)
                            </span>
                          </td>

                          {/* Strategy Feedback */}
                          <td className="py-3.5 px-4 max-w-xs">
                            {row.strategyEvaluation ? (
                              <button
                                type="button"
                                onClick={() => setSelectedResultForFeedback(row)}
                                className="text-left group-hover:underline cursor-pointer"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full ${
                                      row.strategyEvaluation.score >= 75
                                        ? 'bg-emerald-400'
                                        : row.strategyEvaluation.score >= 55
                                        ? 'bg-amber-400'
                                        : 'bg-rose-400'
                                    }`}
                                  />
                                  <span className="font-semibold text-white">
                                    {row.strategyEvaluation.score}/100 Match
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 block truncate" title={row.marketingStrategy}>
                                  "{row.marketingStrategy}"
                                </span>
                                {row.matchingCaseStudyName && (
                                  <span className="text-[10px] text-indigo-400 block truncate">
                                    Case: {row.matchingCaseStudyName.split('&')[0]}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">
                                No strategy in file
                              </span>
                            )}
                          </td>

                          {/* Recommended Strategy */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="font-medium text-slate-200 block truncate" title={row.recommendedStrategy}>
                              {row.recommendedStrategy}
                            </span>
                            <span className="text-[11px] text-indigo-400 block">
                              Via: {row.recommendedChannel}
                            </span>
                          </td>

                          {/* Action button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => row.fullIntelligence && onInspectCustomer(row.fullIntelligence)}
                              className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-600/20 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                              title="Inspect full Customer Intelligence Dossier"
                            >
                              <span>Inspect Dossier</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Selected Customer Strategy Feedback Modal */}
      {selectedResultForFeedback && selectedResultForFeedback.strategyEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs uppercase font-semibold text-indigo-400">
                  Customer Intelligence Strategy Audit
                </span>
                <h3 className="text-lg font-bold text-white font-mono">
                  {selectedResultForFeedback.customerId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResultForFeedback(null)}
                className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <StrategyFeedbackCard
              evaluation={selectedResultForFeedback.strategyEvaluation}
              strategyName={selectedResultForFeedback.marketingStrategy}
              onExploreCaseStudy={(csId) => {
                setSelectedResultForFeedback(null);
                if (onNavigateToCaseStudies) {
                  onNavigateToCaseStudies(csId);
                }
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedResultForFeedback.fullIntelligence) {
                    onInspectCustomer(selectedResultForFeedback.fullIntelligence);
                  }
                  setSelectedResultForFeedback(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
              >
                <span>Open Full Customer Intelligence Dossier</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
