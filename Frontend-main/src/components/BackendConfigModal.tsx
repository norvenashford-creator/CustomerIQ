import React, { useState } from 'react';
import { X, Globe, CheckCircle2, AlertCircle, RefreshCw, Layers, ExternalLink } from 'lucide-react';
import { getStoredApiUrl, setStoredApiUrl } from '../api/client';
import { checkBackendHealth, inspectOpenApi, OpenApiRoute } from '../api/customerIQ';
import { ApiStatus } from '../types';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: ApiStatus;
  onStatusChange: (status: ApiStatus) => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  onStatusChange,
}) => {
  const [urlInput, setUrlInput] = useState(getStoredApiUrl() || '');
  const [isTesting, setIsTesting] = useState(false);
  const [routes, setRoutes] = useState<OpenApiRoute[] | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setRoutes(null);

    const clean = urlInput.trim().replace(/\/+$/, '');
    setStoredApiUrl(clean);

    const status = await checkBackendHealth();
    onStatusChange(status);

    if (status.connected) {
      setTestResult({
        success: true,
        message: `Successfully connected to FastAPI service (${status.version || 'healthy'})`,
      });

      // Introspect OpenAPI routes
      const openApiData = await inspectOpenApi();
      if (openApiData && openApiData.routes.length > 0) {
        setRoutes(openApiData.routes);
      }
    } else {
      setTestResult({
        success: false,
        message: status.error || 'Unable to connect to Railway FastAPI backend. Please verify URL and CORS settings.',
      });
    }

    setIsTesting(false);
  };

  const handleResetToEnv = async () => {
    const envUrl = import.meta.env.VITE_API_BASE_URL || '';
    setUrlInput(envUrl);
    setStoredApiUrl('');
    setIsTesting(true);
    const status = await checkBackendHealth();
    onStatusChange(status);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        id="backend-config-modal"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Backend API Connection
              </h3>
              <p className="text-xs text-slate-400">
                Railway FastAPI service integration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Current Status Pill */}
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/40 p-3.5">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  apiStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Status:
              </span>
              <span
                className={`text-xs font-bold ${
                  apiStatus.connected ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {apiStatus.connected ? 'API Connected' : 'API Offline'}
              </span>
            </div>

            {apiStatus.version && (
              <span className="text-xs text-slate-400 font-mono">
                {apiStatus.version}
              </span>
            )}
          </div>

          {/* URL Input */}
          <div>
            <label
              htmlFor="api-url-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Railway Public FastAPI Base URL
            </label>
            <div className="relative">
              <input
                id="api-url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-service.up.railway.app"
                className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Enter your live Railway deployment URL. CustomerIQ will test health endpoints (<code className="text-slate-300">/health</code>, <code className="text-slate-300">/docs</code>, <code className="text-slate-300">/openapi.json</code>).
            </p>
          </div>

          {/* Test Result alert */}
          {testResult && (
            <div
              className={`rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <p className="leading-relaxed font-medium">{testResult.message}</p>
            </div>
          )}

          {/* Detected OpenAPI endpoints if available */}
          {routes && routes.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-slate-800/30 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2.5">
                <Layers className="h-3.5 w-3.5" />
                <span>Discovered FastAPI Endpoints ({routes.length})</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {routes.map((route, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60 font-mono"
                  >
                    <span className="text-indigo-300">{route.path}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                      {route.method}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-slate-900/90">
          <button
            type="button"
            onClick={handleResetToEnv}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Reset to default
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {isTesting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isTesting ? 'Testing...' : 'Save & Test API'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
