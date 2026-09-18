import React from 'react';
import { WorkspaceTab } from '../types';

interface SidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  latencyMs: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  latencyMs,
  isOpenMobile,
  onCloseMobile
}) => {
  const navigationItems: { id: WorkspaceTab; label: string; icon: string; badge?: string }[] = [
    { id: 'simulation-console', label: '3D Simulation Console', icon: 'view_in_ar' },
    { id: 'optics-telemetry', label: 'Optics & Telemetry', icon: 'monitoring' },
    { id: 'reagent-carousel', label: 'Reagent Carousel Hub', icon: 'science', badge: '80 pos' },
    { id: 'sample-pipetting-kinematics', label: 'Pipetting Kinematics', icon: 'precision_manufacturing' },
    { id: 'photometric-calibration', label: 'Photometric Calibration', icon: 'tune' },
    { id: 'diagnostic-batch-queue', label: 'Diagnostic Batch Queue', icon: 'playlist_play', badge: 'STAT' },
    { id: 'subsystem-diagnostics', label: 'Subsystem Diagnostics', icon: 'vital_signs' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-[#f2f4f6] border-r border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex flex-col justify-between py-4 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="px-5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono-code">
              Simulation Workspaces
            </span>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="px-3 flex flex-col gap-1">
            {navigationItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left text-xs font-semibold ${
                    isActive
                      ? 'bg-[#00629b] text-white shadow-[0_1px_3px_rgba(0,98,155,0.25)]'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hardware & Cloud Telemetry */}
        <div className="px-4 flex flex-col gap-2.5">
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-code mb-1">
              <span>CORE LATENCY</span>
              <span className="text-[#004976] font-bold">{latencyMs.toFixed(1)}ms</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/6 h-full bg-[#00677d]"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono-code px-1">
            <span>DIRUI CLOUD v4.8.2</span>
            <span className="material-symbols-outlined text-[16px] text-[#00677d]">cloud_done</span>
          </div>
        </div>
      </aside>
    </>
  );
};
