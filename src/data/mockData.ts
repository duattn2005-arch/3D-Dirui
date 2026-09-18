import { ReagentPosition, AssayResult, BatchItem, OpticalWavelength } from '../types';

export interface MachineInfo {
  id: string;
  name: string;
  category: string;
  throughput: string;
  typeBadge: string;
  description: string;
  details: {
    label: string;
    value: string;
  }[];
  specifications: {
    title: string;
    desc: string;
    icon: string;
  }[];
}

export const MACHINE_MODELS: Record<string, MachineInfo> = {
  'CS-T240': {
    id: 'CS-T240',
    name: 'DIRUI CS-T240',
    category: 'Máy Phân Tích Sinh Hóa Tự Động Để Bàn (Auto-Chemistry Analyzer)',
    throughput: '240 Test/giờ (360 T/H có ISE)',
    typeBadge: 'Đang Chọn - Chuẩn Service Manual',
    description: 'Máy xét nghiệm sinh hóa tự động để bàn hiệu năng cao cấu trúc chuẩn "2 mâm + 1 kim + 1 cánh khuấy", đo quang toàn trình 49 điểm, 12 bước sóng cách xạ sau.',
    details: [
      { label: 'Khay hóa chất & mẫu:', value: '67 vị trí (21 mẫu + 45 thuốc thử + 1 vị trí #45 tẩy rửa)' },
      { label: 'Mâm cóng phản ứng:', value: '120 cóng (6 bộ × 20 cóng, quang trình 6mm)' },
      { label: 'Chu kỳ phân tích:', value: '15 giây/chu kỳ (Working period: 15s)' },
      { label: 'Thể tích phản ứng:', value: '150 - 550 μL (Hút mẫu 3-35 μL, Thuốc thử 10-350 μL)' },
      { label: 'Nhiệt độ buồng ủ:', value: '37.0°C ± 0.1°C tuần hoàn nước PID (que đun 200W)' },
      { label: 'Bảo quản thuốc thử:', value: '5°C - 15°C Peltier bán dẫn 24/7 (dòng tải > 5A)' }
    ],
    specifications: [
      {
        title: 'Cấu Trúc Chuẩn "2 Mâm + 1 Kim + 1 Cánh Khuấy"',
        desc: '1 mâm phản ứng 120 cóng, 1 mâm thuốc thử & mẫu 67 vị trí, 1 kim hút tích hợp mẫu & hóa chất với cảm biến điện dung LLD và chống va chạm, 1 cánh khuấy xoắn tráng men Teflon.',
        icon: 'precision_manufacturing'
      },
      {
        title: 'Quang Phổ Kế Cách Xạ Sau 12 Bước Sóng',
        desc: 'Hệ thống đo sau cách xạ (Grating rear spectrophotometry + diode array) thu nhận đồng thời 12 bước sóng cố định: 340, 380, 405, 450, 480, 505, 546, 570, 600, 660, 700, 750 nm. Đèn Halogen 12V/20W.',
        icon: 'science'
      },
      {
        title: 'Trạm Rửa Cóng 8 Điểm Dừng 12 Bước',
        desc: 'Trạm rửa tự động 4 cụm kim rửa đôi kết hợp đầu lau khô cuvette (wiping head block), rửa bằng nước ấm 34°C và dung dịch kiềm CS, hút chân không áp lực âm ≥ -70 kPa.',
        icon: 'sanitizer'
      },
      {
        title: 'Bảo Quản Thuốc Thử Bán Dẫn Peltier',
        desc: 'Khối làm mát nhiệt điện Peltier kép duy trì nhiệt độ 5°C - 15°C độc lập 24/7 với bộ nguồn riêng và cảm biến nhiệt độ DS18B20 kèm cảnh báo dòng tải < 5A.',
        icon: 'ac_unit'
      }
    ]
  },
  'CS-6400': {
    id: 'CS-6400',
    name: 'Dirui CS-6400',
    category: 'Hệ Thống Phân Tích Sinh Hóa Modular Hạng Nặng',
    throughput: '6400 T/H',
    typeBadge: 'Hạng Siêu Cao Tốc',
    description: 'Hệ thống tổ hợp sinh hóa modular tự động hóa hoàn toàn với băng chuyền vận chuyển mẫu đa chiều cho các trung tâm xét nghiệm lớn.',
    details: [
      { label: 'Cấu hình mô-đun:', value: '1 đến 4 Modules' },
      { label: 'Nạp mẫu liên tục:', value: 'Băng chuyền tự động' },
      { label: 'Tự động pha loãng:', value: 'Tích hợp sẵn' }
    ],
    specifications: [
      {
        title: 'Băng Tải Mẫu Đa Chiều Tự Động',
        desc: 'Băng chuyền servo đa điểm phân phối mẫu trực tiếp đến từng module đo mà không làm nghẽn hàng đợi.',
        icon: 'precision_manufacturing'
      },
      {
        title: 'Tổ Hợp Lên Tới 4 Modules',
        desc: 'Cho phép mở rộng linh hoạt công suất từ 1600 T/H lên tới 6400 T/H kết hợp module điện giải ISE.',
        icon: 'layers'
      },
      {
        title: 'Quản Lý Thuốc Thử Thông Minh',
        desc: 'Tự động luân chuyển và thay thế lọ hóa chất dự phòng khi đang vận hành mà không cần tạm dừng máy.',
        icon: 'autorenew'
      }
    ]
  },
  'FUS-2000': {
    id: 'FUS-2000',
    name: 'Dirui FUS-2000',
    category: 'Hệ Thống Phân Tích Tế Bào & Cặn Lắng Nước Tiểu Hybrid',
    throughput: '120-240 T/H',
    typeBadge: 'Tích Hợp Cặn Lắng',
    description: 'Thiết bị phân tích nước tiểu hybrid tích hợp 10-14 thông số sinh hóa que thử và chụp ảnh cặn lắng tế bào bằng thị giác máy học.',
    details: [
      { label: 'Kỹ thuật tế bào:', value: 'Phẳng dòng & AI Vision' },
      { label: 'Phân loại tự động:', value: 'Hồng cầu, Bạch cầu, Trụ' },
      { label: 'Mẫu không ly tâm:', value: 'Đo trực tiếp' }
    ],
    specifications: [
      {
        title: 'Thị Giác AI Nhận Diện Tế Bào',
        desc: 'Hệ thống camera kính hiển vi độ phân giải cực cao phân loại tự động 12 loại thành phần hữu hình trong nước tiểu.',
        icon: 'biotech'
      },
      {
        title: 'Kỹ Thuật Phẳng Dòng Dynamic Flow',
        desc: 'Định hướng tế bào di chuyển đơn lớp, đảm bảo tiêu cự chụp ảnh sắc nét 100% không trùng lặp.',
        icon: 'water'
      },
      {
        title: 'Không Cần Ly Tâm Mẫu',
        desc: 'Rút ngắn thời gian trả kết quả xuống chỉ còn 1.5 phút/mẫu, bảo vệ tính toàn vẹn của tế bào hồng cầu dị dạng.',
        icon: 'speed'
      }
    ]
  },
  'H-800': {
    id: 'H-800',
    name: 'Dirui H-800',
    category: 'Máy Phân Tích Nước Tiểu Que Thử Tự Động',
    throughput: '240-500 T/H',
    typeBadge: 'Que Thử Siêu Tốc',
    description: 'Hệ thống phân tích que thử nước tiểu tự động hoàn toàn, khay nạp 200 que thử tự động với tính năng đo tỷ trọng khúc xạ kế chính xác.',
    details: [
      { label: 'Hộp chứa que thử:', value: '200 que tự động' },
      { label: 'Phương pháp đo:', value: 'Khúc xạ kế & Quang phổ' },
      { label: 'Kiểm soát độ ẩm:', value: 'Hộp kín Peltier' }
    ],
    specifications: [
      {
        title: 'Khay Nạp 200 Que Thử Tự Động',
        desc: 'Cơ chế hút nhả que thử chân không mượt mà, ngăn ngừa kẹt que và bảo vệ lớp hóa chất khô.',
        icon: 'inventory_2'
      },
      {
        title: 'Đo Tỷ Trọng Khúc Xạ Kế',
        desc: 'Tự động bù trừ màu mẫu nước tiểu đục hoặc có máu, cho kết quả SG chuẩn xác tuyệt đối.',
        icon: 'straighten'
      },
      {
        title: 'Bảo Quản Que Thử Chống Ẩm',
        desc: 'Hộp trữ que tích hợp gói hút ẩm và hệ thống cảm biến độ ẩm kín, kéo dài tuổi thọ dải que thử.',
        icon: 'cloud_sync'
      }
    ]
  }
};

export const INITIAL_ASSAYS: AssayResult[] = [
  {
    id: '1',
    name: 'Glucose (GLU)',
    code: 'GLU',
    method: 'GOD-PAP',
    value: 5.42,
    unit: 'mmol/L',
    refRange: '3.9 - 6.4 mmol/L',
    status: 'NORMAL',
    time: '10:42:15'
  },
  {
    id: '2',
    name: 'ALT / SGPT',
    code: 'ALT',
    method: 'IFCC 37°C',
    value: 24.1,
    unit: 'U/L',
    refRange: '< 40 U/L',
    status: 'NORMAL',
    time: '10:43:02'
  },
  {
    id: '3',
    name: 'Creatinine (CREA)',
    code: 'CREA',
    method: 'Jaffé Kinetic',
    value: 78.0,
    unit: 'μmol/L',
    refRange: '53 - 106 μmol/L',
    status: 'NORMAL',
    time: '10:44:18'
  },
  {
    id: '4',
    name: 'Hemoglobin A1c',
    code: 'HbA1c',
    method: 'Miễn Dịch Độ Đục',
    value: 5.8,
    unit: '%',
    refRange: '4.0 - 6.0 %',
    status: 'NORMAL',
    time: '10:45:00'
  },
  {
    id: '5',
    name: 'Urea (UREA)',
    code: 'UREA',
    method: 'Urease GLDH',
    value: 4.8,
    unit: 'mmol/L',
    refRange: '2.8 - 7.2 mmol/L',
    status: 'NORMAL',
    time: '10:46:12'
  },
  {
    id: '6',
    name: 'Cholesterol TP (CHO)',
    code: 'CHO',
    method: 'CHOD-PAP',
    value: 5.12,
    unit: 'mmol/L',
    refRange: '3.1 - 5.2 mmol/L',
    status: 'NORMAL',
    time: '10:47:05'
  }
];

export const INITIAL_REAGENTS: ReagentPosition[] = Array.from({ length: 67 }, (_, i) => {
  const id = i + 1;
  const names = [
    { name: 'Glucose R1/R2', code: 'GLU', max: 70 },
    { name: 'ALT/SGPT Kinetic', code: 'ALT', max: 70 },
    { name: 'Creatinine Jaffé', code: 'CREA', max: 70 },
    { name: 'AST/SGOT Enzymatic', code: 'AST', max: 70 },
    { name: 'Urea Nitrogen', code: 'UREA', max: 70 },
    { name: 'Total Protein Biuret', code: 'TP', max: 70 },
    { name: 'Albumin BCG', code: 'ALB', max: 70 },
    { name: 'Total Bilirubin DSA', code: 'TBIL', max: 20 },
    { name: 'Direct Bilirubin', code: 'DBIL', max: 20 },
    { name: 'Triglycerides GPO', code: 'TRIG', max: 70 },
    { name: 'Cholesterol Esterase', code: 'CHOL', max: 70 },
    { name: 'Uric Acid Uricase', code: 'UA', max: 70 },
    { name: 'Alkaline Phosphatase', code: 'ALP', max: 70 },
    { name: 'Gamma-GT', code: 'GGT', max: 70 },
    { name: 'CK-NAC / CK-MB', code: 'CK-MB', max: 20 },
    { name: 'Lactate Dehydrogenase', code: 'LDH', max: 70 },
    { name: 'Amylase EPS-G7', code: 'AMY', max: 20 },
    { name: 'C-Reactive Protein', code: 'CRP', max: 20 },
    { name: 'Calcium Arsenazo III', code: 'CA', max: 70 },
    { name: 'Inorganic Phosphorus', code: 'PHOS', max: 70 },
    { name: 'Magnesium Xylidyl', code: 'MG', max: 20 },
    { name: 'Iron Ferrozine', code: 'FE', max: 20 }
  ];

  // Position 45 is the dedicated Detergent position for CS-anti-bacterial phosphor-free detergent
  if (id === 45) {
    return {
      id: 45,
      type: 'R1',
      name: 'CS-Phosphor-Free Detergent / CS-Alkaline',
      code: 'DETERGENT-45',
      remainingMl: 65,
      maxMl: 70,
      remainingTests: 650,
      lotNumber: 'DIR-CS-CLN-2026',
      expiryDate: '2027-12-31',
      status: 'OPTIMAL'
    };
  } else if (id <= 46) {
    // 45 reagent positions (1-44 and 46)
    const item = names[(id - 1) % names.length];
    const rem = Math.floor(item.max * (0.5 + ((id * 7) % 5) * 0.1));
    return {
      id,
      type: id % 2 === 1 ? 'R1' : 'R2',
      name: item.name,
      code: item.code,
      remainingMl: rem,
      maxMl: item.max,
      remainingTests: Math.floor(rem * 6.2),
      lotNumber: `DIR-LOT-${202600 + id}`,
      expiryDate: '2027-06-30',
      status: rem < 12 ? 'LOW' : 'OPTIMAL'
    };
  } else {
    // Positions 47 to 67: 21 Routine sample positions
    const sampleIndex = id - 46;
    return {
      id,
      type: 'SAMPLE',
      name: `Vị trí mẫu phẩm #${sampleIndex} (Khay 21)`,
      code: `SMP-POS-${sampleIndex}`,
      remainingMl: 2.2,
      maxMl: 3.5,
      remainingTests: 12,
      lotNumber: `SMP-TUBE-${1000 + sampleIndex}`,
      expiryDate: '2026-09-18',
      status: 'OPTIMAL'
    };
  }
});

export const OPTICAL_WAVELENGTHS: OpticalWavelength[] = [
  { nm: 340, lampIntensity: 98.4, strayLightIndex: 0.008, absorbance: 0.245, status: 'PASS' },
  { nm: 380, lampIntensity: 99.1, strayLightIndex: 0.006, absorbance: 0.312, status: 'PASS' },
  { nm: 405, lampIntensity: 99.8, strayLightIndex: 0.005, absorbance: 0.485, status: 'PASS' },
  { nm: 450, lampIntensity: 97.5, strayLightIndex: 0.007, absorbance: 0.521, status: 'PASS' },
  { nm: 480, lampIntensity: 98.9, strayLightIndex: 0.006, absorbance: 0.610, status: 'PASS' },
  { nm: 505, lampIntensity: 100.0, strayLightIndex: 0.004, absorbance: 1.284, status: 'CALIBRATED' },
  { nm: 546, lampIntensity: 99.4, strayLightIndex: 0.005, absorbance: 0.812, status: 'PASS' },
  { nm: 570, lampIntensity: 98.2, strayLightIndex: 0.006, absorbance: 0.734, status: 'PASS' },
  { nm: 600, lampIntensity: 97.9, strayLightIndex: 0.007, absorbance: 0.590, status: 'PASS' },
  { nm: 660, lampIntensity: 98.6, strayLightIndex: 0.006, absorbance: 0.420, status: 'PASS' },
  { nm: 700, lampIntensity: 99.2, strayLightIndex: 0.005, absorbance: 0.106, status: 'PASS' },
  { nm: 750, lampIntensity: 97.6, strayLightIndex: 0.008, absorbance: 0.089, status: 'PASS' }
];

export const INITIAL_BATCH_SAMPLES: BatchItem[] = [
  {
    id: 'SMP-8904-01',
    tubeBarcode: '984021001',
    patientName: 'Nguyễn Văn An',
    gender: 'M',
    age: 52,
    sampleType: 'Serum',
    status: 'COMPLETED',
    tests: ['GLU', 'ALT', 'CREA', 'UREA'],
    priority: false,
    cupPosition: 1,
    progress: 100
  },
  {
    id: 'SMP-8904-02',
    tubeBarcode: '984021002',
    patientName: 'Trần Thị Mai',
    gender: 'F',
    age: 38,
    sampleType: 'Serum',
    status: 'ANALYZING',
    tests: ['GLU', 'HbA1c', 'CHO', 'TRIG'],
    priority: false,
    cupPosition: 2,
    progress: 68
  },
  {
    id: 'SMP-8904-STAT-03',
    tubeBarcode: '984029999',
    patientName: 'Lê Hoàng Long [CẤP CỨU]',
    gender: 'M',
    age: 64,
    sampleType: 'Plasma',
    status: 'STAT',
    tests: ['CK-MB', 'TROPONIN-I', 'GLU', 'CREA'],
    priority: true,
    cupPosition: 3,
    progress: 82
  },
  {
    id: 'SMP-8904-04',
    tubeBarcode: '984021004',
    patientName: 'Phạm Hồng Nhung',
    gender: 'F',
    age: 29,
    sampleType: 'Serum',
    status: 'PENDING',
    tests: ['ALT', 'AST', 'GGT', 'TBIL'],
    priority: false,
    cupPosition: 4,
    progress: 0
  },
  {
    id: 'SMP-8904-05',
    tubeBarcode: '984021005',
    patientName: 'Đặng Quốc Huy',
    gender: 'M',
    age: 45,
    sampleType: 'Serum',
    status: 'PENDING',
    tests: ['GLU', 'CREA', 'UA'],
    priority: false,
    cupPosition: 5,
    progress: 0
  }
];
