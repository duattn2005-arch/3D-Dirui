import React, { useState } from 'react';
import { MachinePartViewer } from './MachinePartViewer';

export const PipettingWorkspace: React.FC = () => {
  const [aspirateVolume, setAspirateVolume] = useState<number>(15.0);
  const [probeDepthMm, setProbeDepthMm] = useState<number>(2.5);
  const [mixerSpeedRpm, setMixerSpeedRpm] = useState<number>(2800);
  const [lldSensitivity, setLldSensitivity] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [isTestCycleRunning, setIsTestCycleRunning] = useState(false);
  const [cycleLog, setCycleLog] = useState<string[]>([
    '[10:48:10] Hệ thống khởi động chuẩn vị trí Home X=0.00, Y=0.00, Z=0.00',
    '[10:48:12] Cảm biến LLD xác định mức mặt thoáng chất lỏng tại Z=-18.42mm',
    '[10:48:13] Bơm piston phân phối thể tích 15.0 μL thuốc thử R1 vào cuvette #42',
    '[10:48:14] Cánh khuấy Teflon khởi động 2800 RPM trong 1.5 giây tạo dòng xoáy',
    '[10:48:16] Trạm rửa kim tự động áp lực âm hoàn tất chu trình tráng rửa'
  ]);

  const handleRunKinematicsTest = () => {
    setIsTestCycleRunning(true);
    const newLog = `[${new Date().toLocaleTimeString()}] Kiểm tra động học kim hút thể tích ${aspirateVolume.toFixed(
      1
    )} μL | LLD độ sâu ${probeDepthMm}mm | Tốc độ khuấy ${mixerSpeedRpm} RPM: THÀNH CÔNG (Sai số <0.1%)`;

    setTimeout(() => {
      setCycleLog(prev => [newLog, ...prev.slice(0, 9)]);
      setIsTestCycleRunning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              Động Học Robot Hút Mẫu
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Tri-axial Precision Servo Micro-Pipetting</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Động Học Kim Hút Mẫu Kép &amp; Cánh Khuấy Xoắn Ốc Teflon
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cụm kim hút phân giải siêu vi 0.1 μL kết hợp cảm biến điện dung phát hiện bọt khí và cơ chế chống va chạm đa hướng.
          </p>
        </div>

        <button
          onClick={handleRunKinematicsTest}
          disabled={isTestCycleRunning}
          className="px-4 py-2 bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all disabled:opacity-60"
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isTestCycleRunning ? 'animate-spin' : ''}`}>
            {isTestCycleRunning ? 'autorenew' : 'precision_manufacturing'}
          </span>
          <span>{isTestCycleRunning ? 'Đang Thực Thi Chu Trình Thử...' : 'Chạy Thử Chu Trình Hút & Khuấy'}</span>
        </button>
      </div>

      {/* 3D Visualization of the probe arm, Teflon mixer & wash well */}
      <MachinePartViewer
        part="pipetting"
        title="DIRUI CS-T240"
        subtitle="Kim hút mẫu/thuốc thử tích hợp LLD, cánh khuấy Teflon motor cốc rỗng & giếng rửa kim xoáy"
      />

      {/* Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Pipetting Volume Control */}
        <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#004976]">
            <span className="material-symbols-outlined text-[22px]">colorize</span>
            <h3 className="text-sm font-bold text-slate-900">Thể Tích Hút Micropipette (0.1 μL)</h3>
          </div>
          <p className="text-xs text-slate-600">
            Hệ thống bơm tiêm gốm vi lượng có độ chính xác tuyệt đối, dải hút từ 2.0 μL đến 45.0 μL.
          </p>

          <div className="flex flex-col gap-2 font-mono-code">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Thể tích cài đặt:</span>
              <span className="font-bold text-[#004976] text-sm">{aspirateVolume.toFixed(1)} μL</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="45.0"
              step="0.1"
              value={aspirateVolume}
              onChange={e => setAspirateVolume(parseFloat(e.target.value))}
              className="w-full accent-[#004976] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Min: 2.0 μL</span>
              <span>Max: 45.0 μL</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono-code border border-slate-100 flex justify-between">
            <span className="text-slate-500">Độ lệch thể tích CV%:</span>
            <span className="font-bold text-emerald-600">&lt; 0.75% (Chuẩn Quốc Tế)</span>
          </div>
        </div>

        {/* Card 2: LLD & Collision Protection */}
        <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#00677d]">
            <span className="material-symbols-outlined text-[22px]">sensors</span>
            <h3 className="text-sm font-bold text-slate-900">Cảm Biến Mức Lỏng &amp; Va Chạm (LLD)</h3>
          </div>
          <p className="text-xs text-slate-600">
            Cảm biến điện dung nano tự động nhận diện bề mặt dịch, tự động điều chỉnh độ ngập kim để tránh bọt khí.
          </p>

          <div className="flex flex-col gap-2 font-mono-code">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Độ ngập kim tối ưu:</span>
              <span className="font-bold text-[#00677d] text-sm">{probeDepthMm.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={probeDepthMm}
              onChange={e => setProbeDepthMm(parseFloat(e.target.value))}
              className="w-full accent-[#00677d] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Nông: 1.0 mm</span>
              <span>Sâu: 5.0 mm</span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono-code text-xs">
            <span className="text-slate-500">Độ nhạy LLD:</span>
            <div className="flex gap-1">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(sens => (
                <button
                  key={sens}
                  onClick={() => setLldSensitivity(sens)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    lldSensitivity === sens
                      ? 'bg-[#00677d] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                  type="button"
                >
                  {sens}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Teflon Mixer Speed */}
        <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#00629b]">
            <span className="material-symbols-outlined text-[22px]">rotate_right</span>
            <h3 className="text-sm font-bold text-slate-900">Cánh Khuấy Xoắn Ốc Teflon Tốc Độ Cao</h3>
          </div>
          <p className="text-xs text-slate-600">
            Tạo dòng xoáy phản ứng đồng nhất tuyệt đối trong 1.5 giây mà không làm vỡ hồng cầu hay sinh bọt micro.
          </p>

          <div className="flex flex-col gap-2 font-mono-code">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tốc độ quay:</span>
              <span className="font-bold text-[#00629b] text-sm">{mixerSpeedRpm} RPM</span>
            </div>
            <input
              type="range"
              min="1500"
              max="3600"
              step="100"
              value={mixerSpeedRpm}
              onChange={e => setMixerSpeedRpm(parseInt(e.target.value))}
              className="w-full accent-[#00629b] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1500 RPM</span>
              <span>3600 RPM</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono-code border border-slate-100 flex justify-between">
            <span className="text-slate-500">Thời gian tạo xoáy:</span>
            <span className="font-bold text-slate-900">1.50 giây / test</span>
          </div>
        </div>
      </div>

      {/* Kinematics Execution Log */}
      <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-3 font-mono-code">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase">
            Nhật Ký Chuyển Động Servo &amp; Chu Trình Bơm Rửa Thực Tế
          </h3>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Servo Motors Đồng Bộ Tốt
          </span>
        </div>

        <div className="p-3 bg-slate-950 text-slate-300 rounded-lg text-xs flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          {cycleLog.map((log, i) => (
            <div key={i} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
