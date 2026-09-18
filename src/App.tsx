import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConsoleWorkspace } from './components/ConsoleWorkspace';
import { OpticsWorkspace } from './components/OpticsWorkspace';
import { ReagentCarouselWorkspace } from './components/ReagentCarouselWorkspace';
import { PipettingWorkspace } from './components/PipettingWorkspace';
import { CalibrationWorkspace } from './components/CalibrationWorkspace';
import { BatchQueueWorkspace } from './components/BatchQueueWorkspace';
import { SubsystemWorkspace } from './components/SubsystemWorkspace';
import { PdfManualModal } from './components/PdfManualModal';
import { EmergencyStopModal } from './components/EmergencyStopModal';
import { WorkspaceTab, MachineModelId, SystemStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('simulation-console');
  const [activeModel, setActiveModel] = useState<MachineModelId>('CS-T240');
  const [isHoodOpen, setIsHoodOpen] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isEStopModalOpen, setIsEStopModalOpen] = useState(false);

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    state: 'RUNNING',
    temperature: 37.0,
    tempVariance: 0.1,
    throughput: '240 T/H (400 ISE)',
    washFluidPercent: 84.5,
    lisConnected: true,
    firmware: 'v3.19.4',
    latencyMs: 1.2
  });

  // Sound feedback helper using Web Audio API
  const playDiagnosticBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!isAudioOn) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const handleToggleRun = () => {
    playDiagnosticBeep(520, 'sine', 0.1);
    setSystemStatus(prev => ({
      ...prev,
      state: prev.state === 'RUNNING' ? 'STANDBY' : 'RUNNING'
    }));
  };

  const handleEmergencyStop = () => {
    playDiagnosticBeep(220, 'sawtooth', 0.3);
    setSystemStatus(prev => ({
      ...prev,
      state: 'STOPPED'
    }));
    setIsEStopModalOpen(true);
  };

  const handleResetEStop = () => {
    playDiagnosticBeep(660, 'sine', 0.15);
    setSystemStatus(prev => ({
      ...prev,
      state: 'RUNNING'
    }));
    setIsEStopModalOpen(false);
  };

  const handleToggleHood = () => {
    playDiagnosticBeep(440, 'triangle', 0.06);
    setIsHoodOpen(prev => !prev);
  };

  const handleSelectModel = (model: MachineModelId) => {
    playDiagnosticBeep(700, 'sine', 0.06);
    setActiveModel(model);
  };

  const handleSelectTab = (tab: WorkspaceTab) => {
    playDiagnosticBeep(600, 'sine', 0.05);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#cee5ff] selection:text-[#001d33]">
      {/* Fixed Top Header */}
      <Header
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
        systemStatus={systemStatus}
        onToggleRun={handleToggleRun}
        onEmergencyStop={handleEmergencyStop}
        isAudioOn={isAudioOn}
        onToggleAudio={() => setIsAudioOn(prev => !prev)}
        onToggleMobileSidebar={() => setIsOpenMobileSidebar(prev => !prev)}
      />

      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        latencyMs={systemStatus.latencyMs}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col pt-16">
        <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'simulation-console' && (
            <ConsoleWorkspace
              activeModel={activeModel}
              onSelectModel={handleSelectModel}
              systemStatus={systemStatus}
              isHoodOpen={isHoodOpen}
              onToggleHood={handleToggleHood}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              isSystemRunning={systemStatus.state === 'RUNNING'}
            />
          )}

          {activeTab === 'optics-telemetry' && <OpticsWorkspace />}

          {activeTab === 'reagent-carousel' && <ReagentCarouselWorkspace />}

          {activeTab === 'sample-pipetting-kinematics' && <PipettingWorkspace />}

          {activeTab === 'photometric-calibration' && <CalibrationWorkspace />}

          {activeTab === 'diagnostic-batch-queue' && <BatchQueueWorkspace />}

          {activeTab === 'subsystem-diagnostics' && <SubsystemWorkspace />}
        </main>
      </div>

      {/* Technical Manual & Download PDF Modal */}
      <PdfManualModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        activeModel={activeModel}
      />

      {/* Emergency Stop E-STOP Modal */}
      <EmergencyStopModal
        isOpen={isEStopModalOpen}
        onReset={handleResetEStop}
        onClose={() => setIsEStopModalOpen(false)}
      />
    </div>
  );
}
