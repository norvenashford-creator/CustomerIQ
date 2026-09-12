import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Settings2, FileQuestion } from 'lucide-react';
import { ApiError } from '../api/client';

interface ErrorStateProps {
  error: Error | ApiError | string;
  onRetry: () => void;
  onOpenSettings?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onOpenSettings,
}) => {
  let message = 'Something went wrong while analyzing this customer.';
  let kind: 'offline' | 'validation' | 'not_found' | 'server' | 'unknown' = 'unknown';

  if (error instanceof ApiError) {
    message = error.message;
    kind = error.kind;
  } else if (typeof error === 'string') {
    message = error;
    if (error.includes('unavailable')) kind = 'offline';
    else if (error.includes('check the customer')) kind = 'validation';
    else if (error.includes('not found')) kind = 'not_found';
  } else if (error && error.message) {
    message = error.message;
  }

  // Ensure no raw Python traces leak
  if (message.includes('Traceback') || message.includes('File "/') || message.includes('Internal Server Error')) {
    message = 'Something went wrong while analyzing this customer.';
    kind = 'server';
  }

  const isOffline = kind === 'offline';
  const isNotFound = kind === 'not_found';

  return (
    <div
      id="customeriq-error-state"
      className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
        {isOffline ? (
          <WifiOff className="h-7 w-7" />
        ) : isNotFound ? (
          <FileQuestion className="h-7 w-7" />
        ) : (
          <AlertTriangle className="h-7 w-7" />
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">
        Analysis Request Unsuccessful
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-rose-200/90 leading-relaxed font-medium">
        {message}
      </p>

      {isOffline && (
        <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
          Ensure the Railway FastAPI service is active and the API base URL is set correctly in settings or environment variables.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Settings2 className="h-4 w-4" />
            <span>Configure Backend URL</span>
          </button>
        )}
      </div>
    </div>
  );
};
