import React from 'react';
import { MACHINE_MODELS } from '../data/mockData';
import { MachineModelId } from '../types';

interface PdfManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: MachineModelId;
}

export const PdfManualModal: React.FC<PdfManualModalProps> = ({
  isOpen,
  onClose,
  activeModel
}) => {
  if (!isOpen) return null;
  const modelInfo = MACHINE_MODELS[activeModel];

  const handleDownload = () => {
    // Generate text blob for official specs download
    const content = `DIRUI INDUSTRIAL STANDARD - TECHNICAL SPECIFICATION SHEET
Model: ${modelInfo.name}
Category: ${modelInfo.category}
Throughput: ${modelInfo.throughput}
Firmware Build: v3.19.4-PROD-2026
Standard: CE Mark (EU IVD 98/79/EC), FDA Listed, ISO 13485:2016, ISO 9001

1. SYSTEM SPECIFICATIONS:
- Sample Positions: 80 positions with continuous STAT priority loading
- Reagent Disk: 80 positions with Peltier cooling 2°C - 8°C (24h continuous)
- Reaction Cuvettes: 80 optical hard plastic/quartz cuvettes, optical path 5mm
- Reaction Volume: 100 - 360 uL
- Photometer: Holographic concave flat-field grating, 12 wavelengths (340-800nm)
- Light Source: 12V / 20W long-life halogen tungsten lamp / optical fiber
- Pipetting: Micro-step servo motor, 0.1 uL step division, capacitive liquid level detection (LLD), vertical & horizontal collision protection
- Mixing: Independent Teflon-coated high speed spiral mixer (<0.01% carry-over)
- Washing: 8-step automatic warm water wash station with vacuum drying
- Water Consumption: < 5 Liters / Hour deionized water

2. CLINICAL CHEMISTRY ASSAYS SUPPORTED:
- Enzymes: ALT, AST, ALP, GGT, CK-NAC, CK-MB, LDH, AMY, CHE
- Substrates: GLU, UREA, CREA, UA, TP, ALB, TBIL, DBIL, TG, CHOL, HDL-C, LDL-C
- Electrolytes & Immuno: Na, K, Cl (ISE option), CRP, ASO, RF, HbA1c, C3, C4, IgA, IgG, IgM

3. REGULATORY & WARRANTY:
- Certification: CE, FDA, ISO 13485
- Service Support: DIRUI VIETNAM LAB SUPPORT (Hotline 1800-DIRUI-MED)
Generated at: ${new Date().toISOString()}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dirui_${activeModel}_Official_Technical_Manual.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#004976] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none">
                Tài Liệu Kỹ Thuật &amp; Hướng Dẫn Vận Hành
              </h3>
              <p className="text-[11px] text-sky-200 font-mono-code mt-0.5">
                Dirui Medical Instruments Co., Ltd. Official Technical Bulletin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-slate-700">
          <div className="flex items-center justify-between p-4 bg-[#f2f4f6] rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-mono-code">
                MÃ THIẾT BỊ: {activeModel}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">{modelInfo.name}</h4>
              <p className="text-xs text-slate-500 font-mono-code">{modelInfo.category}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono-code block">Tốc độ phân tích</span>
              <span className="text-lg font-bold text-[#004976] font-mono-code">{modelInfo.throughput}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-bold text-slate-900 uppercase font-mono-code">Thông Số Vận Hành Cơ Bản</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {modelInfo.details.map((d, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">{d.label}</span>
                  <span className="text-xs font-bold text-slate-800 font-mono-code">{d.value}</span>
                </div>
              ))}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Nhiệt độ buồng ủ:</span>
                <span className="text-xs font-bold text-slate-800 font-mono-code">37.0°C ± 0.1°C</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Tiêu thụ nước cất:</span>
                <span className="text-xs font-bold text-slate-800 font-mono-code">&lt; 5 Lít / Giờ</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Giao thức kết nối:</span>
                <span className="text-xs font-bold text-slate-800 font-mono-code">LIS ASTM / HL7</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-bold text-slate-900 uppercase font-mono-code">Chứng Nhận Chất Lượng Quốc Tế</h5>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                CE Mark IVD 98/79/EC
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                FDA 510(k) Listed
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                ISO 13485:2016
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                ISO 9001:2015
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono-code">
            Phiên bản tài liệu: DIRUI-DOC-2026.09
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200"
              type="button"
            >
              Đóng
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Tải Bản PDF / TXT Đầy Đủ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
