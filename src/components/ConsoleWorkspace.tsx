import React, { useState, useRef } from 'react';
import { ThreeMachineViewer, ThreeMachineViewerRef } from './ThreeMachineViewer';
import { MACHINE_MODELS, INITIAL_ASSAYS } from '../data/mockData';
import { CameraPreset, MachineModelId, SystemStatus } from '../types';

interface ConsoleWorkspaceProps {
  activeModel: MachineModelId;
  onSelectModel: (model: MachineModelId) => void;
  systemStatus: SystemStatus;
  isHoodOpen: boolean;
  onToggleHood: () => void;
  onOpenPdfModal: () => void;
  isSystemRunning: boolean;
}

export const ConsoleWorkspace: React.FC<ConsoleWorkspaceProps> = ({
  activeModel,
  onSelectModel,
  systemStatus,
  isHoodOpen,
  onToggleHood,
  onOpenPdfModal,
  isSystemRunning
}) => {
  const viewerRef = useRef<ThreeMachineViewerRef>(null);
  const [activeViewPreset, setActiveViewPreset] = useState<CameraPreset>('reset');
  const [cameraAlignmentStatus, setCameraAlignmentStatus] = useState<'locked' | 'realigning'>('locked');

  const handleResetView = () => {
    setCameraAlignmentStatus('realigning');
    setActiveViewPreset('reset');
    viewerRef.current?.resetView();
    setTimeout(() => setCameraAlignmentStatus('locked'), 450);
  };

  const handleTopView = () => {
    setCameraAlignmentStatus('realigning');
    setActiveViewPreset('top');
    viewerRef.current?.setTopView();
    setTimeout(() => setCameraAlignmentStatus('locked'), 450);
  };

  const handleSideView = () => {
    setCameraAlignmentStatus('realigning');
    setActiveViewPreset('side');
    viewerRef.current?.setSideView();
    setTimeout(() => setCameraAlignmentStatus('locked'), 450);
  };

  const handleRecenterCanvas = () => {
    setCameraAlignmentStatus('realigning');
    viewerRef.current?.recenterTarget();
    setTimeout(() => setCameraAlignmentStatus('locked'), 450);
  };

  const [selectedWavelength, setSelectedWavelength] = useState<number>(505);

  // Absorption curve data profiles for each wavelength
  const wavelengthCurves: Record<number, { title: string; endAbs: string; pathD: string; corrD: string }> = {
    505: {
      title: 'Phân tích động học Glucose GOD-PAP ở bước sóng chính 505 nm (Phụ 700 nm)',
      endAbs: '1.284 Abs @ t=480s',
      pathD: 'M 0 105 Q 120 80, 240 40 T 500 28',
      corrD: 'M 0 100 Q 150 70, 300 35 T 500 20 L 500 50 L 300 65 L 0 115 Z'
    },
    340: {
      title: 'Phân tích động học Enzymatic ALT/AST (NADH giảm hấp thụ UV ở 340 nm)',
      endAbs: '0.420 Abs @ t=480s',
      pathD: 'M 0 35 Q 140 50, 260 85 T 500 102',
      corrD: 'M 0 25 Q 140 40, 260 75 T 500 90 L 500 115 L 260 100 L 0 50 Z'
    },
    405: {
      title: 'Phân tích Phosphatase Kiềm (ALP p-Nitrophenol ở 405 nm)',
      endAbs: '0.915 Abs @ t=480s',
      pathD: 'M 0 110 Q 150 75, 280 48 T 500 32',
      corrD: 'M 0 105 Q 150 70, 280 40 T 500 25 L 500 55 L 280 65 L 0 115 Z'
    },
    700: {
      title: 'Đo nền quang phổ bù trừ sai số quang học bước sóng phụ 700 nm',
      endAbs: '0.106 Abs @ t=480s',
      pathD: 'M 0 112 Q 150 110, 300 108 T 500 106',
      corrD: 'M 0 108 Q 150 106, 300 104 T 500 102 L 500 112 L 300 112 L 0 115 Z'
    }
  };

  const activeCurve = wavelengthCurves[selectedWavelength] || wavelengthCurves[505];

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Telemetry Ribbon & Status HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          {/* Status badge */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50d9fe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00677d]"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-mono-code">Trạng Thái Hệ Thống</span>
              <span className="text-xs md:text-sm text-[#004976] font-bold">
                {isSystemRunning ? 'ĐANG CHẠY PHÂN TÍCH (RUN)' : 'TẠM DỪNG / CHỜ LỆNH (PAUSED)'}
              </span>
            </div>
          </div>

          {/* Reaction incubator temp */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00677d] text-[22px]">thermostat</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-mono-code">Buồng Ủ Phản Ứng</span>
              <span className="text-sm md:text-base font-bold text-slate-800 font-mono-code">
                37.0<span className="text-slate-500 text-xs font-normal">°C ±0.1°C</span>
              </span>
            </div>
          </div>

          {/* Throughput */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00677d] text-[22px]">speed</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-mono-code">Tốc Độ Thử Nghiệm</span>
              <span className="text-sm md:text-base font-bold text-slate-800 font-mono-code">
                240 <span className="text-slate-500 text-xs font-normal">T/H (400 ISE)</span>
              </span>
            </div>
          </div>

          {/* Wash fluid */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00677d] text-[22px]">water_drop</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-mono-code">Dung dịch rửa Cuvette</span>
              <span className="text-sm md:text-base font-bold text-[#00677d] font-mono-code">
                84.5<span className="text-slate-500 text-xs font-normal">% (Chuẩn)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-[#b3ebff]/50 text-[#001f27] px-2.5 py-1 rounded font-medium font-mono-code">
            KẾT NỐI LIS/HIS: KHẢ DỤNG
          </span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-mono-code">
            FIRMWARE: v3.19.4
          </span>
        </div>
      </div>

      {/* SECTION 1: 3D Simulation Hero Viewport */}
      <div className="relative w-full rounded-2xl">
        <ThreeMachineViewer
          ref={viewerRef}
          modelId={activeModel}
          isHoodOpen={isHoodOpen}
          onToggleHood={onToggleHood}
          isSystemRunning={isSystemRunning}
          onCameraChange={(preset) => setActiveViewPreset(preset)}
          activePreset={activeViewPreset}
        />
      </div>

      {/* SECTION 1.5: Detailed System Architecture & Hardware Modules (5 Core Modules) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-semibold font-mono-code">
                Cấu Tạo Kỹ Thuật Độc Quyền
              </span>
              <span className="text-xs text-slate-500 font-mono-code">| Dirui Precision Engineering</span>
            </div>
            <h2 className="text-xl md:text-2xl text-[#004976] font-bold mt-1">
              5 Phân Hệ Phần Cứng Cốt Lõi Trên Dirui CS-T240
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            Thiết kế đồng bộ hóa cao cấp mang lại độ nhạy phân tích vượt trội, giảm thiểu lượng tiêu hao hóa chất và nâng cao độ an toàn sinh học.
          </p>
        </div>

        {/* 5 Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Module 1: Peltier Reagent */}
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#004976]/10 text-[#004976] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[22px]">ac_unit</span>
              </div>
              <span className="text-[11px] uppercase text-[#00677d] font-bold font-mono-code">Làm Mát 2°C - 8°C</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">Khay Hóa Chất &amp; Mẫu Peltier (80 Vị Trí)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống làm lạnh bán dẫn Peltier 24/7 duy trì bảo quản ổn định thuốc thử R1, R2 và mẫu bệnh phẩm STAT liên tục không gián đoạn.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-mono-code text-slate-500 flex justify-between">
              <span>Dung tích lọ:</span>
              <span className="font-bold text-[#004976]">20ml / 50ml / 70ml</span>
            </div>
          </div>

          {/* Module 2: Dual Collision Probes */}
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#00677d]/10 text-[#00677d] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
              </div>
              <span className="text-[11px] uppercase text-[#00677d] font-bold font-mono-code">Cảm Ứng Mức Lỏng 3D</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">Kim Hút Kép Chống Va Chạm Đa Chiều</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kim hút R1/R2 &amp; Sample Probe tráng nano siêu mịn, tích hợp cảm biến điện dung phát hiện bọt khí, bảo vệ va chạm dọc/ngang đa hướng.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-mono-code text-slate-500 flex justify-between">
              <span>Độ chính xác hút:</span>
              <span className="font-bold text-[#004976]">0.1 μL (Bước chia)</span>
            </div>
          </div>

          {/* Module 3: Teflon Mixer */}
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#00629b]/10 text-[#00629b] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[22px]">rotate_right</span>
              </div>
              <span className="text-[11px] uppercase text-[#00677d] font-bold font-mono-code">Trộn Đồng Nhất</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">Cánh Khuấy Xoắn Ốc Tráng Teflon Tốc Độ Cao</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cánh khuấy độc lập với bề mặt kỵ nước Teflon chống bám dính tế bào, tạo dòng xoáy phản ứng hoàn hảo trong vòng 1.5 giây mà không tạo bọt khí.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-mono-code text-slate-500 flex justify-between">
              <span>Tỉ lệ bám dính:</span>
              <span className="font-bold text-[#004976]">&lt; 0.01%</span>
            </div>
          </div>

          {/* Module 4: 8-Step Wash Station */}
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#50d9fe]/20 text-[#00677d] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[22px]">clean_hands</span>
              </div>
              <span className="text-[11px] uppercase text-[#00677d] font-bold font-mono-code">Rửa Tự Động Toàn Diện</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">Trạm Rửa Cuvette Tự Động 8 Bước</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chu trình rửa ấm 8 giai đoạn kết hợp hút kiệt chất lỏng và sấy khô bằng khí nén áp lực âm, giữ cuvette quang học luôn trong suốt tuyệt đối.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-mono-code text-slate-500 flex justify-between">
              <span>Nhiễm chéo:</span>
              <span className="font-bold text-[#004976]">&lt; 0.05%</span>
            </div>
          </div>

          {/* Module 5: Concave Grating */}
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#3b465a]/10 text-[#3b465a] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[22px]">lens</span>
              </div>
              <span className="text-[11px] uppercase text-[#00677d] font-bold font-mono-code">Quang Học Đảo Ngược</span>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">Quang Phổ Kế Cách Xạ Đảo Ngược (Concave Grating)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bộ tán sắc phẳng holographic concave grating không dùng kính lọc rời, thu nhận chính xác 12 bước sóng cùng lúc từ 340nm đến 800nm.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-mono-code text-slate-500 flex justify-between">
              <span>Dải hấp thụ:</span>
              <span className="font-bold text-[#004976]">0 - 3.500 Abs</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Danh Mục Thiết Bị Chẩn Đoán (Model Switcher Hub) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-mono-code">
                Danh Mục Thiết Bị Chẩn Đoán
              </span>
              <span className="text-xs text-slate-500 font-mono-code">| Dirui Industrial Standard</span>
            </div>
            <h2 className="text-xl md:text-2xl text-[#004976] font-bold mt-1">
              Hệ Thống Phân Tích Sinh Hóa &amp; Nước Tiểu Dirui
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            Chuyển đổi mô hình hiển thị 3D và đối chiếu tham số kỹ thuật thực tế phục vụ nhu cầu cấu hình phòng xét nghiệm.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.values(MACHINE_MODELS).map(model => {
            const isSelected = activeModel === model.id;
            return (
              <div
                key={model.id}
                onClick={() => onSelectModel(model.id as MachineModelId)}
                className={`flex flex-col justify-between p-5 rounded-xl transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-md border-2 border-[#004976]'
                    : 'bg-white shadow-xs hover:shadow-md border border-slate-200'
                }`}
              >
                {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-[#004976]"></div>}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono-code ${
                        isSelected
                          ? 'bg-[#004976] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSelected ? 'Đang Chọn' : model.typeBadge}
                    </span>
                    <span className="text-xs font-bold text-[#00677d] font-mono-code">{model.throughput}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{model.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{model.description}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg flex flex-col gap-1 text-[11px] font-mono-code text-slate-600 border border-slate-100">
                    {model.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.label}</span>
                        <span className="font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                  {isSelected ? (
                    <span className="text-xs text-[#004976] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Đang hiển thị 3D
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectModel(model.id as MachineModelId);
                      }}
                      className="w-full py-1.5 bg-[#f1f4f6] text-slate-700 font-semibold text-xs rounded hover:bg-[#00629b] hover:text-white transition-all flex items-center justify-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                      Tải Mô hình 3D
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPdfModal();
                    }}
                    className="text-[#004976] hover:text-[#00677d] p-1 rounded transition-colors"
                    title="Xem chi tiết kỹ thuật"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">info</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Live Telemetry, Batch Progress & Assay Kinetics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Batch Progression + Absorbance Curve */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Batch Progression Card */}
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#004976] text-[24px]">pending_actions</span>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    Tiến Độ Chạy Mẻ Xét Nghiệm #BATCH-8904
                  </h3>
                  <p className="text-xs text-slate-500 font-mono-code">
                    Thời gian bắt đầu: 10:14:02 SA | Dự kiến hoàn tất: 10:48:30 SA
                  </p>
                </div>
              </div>
              <div className="text-right font-mono-code">
                <span className="text-base font-bold text-[#004976]">52.5%</span>
                <span className="block text-[11px] text-slate-500">Còn lại: 14 phút</span>
              </div>
            </div>

            {/* Micro Progression Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div className="bg-[#00629b] h-full rounded-full w-[52.5%] transition-all duration-500 relative">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#50d9fe] rounded-full animate-ping"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg flex flex-col border border-slate-100 font-mono-code">
                <span className="text-[10px] text-slate-500 uppercase">Mẫu Đã Xử Lý</span>
                <span className="text-sm md:text-base font-bold text-slate-900">
                  42 <span className="text-xs text-slate-500 font-normal">/ 80 mẫu</span>
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex flex-col border border-slate-100 font-mono-code">
                <span className="text-[10px] text-slate-500 uppercase">Số Test Đã Đo</span>
                <span className="text-sm md:text-base font-bold text-[#00677d]">
                  126 <span className="text-xs text-slate-500 font-normal">tests</span>
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex flex-col border border-slate-100 font-mono-code">
                <span className="text-[10px] text-slate-500 uppercase">Mẫu Khẩn (STAT)</span>
                <span className="text-sm md:text-base font-bold text-[#004976]">
                  04 <span className="text-xs text-slate-500 font-normal">ưu tiên</span>
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg flex flex-col border border-slate-100 font-mono-code">
                <span className="text-[10px] text-slate-500 uppercase">Cảnh Báo Độ Lệch</span>
                <span className="text-sm md:text-base font-bold text-slate-900">
                  0 <span className="text-xs text-emerald-600 font-normal">An Toàn</span>
                </span>
              </div>
            </div>
          </div>

          {/* Absorbance Curve Card */}
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00677d] text-[20px]">show_chart</span>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    Đồ Thị Động Học Phản Ứng Quang Phổ Kế (Absorbance Curve)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-mono-code mt-0.5">
                  {activeCurve.title}
                </p>
              </div>

              {/* Wavelength Switcher Buttons */}
              <div className="flex items-center gap-1 bg-[#f1f4f6] p-1 rounded-lg font-mono-code text-xs">
                {[505, 340, 405, 700].map(wl => (
                  <button
                    key={wl}
                    onClick={() => setSelectedWavelength(wl)}
                    className={`px-2.5 py-1 rounded transition-all font-semibold ${
                      selectedWavelength === wl
                        ? 'bg-white text-[#004976] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    type="button"
                  >
                    {wl} nm
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Curve Container */}
            <div className="relative w-full h-56 bg-[#f8fafc] rounded-xl p-4 flex flex-col justify-between overflow-hidden border border-slate-200/80">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#717881 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Axis Meta */}
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-500 z-10">
                <span>Độ hấp thụ (Absorbance: 0.000 - 2.500 Abs)</span>
                <span className="font-bold text-[#00677d]">{activeCurve.endAbs}</span>
              </div>

              {/* Curve Graphic */}
              <div className="relative w-full h-36 z-10 flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
                  {/* Calibration safety corridor */}
                  <path
                    className="text-[#b3ebff]/40 transition-all duration-300"
                    d={activeCurve.corrD}
                    fill="currentColor"
                  />
                  {/* Primary Reaction line */}
                  <path
                    className="text-[#004976] transition-all duration-300"
                    d={activeCurve.pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  {/* Reference line */}
                  <path
                    className="text-slate-400"
                    d="M 0 112 Q 150 110, 300 108 T 500 106"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4 3"
                    strokeWidth="1.5"
                  />
                  {/* Reading point pin */}
                  <circle
                    className="text-[#00677d] stroke-white stroke-2"
                    cx="380"
                    cy={selectedWavelength === 340 ? '94' : '31'}
                    fill="currentColor"
                    r="5"
                  />
                </svg>
              </div>

              {/* Time axis labels */}
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-500 z-10 pt-1">
                <span>0s (Trộn R1)</span>
                <span>120s (Thêm R2)</span>
                <span>240s</span>
                <span>360s</span>
                <span>480s (Đo Điểm Cuối)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600 font-mono-code text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004976]"></span>
                <span>
                  Chỉ số R-Bình phương (R²): <strong className="text-slate-900">0.9998</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00677d]"></span>
                <span>
                  Độ lặp lại CV%: <strong className="text-slate-900">0.82%</strong> (Tiêu chuẩn &lt;1.5%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Active Assay List + Reagent Inventory */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Assays List */}
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-bold text-slate-900">Xét Nghiệm Đang Phân Tích</h3>
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold font-mono-code">
                4 Xét nghiệm ưu tiên
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {INITIAL_ASSAYS.slice(0, 4).map(assay => (
                <div
                  key={assay.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#004976]">{assay.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#b3ebff]/60 text-[#001f27] font-mono-code font-bold">
                        {assay.method}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono-code">
                      Khoảng tham chiếu: {assay.refRange}
                    </span>
                  </div>
                  <div className="text-right font-mono-code">
                    <span className="text-sm md:text-base font-bold text-slate-900">
                      {assay.value} {assay.unit === '%' ? '%' : ''}
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-600">BÌNH THƯỜNG</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reagent Inventory Levels */}
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-bold text-slate-900">Trữ Lượng Hóa Chất &amp; Phụ Trợ</h3>
              <span className="text-xs text-[#00677d] font-bold font-mono-code">Bảo quản 4.2°C</span>
            </div>

            <div className="flex flex-col gap-3.5 font-mono-code">
              {/* R1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Khay Thuốc thử R1 (Trữ lượng tổng hợp)</span>
                  <span className="text-[#004976] font-bold">76% (Còn 620 mL)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#004976] rounded-full w-[76%] transition-all"></div>
                </div>
              </div>

              {/* R2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Khay Thuốc thử R2 (Enzyme xúc tác)</span>
                  <span className="text-[#004976] font-bold">64% (Còn 380 mL)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00629b] rounded-full w-[64%] transition-all"></div>
                </div>
              </div>

              {/* Wash */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Dung Dịch Tẩy Rửa Cuvette Kèm Kháng Khuẩn</span>
                  <span className="text-[#00677d] font-bold">84% (Đầy đủ)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00677d] rounded-full w-[84%] transition-all"></div>
                </div>
              </div>

              {/* Waste */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Thùng Chứa Chất Thải Lỏng Nguy Hại Sinh Học</span>
                  <span className="text-slate-500 font-bold">22% (Mức An Toàn)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full w-[22%] transition-all"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Technical Specifications, Clinical Certifications & Downloadable Manuals */}
      <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] font-bold font-mono-code">
              Tài Liệu Kỹ Thuật Chuẩn Hóa
            </span>
            <h3 className="text-lg md:text-xl text-[#004976] font-bold">
              Thông Số Kỹ Thuật Chi Tiết: {MACHINE_MODELS[activeModel].name}
            </h3>
            <p className="text-xs text-slate-500 font-mono-code">
              Phù hợp quy định trang thiết bị y tế chẩn đoán In Vitro (IVD) theo chuẩn Bộ Y Tế &amp; Quốc tế.
            </p>
          </div>

          <button
            onClick={onOpenPdfModal}
            className="px-5 py-2.5 bg-[#004976] hover:bg-[#00629b] text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-xs transition-all whitespace-nowrap"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Tải Tài Liệu Kỹ Thuật &amp; Hướng Dẫn PDF (Dirui Official)</span>
          </button>
        </div>

        {/* Specs Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MACHINE_MODELS[activeModel].specifications.map((spec, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-100">
              <div className="flex items-center gap-2 text-[#004976] font-bold">
                <span className="material-symbols-outlined text-[20px]">{spec.icon}</span>
                <h4 className="text-xs">{spec.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              Đơn vị ủy quyền bảo hành kỹ thuật: <strong className="text-slate-800">DIRUI VIETNAM LAB SUPPORT</strong>
            </span>
            <span>
              Hotline Kỹ Thuật 24/7: <strong className="text-slate-800">1800-DIRUI-MED</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00677d]"></span>
            <span>Chứng nhận hiệu chuẩn máy: HỢP CHUẨN (Calibrated until Nov 2026)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
