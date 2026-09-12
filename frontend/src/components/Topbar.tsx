import React from 'react';
import { Menu, RefreshCw, Settings, ShieldCheck, Globe, Wifi, WifiOff } from 'lucide-react';
import { ApiStatus } from '../types';

interface TopbarProps {
  apiStatus: ApiStatus;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenConfig: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  apiStatus,
  onRefresh,
  isRefreshing,
  onOpenConfig,
  onToggleMobileMenu,
}) => {
  return (
    <header
      id="customeriq-topbar"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#090d16]/80 px-4 sm:px-8 backdrop-blur-md"
    >
      {/* Left: Mobile trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">
              CustomerIQ
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Retention Intelligence Platform
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Turn customer behavior into retention action.
          </p>
        </div>
      </div>

      {/* Right: API Status, Refresh, Version */}
      <div className="flex items-center gap-3">
        {/* Real API Connection Status Badge */}
        <button
          id="topbar-api-status-btn"
          type="button"
          onClick={onOpenConfig}
          className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
            apiStatus.connected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
          }`}
          title="Click to configure backend connection"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`}
          />
          <span>{apiStatus.connected ? 'API Connected' : 'API Offline'}</span>
        </button>

        {/* Refresh API Health button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh connection & telemetry"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Version Indicator */}
        <div className="hidden md:flex items-center gap-1 rounded-md border border-white/5 bg-slate-800/40 px-2 py-1 text-[11px] font-mono text-slate-400">
          <span>v1.2-ml</span>
        </div>
      </div>
    </header>
  );
};
