import React from 'react';
import { MachineModelId, SystemStatus } from '../types';

interface HeaderProps {
  activeModel: MachineModelId;
  onSelectModel: (model: MachineModelId) => void;
  systemStatus: SystemStatus;
  onToggleRun: () => void;
  onEmergencyStop: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModel,
  onSelectModel,
  systemStatus,
  onToggleRun,
  onEmergencyStop,
  isAudioOn,
  onToggleAudio,
  onToggleMobileSidebar
}) => {
  const models: { id: MachineModelId; label: string }[] = [
    { id: 'CS-T240', label: 'CS-T240' },
    { id: 'CS-6400', label: 'CS-6400 Modular' },
    { id: 'FUS-2000', label: 'FUS-2000 Urinalysis' },
    { id: 'H-800', label: 'H-800 Auto-Urine' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.04)] h-16">
      <div className="h-full w-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Model Switcher */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile hamburger button */}
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            title="Menu"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#004976] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg tracking-tight">D</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#004976] text-base tracking-tight">DIRUI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-1.5 py-0.5 rounded">
                  Medical 3D
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono-code leading-none">
                Diagnostic Simulation Platform
              </p>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden lg:block"></div>

          {/* Model Switcher Pills */}
          <div className="hidden xl:flex items-center bg-[#f1f4f6] p-1 rounded-lg gap-1 border border-slate-200/60">
            {models.map(m => {
              const isActive = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#00629b] text-white shadow-[0_1px_3px_rgba(0,98,155,0.25)]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  type="button"
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#50d9fe] animate-pulse"></span>}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Status HUD & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f1f4f6] rounded-lg border border-slate-200/60">
            <div
              className={`w-2.5 h-2.5 rounded-full ring-2 ${
                systemStatus.state === 'RUNNING'
                  ? 'bg-[#00677d] ring-[#b3ebff] animate-pulse'
                  : systemStatus.state === 'STOPPED'
                  ? 'bg-red-500 ring-red-200'
                  : 'bg-amber-500 ring-amber-200'
              }`}
            ></div>
            <span className="text-[11px] uppercase text-slate-500 font-semibold font-mono-code">Status:</span>
            <span
              className={`text-xs font-bold font-mono-code ${
                systemStatus.state === 'RUNNING'
                  ? 'text-[#00677d]'
                  : systemStatus.state === 'STOPPED'
                  ? 'text-red-600'
                  : 'text-amber-600'
              }`}
            >
              {systemStatus.state === 'RUNNING'
                ? 'ONLINE / CALIBRATED'
                : systemStatus.state === 'STOPPED'
                ? 'HALTED / E-STOP'
                : 'STANDBY'}
            </span>
          </div>

          {/* Audio Feedback Button */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg transition-colors ${
              isAudioOn
                ? 'text-[#00629b] bg-sky-50 hover:bg-sky-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isAudioOn ? 'Tắt âm thanh phản hồi' : 'Bật âm thanh phản hồi xét nghiệm'}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAudioOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Run Test Button */}
          <button
            onClick={onToggleRun}
            className={`px-3.5 py-1.5 font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm transition-all ${
              systemStatus.state === 'RUNNING'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#00629b] hover:bg-[#004976] text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {systemStatus.state === 'RUNNING' ? 'pause' : 'play_arrow'}
            </span>
            <span className="hidden sm:inline">
              {systemStatus.state === 'RUNNING' ? 'PAUSE TEST' : 'RUN TEST'}
            </span>
          </button>

          {/* Emergency Stop Button */}
          <button
            onClick={onEmergencyStop}
            className="px-3.5 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-[0_0_0_1px_rgba(186,26,26,0.3)] transition-colors"
            title="Dừng khẩn cấp toàn bộ động cơ & kim hút"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span className="hidden sm:inline">E-STOP</span>
          </button>

          <div className="h-7 w-px bg-slate-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-[#004976] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden 2xl:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-none">Tech. L. Vance</div>
              <div className="text-[11px] text-slate-500 font-mono-code leading-tight">Clinical Ops Tier 3</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
