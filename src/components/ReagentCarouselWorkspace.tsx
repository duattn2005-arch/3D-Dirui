import React, { useState } from 'react';
import { INITIAL_REAGENTS } from '../data/mockData';
import { ReagentPosition } from '../types';

export const ReagentCarouselWorkspace: React.FC = () => {
  const [reagents, setReagents] = useState<ReagentPosition[]>(INITIAL_REAGENTS);
  const [selectedSlotId, setSelectedSlotId] = useState<number>(1);
  const [filterType, setFilterType] = useState<'ALL' | 'R1' | 'R2' | 'SAMPLE' | 'EMPTY'>('ALL');
  const [isScanning, setIsScanning] = useState(false);

  const selectedSlot = reagents.find(r => r.id === selectedSlotId) || reagents[0];

  const handleRefillSlot = () => {
    setIsScanning(true);
    setTimeout(() => {
      setReagents(prev =>
        prev.map(r =>
          r.id === selectedSlotId
            ? {
                ...r,
                remainingMl: r.maxMl,
                remainingTests: Math.floor(r.maxMl * 6.5),
                status: 'OPTIMAL',
                lotNumber: `DIR-LOT-${202699 + r.id}`
              }
            : r
        )
      );
      setIsScanning(false);
    }, 1000);
  };

  const filteredReagents = reagents.filter(r => {
    if (filterType === 'ALL') return true;
    return r.type === filterType;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#00677d] bg-[#b3ebff]/60 px-2 py-0.5 rounded font-bold font-mono-code">
              Mâm Hóa Chất &amp; Mẫu Bệnh Phẩm CS-T240
            </span>
            <span className="text-xs text-slate-500 font-mono-code">Khối Làm Lạnh Bán Dẫn Peltier 5°C - 15°C</span>
          </div>
          <h2 className="text-xl font-bold text-[#004976] mt-1">
            Mâm Thuốc Thử &amp; Mẫu Bệnh Phẩm 67 Vị Trí (DIRUI CS-T240)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            45 vị trí thuốc thử R1/R2 (lọ 20ml, 70ml, 100ml) + 21 vị trí mẫu + 1 vị trí cố định #45 dung dịch tẩy rửa kiềm CS-phosphor-free.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-slate-50 rounded-lg border border-slate-200 text-right font-mono-code">
            <span className="text-[10px] text-slate-500 uppercase block">Nhiệt độ khay</span>
            <span className="text-base font-bold text-[#00677d]">6.4 °C</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Carousel (Left) + Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Interactive Grid / Carousel positions */}
        <div className="lg:col-span-7 p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 font-mono-code">Lọc vị trí:</span>
              <div className="flex flex-wrap gap-1 font-mono-code text-[11px]">
                {(['ALL', 'R1', 'R2', 'SAMPLE', 'EMPTY'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded transition-all font-semibold ${
                      filterType === type
                        ? 'bg-[#004976] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    type="button"
                  >
                    {type === 'ALL' ? 'Tất cả (67)' : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono-code text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004976]"></span> R1
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> R2
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00677d]"></span> Sample
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Tẩy #45
              </span>
            </div>
          </div>

          {/* Slot Matrix 67 positions */}
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 max-h-[420px] overflow-y-auto">
            {filteredReagents.map(slot => {
              const isSelected = selectedSlotId === slot.id;
              let badgeColor = 'bg-slate-200 text-slate-600';
              if (slot.id === 45) {
                badgeColor = 'bg-emerald-600 text-white';
              } else if (slot.type === 'R1') {
                badgeColor = 'bg-[#004976] text-white';
              } else if (slot.type === 'R2') {
                badgeColor = 'bg-amber-500 text-white';
              } else if (slot.type === 'SAMPLE') {
                badgeColor = 'bg-[#00677d] text-white';
              }

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`relative p-2 rounded-lg text-center flex flex-col items-center justify-between transition-all font-mono-code ${
                    isSelected
                      ? 'ring-2 ring-[#00629b] bg-white shadow-md scale-105'
                      : 'bg-white hover:bg-slate-100 border border-slate-200/60'
                  }`}
                  type="button"
                >
                  <span className={`text-[9px] font-bold px-1 rounded ${badgeColor}`}>
                    {slot.id === 45 ? 'CLN' : slot.type === 'EMPTY' ? '—' : slot.type}
                  </span>
                  <span className="text-xs font-bold text-slate-800 my-1">#{slot.id}</span>
                  <span className="text-[9px] text-slate-500 truncate w-full">
                    {slot.type === 'EMPTY' ? 'Trống' : `${slot.remainingMl}ml`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Slot Inspector & Refill / Barcode Scanner */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-mono-code uppercase block">Chi tiết vị trí</span>
                <h3 className="text-base font-bold text-slate-900 font-mono-code">
                  Vị trí #{selectedSlot.id} — {selectedSlot.name}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold font-mono-code ${
                  selectedSlot.status === 'OPTIMAL'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : selectedSlot.status === 'LOW'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {selectedSlot.status}
              </span>
            </div>

            <div className="flex flex-col gap-3 font-mono-code text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Phân loại thuốc thử:</span>
                <span className="font-bold text-slate-900">{selectedSlot.type}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Mã hóa chất (Code):</span>
                <span className="font-bold text-[#004976]">{selectedSlot.code}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Thể tích còn lại:</span>
                <span className="font-bold text-slate-900">
                  {selectedSlot.remainingMl} mL / {selectedSlot.maxMl} mL
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Số lượng test ước tính:</span>
                <span className="font-bold text-[#00677d]">{selectedSlot.remainingTests} tests</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Số lô sản xuất (Lot):</span>
                <span className="font-bold text-slate-900">{selectedSlot.lotNumber}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Hạn sử dụng:</span>
                <span className="font-bold text-slate-900">{selectedSlot.expiryDate}</span>
              </div>
            </div>

            {/* Level progress bar */}
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-500">Mức dung tích khả dụng:</span>
                <span className="font-bold text-[#004976]">
                  {selectedSlot.maxMl > 0
                    ? Math.round((selectedSlot.remainingMl / selectedSlot.maxMl) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#004976] h-full rounded-full transition-all"
                  style={{
                    width: `${
                      selectedSlot.maxMl > 0
                        ? (selectedSlot.remainingMl / selectedSlot.maxMl) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleRefillSlot}
                disabled={isScanning}
                className="w-full py-2.5 bg-[#004976] hover:bg-[#00629b] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60"
                type="button"
              >
                <span className={`material-symbols-outlined text-[18px] ${isScanning ? 'animate-spin' : ''}`}>
                  {isScanning ? 'qr_code_scanner' : 'add_circle'}
                </span>
                <span>
                  {isScanning
                    ? 'Đang Quét Barcode & Nạp Lọ Mới...'
                    : 'Nạp Lọ Hóa Chất Mới / Quét Barcode'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
