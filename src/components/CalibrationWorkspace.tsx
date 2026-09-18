import React, { useState } from 'react';

export const CalibrationWorkspace: React.FC = () => {
  const [selectedAssay, setSelectedAssay] = useState<'GLU' | 'ALT' | 'CREA' | 'HbA1c'>('GLU');
  const [curveModel, setCurveModel] = useState<'LINEAR' | 'LOG_LOGIT' | 'SPLINE'>('LINEAR');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const calibratorPoints: Record<string, { cal: string; conc: number; od: number }[]> = {
    GLU: [
      { cal: 'Cal 1 (Blank)', conc: 0.0, od: 0.002 },
      { cal: 'Cal 2', conc: 2.5, od: 0.315 },
      { cal: 'Cal 3', conc: 5.0, od: 0.628 },
      { cal: 'Cal 4', conc: 10.0, od: 1.250 },
      { cal: 'Cal 5', conc: 20.0, od: 2.485 }
    ],
    ALT: [
      { cal: 'Cal 1 (Blank)', conc: 0.0, od: 0.001 },
      { cal: 'Cal 2', conc: 25.0, od: 0.245 },
      { cal: 'Cal 3', conc: 50.0, od: 0.490 },
      { cal: 'Cal 4', conc: 100.0, od: 0.980 },
      { cal: 'Cal 5', conc: 250.0, od: 2.420 }
    ],
    CREA: [
      { cal: 'Cal 1 (Blank)', conc: 0.0, od: 0.003 },
      { cal: 'Cal 2', conc: 44.0, od: 0.180 },
      { cal: 'Cal 3', conc: 88.0, od: 0.360 },
      { cal: 'Cal 4', conc: 177.0, od: 0.720 },
      { cal: 'Cal 5', conc: 354.0, od: 1.440 }
    ],
    HbA1c: [
      { cal: 'Cal 1', conc: 4.0, od: 0.210 },
      { cal: 'Cal 2', conc: 6.0, od: 0.420 },
      { cal: 'Cal 3', conc: 8.5, od: 0.740 },
      { cal: 'Cal 4', conc: 12.0, od: 1.150 },
      { cal: 'Cal 5', conc: 16.0, od: 1.620 }
    ]
  };

  const points = calibratorPoints[selectedAssay];

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              Hiệu Chuẩn &amp; Kiểm Chuẩn QC
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Multi-Point Analytical Photometric Calibration</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Đường Cong Chuẩn Đa Điểm &amp; Biểu Đồ Levey-Jennings QC
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Duy trì độ chuẩn xác phân tích định lượng theo chuẩn ISO 15189, kiểm soát sai số hệ thống với bộ quy tắc Westgard.
          </p>
        </div>

        <button
          onClick={handleRunCalibration}
          disabled={isCalibrating}
          className="px-4 py-2 bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all disabled:opacity-60"
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isCalibrating ? 'animate-spin' : ''}`}>
            {isCalibrating ? 'autorenew' : 'check_circle'}
          </span>
          <span>{isCalibrating ? 'Đang Đo Calibrator...' : 'Chạy Hiệu Chuẩn Lại (Re-Calibrate)'}</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 font-mono-code">Xét nghiệm:</span>
          <div className="flex gap-1 font-mono-code text-xs">
            {(['GLU', 'ALT', 'CREA', 'HbA1c'] as const).map(assay => (
              <button
                key={assay}
                onClick={() => setSelectedAssay(assay)}
                className={`px-3 py-1.5 rounded font-bold transition-all ${
                  selectedAssay === assay
                    ? 'bg-[#004976] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                type="button"
              >
                {assay}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 font-mono-code">Thuật toán khớp đường cong:</span>
          <div className="flex gap-1 font-mono-code text-xs">
            {(['LINEAR', 'LOG_LOGIT', 'SPLINE'] as const).map(m => (
              <button
                key={m}
                onClick={() => setCurveModel(m)}
                className={`px-3 py-1.5 rounded transition-all font-semibold ${
                  curveModel === m
                    ? 'bg-[#00677d] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                type="button"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curve Plot + Calibrator Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: SVG Calibration Curve */}
        <div className="lg:col-span-7 p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Đồ Thị Đường Cong Chuẩn (Standard Calibration Curve: {selectedAssay})
            </h3>
            <span className="text-xs font-mono-code text-[#004976] font-bold">
              R² = 0.9998 | Hệ số K = 7.962
            </span>
          </div>

          <div className="relative w-full h-64 bg-[#f8fafc] rounded-xl p-4 flex flex-col justify-between overflow-hidden border border-slate-200/80">
            <div className="flex justify-between text-[11px] font-mono-code text-slate-500 z-10">
              <span>Mật độ quang OD (0.000 - 2.500 Abs)</span>
              <span>Nồng độ đối chiếu (Concentration)</span>
            </div>

            {/* SVG Plot */}
            <div className="relative w-full h-44 z-10 flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                {/* Gridlines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="3 3" />

                {/* Fitted Line */}
                <line
                  x1="20"
                  y1="140"
                  x2="480"
                  y2="15"
                  stroke="#004976"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Calibrator Points */}
                <circle cx="20" cy="140" r="5" fill="#00677d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="120" cy="110" r="5" fill="#00677d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="220" cy="80" r="5" fill="#00677d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="340" cy="45" r="5" fill="#00677d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="460" cy="20" r="5" fill="#00677d" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono-code text-slate-500 z-10 pt-1">
              <span>0 (Blank)</span>
              <span>Cal 2</span>
              <span>Cal 3</span>
              <span>Cal 4</span>
              <span>Cal 5 (Max Limit)</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-mono-code text-emerald-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>
              Đường cong chuẩn đạt yêu cầu phê duyệt lâm sàng. Độ dốc Slope: 0.125 | Giao điểm Intercept: 0.002
            </span>
          </div>
        </div>

        {/* Right 5 cols: Calibrators Table + Westgard QC */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900">Danh Sách Mẫu Chuẩn (Calibrators)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2 px-2.5">Mẫu</th>
                    <th className="py-2 px-2.5">Nồng độ</th>
                    <th className="py-2 px-2.5">Đo OD (Abs)</th>
                    <th className="py-2 px-2.5 text-right">Độ lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {points.map((pt, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-bold text-slate-700">{pt.cal}</td>
                      <td className="py-2 px-2.5 font-semibold text-[#004976]">{pt.conc.toFixed(1)}</td>
                      <td className="py-2 px-2.5">{pt.od.toFixed(3)}</td>
                      <td className="py-2 px-2.5 text-right text-emerald-600 font-bold">&lt; 0.5%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Levey-Jennings QC Card */}
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Kiểm Soát Chất Lượng Nội Bộ QC (Level 1 &amp; 2)</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono-code">
                IN CONTROL
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono-code text-slate-600">
              <div className="p-2 bg-slate-50 rounded flex justify-between">
                <span>QC Level 1 (Bình thường):</span>
                <span className="font-bold text-slate-900">Mean: 5.20 | 1SD: ±0.08 (1.5%)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded flex justify-between">
                <span>QC Level 2 (Bệnh lý cao):</span>
                <span className="font-bold text-slate-900">Mean: 15.80 | 1SD: ±0.22 (1.4%)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded flex justify-between">
                <span>Quy tắc Westgard:</span>
                <span className="font-bold text-emerald-600">Đạt quy chuẩn (1-3s, 2-2s: PASS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
