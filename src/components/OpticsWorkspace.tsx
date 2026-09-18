import React, { useState } from 'react';
import { OPTICAL_WAVELENGTHS } from '../data/mockData';
import { OpticalWavelength } from '../types';

export const OpticsWorkspace: React.FC = () => {
  const [wavelengths, setWavelengths] = useState<OpticalWavelength[]>(OPTICAL_WAVELENGTHS);
  const [lampVoltage, setLampVoltage] = useState<number>(12.04);
  const [lampTemp, setLampTemp] = useState<number>(41.2);
  const [isZeroing, setIsZeroing] = useState(false);

  const handlePerformZeroCalibration = () => {
    setIsZeroing(true);
    setTimeout(() => {
      setWavelengths(prev =>
        prev.map(w => ({
          ...w,
          absorbance: 0.000,
          status: 'CALIBRATED'
        }))
      );
      setIsZeroing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              Quang Học Lâm Sàng
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Concave Holographic Grating System</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Hệ Thống Quang Phổ Kế &amp; Giám Sát Cảm Biến Bước Sóng
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Quang kế đảo ngược thu nhận đồng thời 12 bước sóng từ 340nm đến 800nm, kiểm soát suy hao ánh sáng phân tán &lt;0.01%.
          </p>
        </div>

        <button
          onClick={handlePerformZeroCalibration}
          disabled={isZeroing}
          className="px-4 py-2 bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all disabled:opacity-60"
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isZeroing ? 'animate-spin' : ''}`}>
            {isZeroing ? 'autorenew' : 'tune'}
          </span>
          <span>{isZeroing ? 'Đang Hiệu Chuẩn Nền 0.000 Abs...' : 'Hiệu Chuẩn Nền Trắng (Optical Zero)'}</span>
        </button>
      </div>

      {/* Sensor Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono-code">
            <span>ĐIỆN ÁP ĐÈN HALOGEN</span>
            <span className="material-symbols-outlined text-amber-500 text-[18px]">lightbulb</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-code">{lampVoltage.toFixed(2)} V</span>
            <span className="text-xs text-emerald-600 font-mono-code block">Định mức: 12.00V ±0.05V</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[96%]"></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono-code">
            <span>NHIỆT ĐỘ KHỐI ĐÈN</span>
            <span className="material-symbols-outlined text-rose-500 text-[18px]">thermostat</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-code">{lampTemp.toFixed(1)} °C</span>
            <span className="text-xs text-emerald-600 font-mono-code block">Tản nhiệt cưỡng bức quạt DC</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-[82%]"></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono-code">
            <span>ÁNH SÁNG PHÂN TÁN (STRAY)</span>
            <span className="material-symbols-outlined text-sky-500 text-[18px]">grain</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-[#00677d] font-mono-code">&lt; 0.006%</span>
            <span className="text-xs text-slate-500 font-mono-code block">Tiêu chuẩn IVD: &lt;0.05%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00677d] h-full rounded-full w-[98%]"></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono-code">
            <span>ĐỘ TRUYỀN QUANG CUVETTE</span>
            <span className="material-symbols-outlined text-purple-500 text-[18px]">view_agenda</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-code">99.85 %</span>
            <span className="text-xs text-emerald-600 font-mono-code block">80 Cuvette nhựa quang học sạch</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-[99%]"></div>
          </div>
        </div>
      </div>

      {/* 12 Channels Spectrometer Table */}
      <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Bảng Giám Sát 12 Kênh Bước Sóng Quang Học (Photodiode Array)</h3>
          <span className="text-xs font-mono-code text-slate-500">Cập nhật mỗi chu kỳ 0.5s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3">Kênh</th>
                <th className="py-2.5 px-3">Bước sóng (λ)</th>
                <th className="py-2.5 px-3">Cường độ đèn (%)</th>
                <th className="py-2.5 px-3">Ánh sáng phân tán</th>
                <th className="py-2.5 px-3">Độ hấp thụ nền (OD)</th>
                <th className="py-2.5 px-3">Ứng dụng lâm sàng chính</th>
                <th className="py-2.5 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wavelengths.map((w, index) => {
                const appDesc: Record<number, string> = {
                  340: 'UV Enzyme Kinetic (ALT, AST, LDH, CK-NAC, Urea UV)',
                  380: 'Bilirubin gián tiếp & Protein niệu',
                  405: 'Phosphatase Kiềm (ALP), GGT, Amylase',
                  450: 'Magnesium, Sắt huyết thanh (Iron)',
                  480: 'Total Bilirubin DSA, Calci Arsenazo',
                  505: 'Glucose GOD-PAP, Cholesterol, Triglycerides, Uric Acid',
                  546: 'Total Protein Biuret, Albumin, Fructosamine',
                  570: 'Canxi O-CPC, Photpho Phosphomolybdate',
                  600: 'Albumin Bromocresol Green (BCG)',
                  660: 'Bilirubin toàn phần Enzymatic',
                  700: 'Bước sóng phụ bù trừ trừ nền sinh hóa (Dual-wavelength)',
                  800: 'Miễn dịch độ đục (CRP, ASO, RF, Ferritin, HbA1c)'
                };

                return (
                  <tr key={w.nm} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-400">CH-0{index + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#004976]">{w.nm} nm</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-12">{w.lampIntensity.toFixed(1)}%</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#004976] h-full rounded-full"
                            style={{ width: `${w.lampIntensity}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{(w.strayLightIndex * 100).toFixed(3)}%</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{w.absorbance.toFixed(3)} Abs</td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">{appDesc[w.nm] || 'General Photometry'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
