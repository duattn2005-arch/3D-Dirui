import React, { useState } from 'react';
import {
  OFFICIAL_DIRUI_CS_T240_SPECS,
  DIRUI_TROUBLESHOOTING_CODES,
  DIRUI_SPARE_PARTS,
  FLUIDIC_COMPONENTS_MAP,
  TroubleshootingItem
} from '../data/serviceManualData';

interface SubsystemItem {
  id: string;
  name: string;
  category: string;
  nominalValue: string;
  measuredValue: string;
  status: 'PASS' | 'TESTING' | 'WARN';
  icon: string;
  manualRef: string;
}

export const SubsystemWorkspace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'DIAGNOSTICS' | 'FLUIDICS' | 'TROUBLESHOOTING' | 'SPARE_PARTS'>('DIAGNOSTICS');
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);
  const [testProgress, setTestProgress] = useState(100);

  // Troubleshooting search & filter
  const [alarmSearchTerm, setAlarmSearchTerm] = useState('');
  const [selectedAlarmCategory, setSelectedAlarmCategory] = useState<string>('ALL');
  const [selectedTroubleshoot, setSelectedTroubleshoot] = useState<TroubleshootingItem | null>(DIRUI_TROUBLESHOOTING_CODES[0]);

  // Spare parts search & filter
  const [partsCategory, setPartsCategory] = useState<string>('ALL');
  const [partSearchTerm, setPartSearchTerm] = useState('');

  const [systems] = useState<SubsystemItem[]>([
    {
      id: 'SYS-01',
      name: 'Bể ủ ổn nhiệt phản ứng (Incubation Bath Z1)',
      category: 'Kiểm soát nhiệt PID',
      nominalValue: '37.0°C ± 0.1°C',
      measuredValue: '37.02 °C',
      status: 'PASS',
      icon: 'thermostat',
      manualRef: 'Mục 1.2.2 & 5.2.2 (Que đun 200W)'
    },
    {
      id: 'SYS-02',
      name: 'Bình gia nhiệt nước cấp rửa (Water Tank Z5)',
      category: 'Nhiệt độ nước rửa',
      nominalValue: '34.0°C ± 0.5°C',
      measuredValue: '34.1 °C',
      status: 'PASS',
      icon: 'water_heater',
      manualRef: 'Mục 5.2.4 (Que đun 180W)'
    },
    {
      id: 'SYS-03',
      name: 'Bơm hút chân không thu hồi thải (Vacuum Z27)',
      category: 'Áp lực âm khí nén',
      nominalValue: '≥ -70 kPa (-0.7 kgf/cm²)',
      measuredValue: '-74.2 kPa',
      status: 'PASS',
      icon: 'air',
      manualRef: 'Mục 5.1-10 & 5.2.4'
    },
    {
      id: 'SYS-04',
      name: 'Bơm từ tuần hoàn áp lực (Magnetic Pump MP-20RZ)',
      category: 'Thủy lực tuần hoàn',
      nominalValue: '0.45 kgf/cm² (cột áp 4.6m)',
      measuredValue: '0.448 kgf/cm²',
      status: 'PASS',
      icon: 'water_drop',
      manualRef: 'Mục 5.2.1-3 (Head 4.6m 50Hz)'
    },
    {
      id: 'SYS-05',
      name: 'Làm lạnh bán dẫn khay thuốc thử (Peltier D1-D2)',
      category: 'Bảo quản nhiệt 24/7',
      nominalValue: '5.0°C - 15.0°C (Dòng tải > 5A)',
      measuredValue: '6.4 °C (Dòng 6.2A)',
      status: 'PASS',
      icon: 'ac_unit',
      manualRef: 'Mục 4.3 & 6.4.2 (FPH1-12708AC)'
    },
    {
      id: 'SYS-06',
      name: 'Bơm tiêm vi tích (Glass Syringe Pump 500uL)',
      category: 'Cơ điện tử chính xác',
      nominalValue: 'Dung tích 500 μL (Độ mịn 0.1 μL)',
      measuredValue: '500.0 μL (Sai số <0.05%)',
      status: 'PASS',
      icon: 'colorize',
      manualRef: 'Mục 4.1 & 5.1-2 (Bơm vi lượng 500uL)'
    },
    {
      id: 'SYS-07',
      name: 'Trạm rửa tự động 8 điểm dừng 12 bước (Auto-Rinse)',
      category: 'Cơ cấu rửa cóng',
      nominalValue: '4 cụm kim + Đầu lau khô xốp',
      measuredValue: 'Đồng bộ 15s/chu kỳ',
      status: 'PASS',
      icon: 'sanitizer',
      manualRef: 'Mục 1.2.2 & 4.6 (8-stop 12-step)'
    },
    {
      id: 'SYS-08',
      name: 'Quang phổ kế 12 bước sóng cách xạ sau',
      category: 'Quang học Grating',
      nominalValue: '340 - 750 nm (Đèn 12V/20W)',
      measuredValue: 'Độ hấp thụ 0 ~ 3.3 ABS (OK)',
      status: 'PASS',
      icon: 'lens',
      manualRef: 'Mục 1.2 & 3.1.1 (12 wavelengths)'
    },
    {
      id: 'SYS-09',
      name: 'Cánh khuấy Teflon & Motor cốc rỗng cao tốc',
      category: 'Hòa trộn cơ học',
      nominalValue: 'Độ chính xác nâng hạ 0.032 mm',
      measuredValue: '0.012 mm (OK)',
      status: 'PASS',
      icon: 'cyclone',
      manualRef: 'Mục 4.4 & Hình 4-18'
    }
  ]);

  const handleRunFullDiagnostic = () => {
    setIsRunningAllTests(true);
    setTestProgress(0);

    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningAllTests(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const filteredAlarms = DIRUI_TROUBLESHOOTING_CODES.filter(item => {
    const matchCat = selectedAlarmCategory === 'ALL' || item.category === selectedAlarmCategory;
    const matchSearch =
      item.code.toLowerCase().includes(alarmSearchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(alarmSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(alarmSearchTerm.toLowerCase()) ||
      item.phenomenon.toLowerCase().includes(alarmSearchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredParts = DIRUI_SPARE_PARTS.filter(part => {
    const matchCat = partsCategory === 'ALL' || part.category === partsCategory;
    const matchSearch =
      part.sapCode.includes(partSearchTerm) ||
      part.name.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
      part.nameEn.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
      (part.spec && part.spec.toLowerCase().includes(partSearchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              CS-T240 Service Manual Data
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Dirui Industrial Co., Ltd. Standard</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Chẩn Đoán Phân Hệ &amp; Sổ Tay Kỹ Thuật Máy DIRUI CS-T240
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cấu hình thực tế "2 mâm + 1 kim + 1 cánh khuấy", sơ đồ thủy lực 7 ngả, bảng mã lỗi kiểm tra chân VOM và danh mục phụ tùng chính hãng SAP.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('DIAGNOSTICS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono-code transition-all ${
              activeSubTab === 'DIAGNOSTICS'
                ? 'bg-[#004976] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            type="button"
          >
            Tự Kiểm Tra
          </button>
          <button
            onClick={() => setActiveSubTab('FLUIDICS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono-code transition-all ${
              activeSubTab === 'FLUIDICS'
                ? 'bg-[#004976] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            type="button"
          >
            Sơ Đồ Thủy Lực
          </button>
          <button
            onClick={() => setActiveSubTab('TROUBLESHOOTING')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono-code transition-all ${
              activeSubTab === 'TROUBLESHOOTING'
                ? 'bg-[#004976] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            type="button"
          >
            Mã Lỗi &amp; Xử Lý
          </button>
          <button
            onClick={() => setActiveSubTab('SPARE_PARTS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono-code transition-all ${
              activeSubTab === 'SPARE_PARTS'
                ? 'bg-[#004976] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            type="button"
          >
            Phụ Tùng SAP
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DIAGNOSTICS */}
      {activeSubTab === 'DIAGNOSTICS' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Tự Kiểm Tra Toàn Diện Phân Hệ Cơ - Điện - Quang - Nhiệt
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đánh giá theo đúng thông số dung sai kỹ thuật của hãng DIRUI Industrial.
              </p>
            </div>
            <button
              onClick={handleRunFullDiagnostic}
              disabled={isRunningAllTests}
              className="px-4 py-2 bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all disabled:opacity-60"
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${isRunningAllTests ? 'animate-spin' : ''}`}>
                {isRunningAllTests ? 'autorenew' : 'health_and_safety'}
              </span>
              <span>{isRunningAllTests ? `Đang Kiểm Tra (${testProgress}%)...` : 'Chạy Tự Kiểm Tra Toàn Diện'}</span>
            </button>
          </div>

          {isRunningAllTests && (
            <div className="p-4 bg-white rounded-xl border border-sky-200 shadow-xs flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-slate-700 font-bold">Tiến trình kiểm tra phần cứng tích hợp:</span>
                <span className="text-[#004976] font-bold">{testProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00629b] h-full rounded-full transition-all duration-300"
                  style={{ width: `${testProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map(sys => (
              <div
                key={sys.id}
                className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#004976]/10 text-[#004976] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">{sys.icon}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sys.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono-code uppercase block">{sys.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{sys.name}</h4>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] font-mono-code">
                  <div className="flex justify-between text-slate-500">
                    <span>Ngưỡng danh định:</span>
                    <span>{sys.nominalValue}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Giá trị đo thực tế:</span>
                    <span className="text-[#004976]">{sys.measuredValue}</span>
                  </div>
                  <div className="text-[10px] text-sky-700 mt-1 bg-sky-50 px-2 py-0.5 rounded">
                    {sys.manualRef}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FLUIDICS & GAS CIRCUIT SCHEMATIC */}
      {activeSubTab === 'FLUIDICS' && (
        <div className="flex flex-col gap-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-600">water_drop</span>
                  Sơ Đồ Hệ Thống Đường Ống Thủy Lực &amp; Khí Nén CS-T240 (Chapter 5)
                </h3>
                <p className="text-xs text-slate-500 font-mono-code mt-0.5">
                  Phân tách hai hệ thống: Cấp dịch &amp; rửa cóng nước ấm 34°C | Hút chân không áp lực âm ≥ -70 kPa
                </p>
              </div>
              <span className="text-xs font-mono-code bg-sky-100 text-sky-800 px-2.5 py-1 rounded font-bold">
                Áp lực nước cấp: 0.45 kgf/cm² | Chân không: -70 kPa
              </span>
            </div>

            {/* Interactive Schematic Diagram Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
              {/* Left Column: Water In & Heating System */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h4 className="font-bold text-xs text-slate-800 uppercase font-mono-code">
                    1. Khối Cấp Nước &amp; Gia Nhiệt Sơ Cấp (Z5)
                  </h4>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col gap-1.5 font-mono-code">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bình chứa nước Z5:</span>
                    <span className="font-bold text-blue-600">34.0°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Van cấp nước SV13:</span>
                    <span className="font-bold text-emerald-600">Đóng (Phao cao J301)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Que đun 180W J412:</span>
                    <span className="font-bold text-amber-600">Điều nhiệt tự động</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bơm từ MP-20RZ (Z8):</span>
                    <span className="font-bold text-slate-800">4.6m Head / 0.45 kgf/cm²</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 leading-relaxed">
                  <strong>Bộ chia nước 7 ngả (Z7):</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                    <li>Ngả 1: Cụm 5 van SV1-SV5 (rửa cóng, khuấy, ngoài kim)</li>
                    <li>Ngả 2: Bộ khử bọt khí Z40 (rửa trong kim hút)</li>
                    <li>Ngả 3: Cấp nước trộn tẩy rửa cóng (SV7/SV8)</li>
                    <li>Ngả 4: Cấp nước bù bể ủ phản ứng 37°C</li>
                    <li>Ngả 5: Cảm biến áp lực nước bình chứa (Z10/J04)</li>
                    <li>Ngả 6: Ống điều áp ổn định áp lực</li>
                  </ul>
                </div>
              </div>

              {/* Middle Column: Cuvette Rinsing & Reaction Bath */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h4 className="font-bold text-xs text-slate-800 uppercase font-mono-code">
                    2. Bể Ủ 37°C &amp; Trạm Rửa 8 Điểm Dừng
                  </h4>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col gap-1.5 font-mono-code">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bể ủ phản ứng Z1:</span>
                    <span className="font-bold text-rose-600">37.0°C ± 0.1°C (PID)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Que gia nhiệt Z6:</span>
                    <span className="font-bold text-rose-600">200W công suất cao</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Van nạp SV6 / Xả SV10:</span>
                    <span className="font-bold text-slate-700">Tuần hoàn ổn định</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trạm rửa 4 Nozzle:</span>
                    <span className="font-bold text-emerald-600">8 điểm dừng / 12 bước</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                  <strong>Chu trình trạm rửa cuvette:</strong>
                  <p className="mt-1">
                    Kim 1D hút dịch phản ứng, 1C bơm kiềm CS; Kim 2G hút kiềm, 2A bơm nước ấm; Kim 3B hút, 3A tráng nước;
                    Kim 4F hút cạn và đầu xốp lau khô thành đáy cóng.
                  </p>
                </div>
              </div>

              {/* Right Column: Waste & Vacuum Management */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h4 className="font-bold text-xs text-slate-800 uppercase font-mono-code">
                    3. Hệ Thống Chân Không &amp; Phân Luồng Thải
                  </h4>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col gap-1.5 font-mono-code">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bình chân không Z25:</span>
                    <span className="font-bold text-purple-600">-74.2 kPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cụm bơm chân không Z27:</span>
                    <span className="font-bold text-slate-800">2 Bơm áp lực âm cao</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Van hút SV11:</span>
                    <span className="font-bold text-emerald-600">Hút cạn cuvette</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ống thải nồng độ cao:</span>
                    <span className="font-bold text-red-600">Φ8mm (Thu gom riêng)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                  <strong>Phân luồng an toàn sinh học:</strong>
                  <p className="mt-1">
                    - <strong>Thải nồng độ cao:</strong> Dịch mẫu và hóa chất hút từ cuvette dẫn vào bình kín khử trùng 84 (tỷ lệ 1:50).<br />
                    - <strong>Thải nồng độ thấp:</strong> Nước rửa tráng cuvette và nước tràn dẫn trực tiếp qua ống Φ12mm.
                  </p>
                </div>
              </div>
            </div>

            {/* Fluidic components table */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase font-mono-code mb-3">
                Chi Tiết Các Cụm Van Điện Từ &amp; Thiết Bị Thủy Lực Chính
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                  <thead className="bg-slate-100 text-slate-700 font-mono-code">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">Ký Hiệu</th>
                      <th className="p-2.5 border-b border-slate-200">Tên Cụm Thiết Bị</th>
                      <th className="p-2.5 border-b border-slate-200">Loại</th>
                      <th className="p-2.5 border-b border-slate-200">Chức Năng Chính</th>
                      <th className="p-2.5 border-b border-slate-200">Thông Số Vận Hành</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FLUIDIC_COMPONENTS_MAP.map(comp => (
                      <tr key={comp.tag} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold font-mono-code text-[#004976]">{comp.tag}</td>
                        <td className="p-2.5 font-medium text-slate-800">{comp.name}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-700 font-mono-code">
                            {comp.type}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600">{comp.function}</td>
                        <td className="p-2.5 font-mono-code text-slate-700 text-[11px]">{comp.operatingParam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TROUBLESHOOTING LIST (Chapter 8 & 9) */}
      {activeSubTab === 'TROUBLESHOOTING' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 cols: Search & Alarm List */}
          <div className="lg:col-span-5 p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">bug_report</span>
                Tra Cứu Mã Báo Lỗi Service Manual (Chapter 8 &amp; 9)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đầy đủ mã lỗi chính hãng DIRUI: cơ cấu khuấy, trạm rửa, mâm cóng, kim hút, bơm tiêm, bể ủ, làm lạnh và quang phổ.
              </p>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col gap-2.5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Gõ mã lỗi (vd: 1-1, 8-1, 143-2, 20-1) hoặc tên lỗi..."
                  value={alarmSearchTerm}
                  onChange={e => setAlarmSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#004976] font-mono-code"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {['ALL', 'STIRRING', 'RINSING', 'REACTION_DISK', 'SAMPLE_PROBE', 'REAGENT_PROBE', 'SYRINGE_PUMP', 'INCUBATION_BATH', 'REFRIGERATION', 'OPTICS_AD', 'SYSTEM_RESET'].map(
                  cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedAlarmCategory(cat)}
                      className={`px-2 py-1 rounded text-[10px] font-bold font-mono-code transition-all ${
                        selectedAlarmCategory === cat
                          ? 'bg-[#004976] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      type="button"
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Alarm List items */}
            <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredAlarms.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-mono-code">
                  Không tìm thấy mã lỗi phù hợp với từ khóa.
                </div>
              ) : (
                filteredAlarms.map(alarm => {
                  const isSelected = selectedTroubleshoot?.code === alarm.code;
                  return (
                    <div
                      key={alarm.code}
                      onClick={() => setSelectedTroubleshoot(alarm)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-[#004976]/10 border-[#004976]'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono-code text-[#004976] bg-white px-2 py-0.5 rounded border border-slate-200">
                          MÃ ALARM: {alarm.code}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono-code ${
                            alarm.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alarm.severity}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-1">{alarm.name}</span>
                      <p className="text-[11px] text-slate-500 font-mono-code line-clamp-1">{alarm.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right 7 cols: Detailed Alarm Procedure and VOM Pinout Test */}
          <div className="lg:col-span-7 p-6 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            {selectedTroubleshoot ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono-code text-[#004976] bg-sky-100 px-2.5 py-1 rounded">
                        MÃ BÁO LỖI: {selectedTroubleshoot.code}
                      </span>
                      <span className="text-xs font-mono-code text-slate-500 uppercase">
                        [{selectedTroubleshoot.category}]
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{selectedTroubleshoot.name}</h3>
                    <p className="text-xs text-slate-500 font-mono-code italic">{selectedTroubleshoot.description}</p>
                  </div>
                </div>

                {/* Phenomenon */}
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 flex flex-col gap-1">
                  <span className="text-[11px] font-bold font-mono-code text-rose-800 uppercase flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Hiện tượng lỗi (Fault Phenomenon)
                  </span>
                  <p className="text-xs text-rose-950 font-medium leading-relaxed">
                    {selectedTroubleshoot.phenomenon}
                  </p>
                </div>

                {/* Test points if available */}
                {selectedTroubleshoot.testPoints && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col gap-1">
                    <span className="text-[11px] font-bold font-mono-code text-amber-900 uppercase flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">speed</span>
                      Điểm đo kiểm đồng hồ VOM &amp; Tín hiệu quang trở (Test Points)
                    </span>
                    <p className="text-xs text-amber-950 font-mono-code font-bold">
                      {selectedTroubleshoot.testPoints}
                    </p>
                  </div>
                )}

                {/* Step-by-step Solution */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase font-mono-code text-slate-800">
                    Quy Trình Xử Lý &amp; Sửa Chữa Chuẩn Hãng Dirui (Step-by-step Solution)
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedTroubleshoot.solution.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono-code">
                Chọn một mã lỗi từ danh sách bên trái để xem chi tiết hướng dẫn xử lý.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SPARE PARTS CATALOG (Chapter 9) */}
      {activeSubTab === 'SPARE_PARTS' && (
        <div className="flex flex-col gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004976]">inventory_2</span>
                Danh Mục Phụ Tùng &amp; Mã SAP Chính Hãng DIRUI CS-T240 (Chapter 9)
              </h3>
              <p className="text-xs text-slate-500 font-mono-code mt-0.5">
                Mã vật tư SAP chuẩn cho kỹ sư dịch vụ bảo trì và thay thế linh kiện định kỳ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Tìm mã SAP hoặc tên linh kiện..."
                value={partSearchTerm}
                onChange={e => setPartSearchTerm(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#004976] font-mono-code w-64"
              />

              <select
                value={partsCategory}
                onChange={e => setPartsCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-code focus:outline-none"
              >
                <option value="ALL">Tất Cả Loại</option>
                <option value="CONSUMABLE">Vật tư tiêu hao (Consumable)</option>
                <option value="ASSEMBLY">Cụm cơ cấu (Assembly)</option>
                <option value="CIRCUIT_BOARD">Bo mạch điện tử (Board)</option>
                <option value="SOLENOID_VALVE">Van điện từ (Valve)</option>
                <option value="PUMP">Bơm (Pump)</option>
              </select>
            </div>
          </div>

          {/* Parts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-700 font-mono-code">
                <tr>
                  <th className="p-3 border-b border-slate-200">Mã SAP</th>
                  <th className="p-3 border-b border-slate-200">Tên Tiếng Việt</th>
                  <th className="p-3 border-b border-slate-200">Tên Kỹ Thuật (English)</th>
                  <th className="p-3 border-b border-slate-200">Loại</th>
                  <th className="p-3 border-b border-slate-200">Thông Số Kỹ Thuật</th>
                  <th className="p-3 border-b border-slate-200">Định Kỳ Thay Thế</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParts.map(part => (
                  <tr key={part.sapCode} className="hover:bg-slate-50">
                    <td className="p-3 font-bold font-mono-code text-[#004976]">{part.sapCode}</td>
                    <td className="p-3 font-bold text-slate-900">{part.name}</td>
                    <td className="p-3 font-mono-code text-slate-600 text-[11px]">{part.nameEn}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 font-mono-code">
                        {part.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-[11px]">{part.spec || '—'}</td>
                    <td className="p-3 font-mono-code text-[11px] text-amber-800 font-semibold">
                      {part.replacementPeriod || 'Theo yêu cầu kỹ thuật'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
