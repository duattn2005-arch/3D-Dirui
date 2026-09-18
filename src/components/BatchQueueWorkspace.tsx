import React, { useState } from 'react';
import { INITIAL_BATCH_SAMPLES } from '../data/mockData';
import { BatchItem } from '../types';

export const BatchQueueWorkspace: React.FC = () => {
  const [samples, setSamples] = useState<BatchItem[]>(INITIAL_BATCH_SAMPLES);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isAddStatModalOpen, setIsAddStatModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newTests, setNewTests] = useState('GLU, ALT, CREA');

  const handleAddStatSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newSample: BatchItem = {
      id: `SMP-STAT-${Date.now().toString().slice(-4)}`,
      tubeBarcode: newBarcode.trim() || `${Math.floor(100000000 + Math.random() * 900000000)}`,
      patientName: `${newPatientName.trim()} [CẤP CỨU STAT]`,
      gender: 'M',
      age: 40,
      sampleType: 'Plasma',
      status: 'STAT',
      tests: newTests.split(',').map(t => t.trim()),
      priority: true,
      cupPosition: samples.length + 1,
      progress: 0
    };

    setSamples([newSample, ...samples]);
    setNewPatientName('');
    setNewBarcode('');
    setIsAddStatModalOpen(false);
  };

  const filteredSamples = samples.filter(s => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'STAT') return s.priority;
    return s.status === filterStatus;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              Quản Lý Hàng Đợi Bệnh Phẩm
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Batch Run #BATCH-8904</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Hàng Đợi Mẻ Xét Nghiệm &amp; Quản Lý Mẫu Khẩn STAT
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Phân bổ thứ tự nạp mẫu tự động, hỗ trợ nạp khẩn mẫu STAT ưu tiên gián đoạn chu trình phân tích bình thường.
          </p>
        </div>

        <button
          onClick={() => setIsAddStatModalOpen(true)}
          className="px-4 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          <span>Thêm Mẫu Cấp Cứu STAT</span>
        </button>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-wrap gap-1 font-mono-code text-xs">
          {(['ALL', 'STAT', 'ANALYZING', 'PENDING', 'COMPLETED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded transition-all font-semibold ${
                filterStatus === tab
                  ? 'bg-[#004976] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              type="button"
            >
              {tab === 'ALL'
                ? `Tất cả (${samples.length})`
                : tab === 'STAT'
                ? `Mẫu Khẩn STAT (${samples.filter(s => s.priority).length})`
                : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code text-slate-600">
          <span>Tổng số mẫu trong khay: <strong className="text-slate-900">{samples.length} / 80</strong></span>
        </div>
      </div>

      {/* Sample Queue Table */}
      <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3">Vị trí cốc</th>
                <th className="py-2.5 px-3">Mã vạch (Barcode)</th>
                <th className="py-2.5 px-3">Họ và tên bệnh nhân</th>
                <th className="py-2.5 px-3">Loại bệnh phẩm</th>
                <th className="py-2.5 px-3">Chỉ định xét nghiệm</th>
                <th className="py-2.5 px-3">Tiến độ</th>
                <th className="py-2.5 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSamples.map(sample => (
                <tr
                  key={sample.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    sample.priority ? 'bg-rose-50/50' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-[#004976]">#{sample.cupPosition}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{sample.tubeBarcode}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {sample.priority && (
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                      )}
                      <span>{sample.patientName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{sample.sampleType}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {sample.tests.map((test, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sample.priority ? 'bg-red-500' : 'bg-[#004976]'
                          }`}
                          style={{ width: `${sample.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold">{sample.progress}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sample.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sample.status === 'ANALYZING'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : sample.status === 'STAT'
                          ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sample.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STAT Modal */}
      {isAddStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600">
                <span className="material-symbols-outlined text-[24px]">emergency</span>
                <h3 className="font-bold text-base text-slate-900">Nạp Mẫu Cấp Cứu STAT Khẩn Cấp</h3>
              </div>
              <button
                onClick={() => setIsAddStatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddStatSample} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tên Bệnh Nhân Cấp Cứu:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mã Vạch Ống Mẫu (Barcode):
                </label>
                <input
                  type="text"
                  placeholder="Để trống sẽ tự sinh mã 9 chữ số"
                  value={newBarcode}
                  onChange={e => setNewBarcode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-code focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chỉ Định Xét Nghiệm Cần Chạy:
                </label>
                <input
                  type="text"
                  value={newTests}
                  onChange={e => setNewTests(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-code focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 font-mono-code mt-0.5 block">
                  Ngăn cách bởi dấu phẩy (VD: CK-MB, TROPONIN, GLU, CREA)
                </span>
              </div>

              <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs font-mono-code text-red-800">
                Mẫu STAT sẽ được robot kim hút ưu tiên xử lý ngay tại chu trình kế tiếp.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStatModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Chèn Vào Hàng Đợi STAT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
