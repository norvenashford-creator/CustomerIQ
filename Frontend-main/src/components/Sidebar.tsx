import React from 'react';
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  Info,
  Sparkles,
  Wifi,
  WifiOff,
  Settings,
  ChevronRight,
  BrainCircuit,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';
import { ActiveTab, ApiStatus } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  apiStatus: ApiStatus;
  onOpenConfig: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  apiStatus,
  onOpenConfig,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'batch_upload',
      label: 'Upload Customer Base',
      icon: FileSpreadsheet,
      badge: 'Excel/CSV',
    },
    { id: 'intelligence', label: 'Customer Intelligence', icon: Users },
    {
      id: 'case_studies',
      label: 'Strategy & Case Studies',
      icon: BookOpen,
      badge: '10 Cases',
    },
    { id: 'recommendations', label: 'Retention Playbook', icon: Lightbulb },
    { id: 'about', label: 'About CustomerIQ', icon: Info },
  ];

  const handleNav = (tab: ActiveTab) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="customeriq-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-white/10 bg-[#0c101a] p-5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Subtitle */}
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-600/25">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  CustomerIQ
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-indigo-300">
                  Customer Retention Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 border border-indigo-500/30 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="border-t border-white/10 pt-5 space-y-3">
          {/* Bottom Branding */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-slate-300">
              ML-powered retention intelligence
            </span>
          </div>

          {/* Real API Status Indicator */}
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 p-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus.connected
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span
                id="sidebar-api-status"
                className={`text-xs font-semibold ${
                  apiStatus.connected ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {apiStatus.connected ? 'API Connected' : 'API Offline'}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenConfig}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="Configure API connection"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
