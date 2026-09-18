import React from 'react';

interface EmergencyStopModalProps {
  isOpen: boolean;
  onReset: () => void;
  onClose: () => void;
}

export const EmergencyStopModal: React.FC<EmergencyStopModalProps> = ({
  isOpen,
  onReset,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-red-600 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-red-600">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-red-600 animate-bounce">
              emergency
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              E-STOP: DỪNG KHẨN CẤP ĐÃ ĐƯỢC KÍCH HOẠT
            </h3>
            <p className="text-xs text-red-600 font-mono-code font-bold">
              Emergency Mechanical Stop Triggered
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs font-mono-code text-red-800 leading-relaxed">
          <p className="font-bold mb-1">TRẠNG THÁI AN TOÀN PHẦN CỨNG:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Toàn bộ động cơ servo trục X/Y/Z đã ngắt điện lực kéo.</li>
            <li>Cụm kim hút đã dừng ngay lập tức tại tọa độ hiện thời.</li>
            <li>Cánh khuấy Teflon và khay xoay Carousel đã khóa phanh điện từ.</li>
            <li>Buồng làm lạnh Peltier vẫn duy trì 4.2°C để bảo vệ mẫu &amp; thuốc thử.</li>
          </ul>
        </div>

        <p className="text-xs text-slate-600">
          Vui lòng kiểm tra cơ học bằng mắt trước khi khôi phục nguồn điện để đảm bảo không có kim hút nào bị kẹt hoặc va chạm cuvette.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            type="button"
          >
            Đóng Thông Báo (Giữ Halted)
          </button>
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Đặt Lại Trạng Thái &amp; Khởi Động Lại Hệ Thống</span>
          </button>
        </div>
      </div>
    </div>
  );
};
