import React, { useEffect, useRef, useState, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPreset, MachineModelId } from '../types';

export type ViewMode = 'full' | 'internals' | 'xray';

export interface ComponentFocusDetail {
  id: string;
  name: string;
  category: 'Electronic' | 'Hydraulic' | 'Optical' | 'Mechanical' | 'Thermal';
  description: string;
  specs: string[];
  targetPos: [number, number, number];
  cameraPos: [number, number, number];
}

const MACHINE_COMPONENTS: ComponentFocusDetail[] = [
  {
    id: 'carousel',
    name: 'Khay Hóa Chất & Mẫu Phẩm 67 Vị Trí (Sample & Reagent Disk)',
    category: 'Mechanical',
    description: 'Mâm xoay màu vàng đặc trưng của Dirui CS-T240 gồm chính xác 67 vị trí: 21 vị trí mẫu bệnh phẩm, 45 vị trí thuốc thử R1/R2 và 1 vị trí dung dịch rửa CS tại vị trí #45. Làm lạnh bởi hệ Peltier 5°C - 15°C.',
    specs: ['Sức chứa: 67 vị trí chuẩn (21 mẫu + 45 thuốc thử + 1 dung dịch tẩy #45)', 'Dung tích lọ: 20mL, 70mL, 100mL & cóng mẫu Φ14×37mm', 'Động cơ: Động cơ bước điều khiển bởi Reagent & Sample Board', 'Làm lạnh: Bán dẫn Peltier liên tục 24/7 duy trì 5°C - 15°C (chuẩn 6°C - 10°C)'],
    targetPos: [6.0, 7.6, 0.8],
    cameraPos: [6.0, 14.5, 12.0]
  },
  {
    id: 'optics',
    name: 'Mâm Cóng Phản Ứng 120 Vị Trí & Bể Ủ 37°C (Reaction Disk & Water Bath)',
    category: 'Optical',
    description: 'Mâm phản ứng chứa 120 cóng nhựa quang học độ cứng cao (6 bộ x 20 cóng, quang trình 6mm), ngâm trong bể ủ tuần hoàn nước 37.0°C ± 0.1°C với que đun 200W và bơm MP-20RZ.',
    specs: ['Cóng phản ứng: 120 cóng (6 bộ tháo lắp × 20 cóng quang học 6mm)', 'Bể nhiệt: Tuần hoàn nước 37.0°C ± 0.1°C điều khiển PID (que đun 200W Z1)', 'Quang phổ kế: Concave Grating đo sau cách xạ 12 bước sóng (340-750nm)', 'Đèn phát sáng: Quartz Halogen 12V/20W tuổi thọ cao kèm ống tản nhiệt'],
    targetPos: [-2.8, 7.6, 0.6],
    cameraPos: [-2.8, 14.0, 11.5]
  },
  {
    id: 'pipette',
    name: 'Cụm Kim Hút Đa Năng, Cánh Khuấy & Trạm Rửa 8 Điểm Dừng',
    category: 'Mechanical',
    description: 'Bao gồm 1 kim hút tích hợp mẫu/thuốc thử với cảm biến mức chất lỏng LLD, 1 cánh khuấy xoắn tráng men Teflon dẫn động bởi motor cốc rỗng, và trạm rửa cóng tự động 8 điểm dừng 12 bước.',
    specs: ['Kim hút: 1 kim tích hợp mẫu (3-35 μL) & thuốc thử (10-350 μL)', 'Cảm biến: Điện dung LLD phát hiện bề mặt chất lỏng và chống va chạm 3D', 'Cánh khuấy: Tráng men Teflon, motor cốc rỗng tốc độ cao (IC U8)', 'Trạm rửa: 8 điểm dừng 12 bước với 4 kim đôi + đầu xốp lau khô (IC U7)'],
    targetPos: [-8.5, 8.2, 0.2],
    cameraPos: [-8.5, 13.5, 10.0]
  },
  {
    id: 'main_control_board',
    name: 'Bo Mạch Điều Khiển Chính (Main Control Board - Mục 6.4.3 / SAP 2001488)',
    category: 'Electronic',
    description: 'Trái tim xử lý trung tâm của CS-T240: CPU Master điều phối hệ thống qua bus CAN, giao tiếp máy tính qua RS-232 DB9, điều khiển van xả SV6/SV10/SV13, giám sát cảm biến nhiệt J05 và áp suất chân không.',
    specs: ['CPU: Master MCU & mạng bus CAN giao tiếp các bo mạch phụ', 'Cổng giao tiếp: Cổng RS-232 DB9 (115200 bps) & RJ45 Debug', 'Lái van: Transistor công suất lái van SV6, SV10, SV13', 'Cảm biến: Socket J05 (Nhiệt độ bể ủ 37°C), cảm biến áp suất chân không'],
    targetPos: [-3.0, 4.8, -4.5],
    cameraPos: [-3.0, 9.5, 8.0]
  },
  {
    id: 'sample_reagent_board',
    name: 'Bo Mạch Mâm Mẫu & Hóa Chất & Kim Hút (Reagent & Sample Board - Mục 6.4.7 / SAP 2001491)',
    category: 'Electronic',
    description: 'Điều khiển động cơ mâm 67 vị trí, động cơ bước Z/R của kim hút, mạch cảm biến điện dung LLD (J6/J7) và đặc biệt tích hợp IC U13 điều khiển bơm tiêm syringe 500uL qua jack J103/P103.',
    specs: ['Lái động cơ mâm: Bước vi mô điều khiển mâm 67 vị trí', 'Lái kim hút: 2 kênh động cơ nâng hạ Z và xoay ngang R', 'Lái bơm Syringe: IC U13 điều khiển bơm tiêm 500uL qua Jack J103/P103', 'Cảm biến LLD: Mạch khuếch đại điện dung giắc J6, J7 & cổng Barcode Code 128'],
    targetPos: [5.5, 4.8, -4.0],
    cameraPos: [5.5, 9.5, 8.0]
  },
  {
    id: 'reaction_disk_board',
    name: 'Bo Mạch Mâm Phản Ứng (Reaction Disk Board - Mục 6.4.5 / SAP 2001489)',
    category: 'Electronic',
    description: 'Đặt trực tiếp dưới mâm cóng: IC U3 điều khiển động cơ bước 2 pha PK266M-01B, đọc tín hiệu từ 2 optocoupler đếm 120 xung răng đĩa mã (J704/J705) và cảm biến vị trí gốc cuvette #71.',
    specs: ['Lái động cơ: IC U3 điều khiển động cơ bước PK266M-01B', 'Đếm bước: 2 optocoupler đếm đĩa mã 120 xung (Jack J704 & J705)', 'Vị trí Reset: Cảm biến quang định vị điểm gốc cuvette số 71', 'Vị trí vật lý: Đặt trực tiếp dưới đáy cụm mâm cóng phản ứng'],
    targetPos: [-2.8, 3.2, 0.6],
    cameraPos: [-2.8, 7.5, 9.5]
  },
  {
    id: 'rinsing_mixing_board',
    name: 'Bo Mạch Trạm Rửa & Cánh Khuấy (Rinsing & Mixing Board - Mục 6.4.6 / SAP 2001490)',
    category: 'Electronic',
    description: 'Quản lý toàn bộ cơ cấu cơ điện khuấy và rửa cóng: IC U8 điều khiển motor khuấy cốc rỗng, IC U7 điều khiển motor nâng trạm rửa, cổng quang P02 và mảng điều khiển 8 van điện từ SV1-SV5, SV7-SV9, SV11.',
    specs: ['Lái motor khuấy: IC U8 điều khiển motor cốc rỗng tốc độ cao', 'Lái motor trạm rửa: IC U7 điều khiển trục vít nâng hạ', 'Cảm biến giới hạn: Cổng P02 kết nối cặp quang trở giới hạn hành trình', 'Mảng van điện từ: Lái 8 van SV1-SV5, SV7, SV8, SV9, SV11'],
    targetPos: [-2.8, 4.8, -3.2],
    cameraPos: [-2.8, 8.5, 7.5]
  },
  {
    id: 'single_syringe_pump',
    name: 'Bơm Tiêm Vi Lượng Đơn Piston Thủy Tinh 500uL (SAP 2003863)',
    category: 'Hydraulic',
    description: 'CS-T240 chỉ sử dụng DUY NHẤT 1 cụm bơm tiêm vi lượng 500 μL dùng chung cho cả mẫu và thuốc thử. Xi-lanh thủy tinh Borosilicate 500uL, piston gốm/Teflon, vít me bi và van xoay 3 ngả.',
    specs: ['Dung tích danh định: 500 μL thủy tinh Borosilicate (SAP: 2003863)', 'Độ phân giải: 0.1 μL/bước xung động cơ, CV < 1.0%', 'Điều khiển: IC U13 trên Reagent/Sample Board qua connector J103/P103', 'Cảm biến gốc: Optocoupler P043 định vị hành trình dưới'],
    targetPos: [-6.8, 4.2, 3.2],
    cameraPos: [-6.8, 7.5, 14.0]
  },
  {
    id: 'ssr_board',
    name: 'Bo Mạch Rơ-Le Bán Dẫn Công Suất (Solid-State Relay Board - Mục 6.4.4 / SAP 2000398)',
    category: 'Electronic',
    description: 'Bo mạch công suất cách ly quang với 4 module rơ-le bán dẫn SSR1-SSR4, đóng cắt điện áp xoay chiều cho que gia nhiệt 37°C 200W, que đun bình nước 180W, bơm tuần hoàn MP-20RZ và nguồn đèn Halogen.',
    specs: ['SSR1: Đóng cắt que đun bể ủ 37°C công suất 200W (Z1)', 'SSR2: Đóng cắt que đun nước rửa ấm 34°C công suất 180W (Z5)', 'SSR3: Cấp nguồn bơm dẫn động từ tuần hoàn nước MP-20RZ (Z6/Z8)', 'SSR4: Cấp nguồn đóng mở đèn Halogen 12V 20W tuổi thọ cao'],
    targetPos: [7.5, 2.5, 4.0],
    cameraPos: [7.5, 6.5, 13.5]
  },
  {
    id: 'cooling_board',
    name: 'Bo Mạch Làm Lạnh Bán Dẫn Peltier (Cooling Board - Mục 6.4.2 / SAP 2001492)',
    category: 'Thermal',
    description: 'Kiểm soát nhiệt độ khay hóa chất 5°C - 15°C. Tích hợp màn hình LED 7 đoạn kép hiển thị nhiệt độ thực tế, mạch giám sát dòng điện chip Peltier FPH1-12708AC (> 5A) và điều khiển quạt DC 120mm.',
    specs: ['Hiển thị: LED 7 đoạn kép hiển thị nhiệt độ thực tế buồng hóa chất', 'Dòng tải: Giám sát dòng điện chip Peltier FPH1-12708AC chuẩn > 5A', 'Dải nhiệt độ: 5°C - 15°C (nhiệt độ làm việc tối ưu 6°C - 10°C)', 'Tản nhiệt: Cụm nhôm đùn đa cánh công suất lớn + quạt DC 120mm'],
    targetPos: [6.2, 4.5, 1.0],
    cameraPos: [6.2, 8.5, 12.0]
  },
  {
    id: 'ad_optical_board',
    name: 'Bo Mạch Thu Nhận Dữ Liệu Quang 12 Kênh A/D (AD Board - Mục 6.4.9 / SAP 2001962)',
    category: 'Optical',
    description: 'Gắn trực tiếp tại khe hội tụ sau buồng quang phổ kế holographic concave grating. Gồm 12 photodiode detectors (340-750nm), 12 bộ tiền khuếch đại, mạch biến đổi Logarit và chip ADC 24-bit.',
    specs: ['Vị trí: Ốp sát khe đo buồng quang phổ kế cách xạ phẳng', '12 Bước sóng: 340, 380, 405, 450, 480, 505, 546, 570, 600, 660, 700, 750 nm', 'Độ phân giải: 24-bit Sigma-Delta ADC cực nhạy (Dải hấp thụ 0 - 3.300 Abs)', 'Chống nhiễu: Vỏ bọc hợp kim nhôm đúc triệt tiêu ánh sáng tạp'],
    targetPos: [1.8, 5.2, -5.2],
    cameraPos: [1.8, 9.5, 6.0]
  },
  {
    id: 'fluidics_manifold',
    name: 'Cụm Thủy Lực: Khối 5 Van Z11/Z35 & Bộ Chia Nước Z7 & Bình Khử Khí Z40',
    category: 'Hydraulic',
    description: 'Phân hệ đường ống chất lỏng chuẩn Dirui CS-T240 gồm cụm 5 van điện từ Z11/Z35 (SV1-SV5), bộ phân phối nước 7 ngả Z7, bình khử bọt khí hòa tan Z40, bình gom chân không Z25 và bơm từ MP-20RZ.',
    specs: ['Cụm 5 van: Solenoid valves SV1 - SV5 (rửa cóng, xả kiệt, cấp nước)', 'Bộ chia nước: 7 ngả Z7 bằng vật liệu chịu áp lực và ăn mòn hóa chất', 'Khử bọt khí: Degassing cylinder Z40 loại bỏ vi bọt khí trong dòng hút', 'Bình chân không: Bình inox Z25 duy trì áp lực âm buồng hút ≥ -70 kPa'],
    targetPos: [-1.2, 3.8, 3.5],
    cameraPos: [-1.2, 7.5, 14.0]
  },
  {
    id: 'psu_module',
    name: 'Bộ Nguồn Công Nghiệp N1-N4 & Bộ Lọc Nguồn EMI (Mục 6.4.1)',
    category: 'Electronic',
    description: 'Bộ nguồn y tế cách ly cao N1-N4 cung cấp điện áp ổn định: +24V (động cơ, van), +12V (Peltier, quạt, đèn), +5V và ±15V (CPU, bo mạch quang AD). Kèm bộ lọc nhiễu EMI, cầu chì F6.3AL250V và công tắc S1.',
    specs: ['Công suất: Cụm nguồn xung y tế đa ngõ ra công suất 650VA', 'Điện áp ra: +24VDC (Motor/Van), +12VDC (Peltier/Lamp), +5VDC/±15VDC (Logic)', 'Bảo vệ: Cầu chì ống F6.3AL250V (5×20mm) & chống sét lan truyền', 'Đầu vào: AC 220V/50Hz với bộ lọc nguồn EMI triệt tiêu xung gai'],
    targetPos: [7.5, 3.2, 2.5],
    cameraPos: [7.5, 6.0, 13.5]
  },
  {
    id: 'chassis_frame',
    name: 'Khung Thép Đúc Chịu Lực & Vách Ngăn Phân Khoang Cách Ly',
    category: 'Mechanical',
    description: 'Khung máy chịu lực bằng thép tấm định hình và thép đúc sơn tĩnh điện. Tích hợp vách ngăn cách ly ngăn tràn chất lỏng từ khoang làm việc xuống bo mạch, các vách ngăn che chắn nhiễu điện từ và 4 chân cao su triệt tiêu rung chấn.',
    specs: ['Vật liệu: Thép kết cấu dày sơn tĩnh điện chống ăn mòn hóa chất', 'Vách cách ly: Tấm inox ngăn nước giữa khoang hóa chất và khoang điện tử', 'Phân khoang: 4 khoang độc lập (Điện tử, Thủy lực, Quang học, Nguồn & SSR)', 'Tiếp địa: Cụm bu-lông đồng và dây tiếp đất chuyên dụng vàng-xanh lá'],
    targetPos: [0, 4.0, 0],
    cameraPos: [0, 10.0, 22.0]
  },
  {
    id: 'hood',
    name: 'Nắp Máy Vỏ Sò Kính Hổ Phách & Ty Ben Khí Nén (SAP 1007853)',
    category: 'Mechanical',
    description: 'Nắp bảo vệ khoang phản ứng kiểu lật vỏ sò với kính acrylic màu hổ phách (amber) lọc tia UV, được nâng đỡ bởi cặp piston ty thủy lực trợ lực khí nén mạ crom hai bên (SAP 1007853).',
    specs: ['Kính lọc: Acrylic hổ phách (amber) cản tia cực tím bảo vệ mẫu quang học', 'Khung: Nhựa y tế ABS trắng ngà nguyên khối bo cong góc cao cấp', 'Trợ lực: Cặp ty ben khí nén chrome chịu lực nắp mở êm ái (SAP 1007853)', 'Cảm biến: Tự phát hiện nắp mở ngắt truyền động bảo đảm an toàn'],
    targetPos: [0, 11.5, -4.0],
    cameraPos: [0, 16.0, 18.0]
  }
];

export interface ThreeMachineViewerRef {
  resetView: () => void;
  setTopView: () => void;
  setSideView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitOverview: () => void;
  recenterTarget: () => void;
  setPreset: (preset: CameraPreset) => void;
}

export interface ThreeMachineViewerProps {
  modelId?: MachineModelId;
  isHoodOpen?: boolean;
  onToggleHood?: () => void;
  isSystemRunning?: boolean;
  onCameraChange?: (preset: CameraPreset) => void;
  activePreset?: CameraPreset;
}

export const ThreeMachineViewer = forwardRef<ThreeMachineViewerRef, ThreeMachineViewerProps>(({
  modelId = 'CS-T240',
  isHoodOpen = false,
  onToggleHood = () => {},
  isSystemRunning = true,
  onCameraChange,
  activePreset
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('panoramic');
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const [telemetryCoords, setTelemetryCoords] = useState({
    x: '142.84 mm',
    y: '88.12 mm',
    z: '-18.30 mm'
  });

  // Track whether an automated camera animation transition is running
  const isCameraAnimatingRef = useRef(false);

  // Scene references
  const sceneContextRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    machineRoot: THREE.Group;
    exteriorGroup: THREE.Group;
    internalsGroup: THREE.Group;
    reagentDiskGroup: THREE.Group;
    cuvetteDiskGroup: THREE.Group;
    reagentArmGroup: THREE.Group;
    probe1: THREE.Mesh;
    mixerArmGroup: THREE.Group;
    mixerPaddle: THREE.Mesh;
    hoodGroup: THREE.Group;
    leftGasStrutGroup: THREE.Group;
    rightGasStrutGroup: THREE.Group;
    leftGasStrutRod: THREE.Mesh;
    rightGasStrutRod: THREE.Mesh;
    syringePlungers: THREE.Mesh[];
    coolingFanBlades: THREE.Mesh;
    matGlowingCyanLed: THREE.MeshStandardMaterial;
    matDiagnosticHeartbeat: THREE.MeshStandardMaterial;
    matDiagnosticBus: THREE.MeshStandardMaterial;
    uvOpticalLight: THREE.PointLight;
    // Animation targets
    targetCameraPos: THREE.Vector3;
    targetControlsLookAt: THREE.Vector3;
  } | null>(null);

  // Initialize Three.js with OrbitControls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = null;

    // Center camera properly on the center of the benchtop machine (0, 7.5, 0)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 15, 34);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // OrbitControls: Allows smooth free rotation and zooming
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 7.5, 0);
    controls.minDistance = 6; // Allow zooming in close to examine internal boards/needles
    controls.maxDistance = 160; // Allow zooming far out to inspect full machine and context
    controls.maxPolarAngle = Math.PI / 2 + 0.06; // Don't orbit below table
    controls.enableZoom = true;
    controls.zoomSpeed = 1.1;

    // Stop automated animation immediately when user manually rotates or zooms
    controls.addEventListener('start', () => {
      isCameraAnimatingRef.current = false;
    });

    const handleWheelEvent = () => {
      isCameraAnimatingRef.current = false;
    };
    renderer.domElement.addEventListener('wheel', handleWheelEvent, { passive: true });

    // --- LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xf1f5f9, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(20, 35, 25);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const blueRim = new THREE.DirectionalLight(0x0284c7, 2.0);
    blueRim.position.set(-25, 20, -20);
    scene.add(blueRim);

    const frontFill = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    frontFill.position.set(5, 10, 30);
    scene.add(frontFill);

    const interiorChamberLight = new THREE.PointLight(0x38bdf8, 2.8, 25);
    interiorChamberLight.position.set(0, 7.5, 3);
    scene.add(interiorChamberLight);

    const uvOpticalLight = new THREE.PointLight(0x818cf8, 3.5, 15);
    uvOpticalLight.position.set(5.2, 16.5, -4.5);
    scene.add(uvOpticalLight);

    // --- MATERIALS ---
    const matCleanroomWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.22,
      metalness: 0.05
    });

    const matBaseTrim = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.25
    });

    const matDiruiChassisBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.2
    });

    const matDarkMedicalBezel = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.45,
      metalness: 0.3
    });

    const matStainlessSteel = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      roughness: 0.15,
      metalness: 0.92
    });

    const matChromeScrews = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.98
    });

    // Signature Amber / Orange UV-filtering acrylic window of Dirui CS-T240
    const matAmberWindow = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.78,
      roughness: 0.08,
      metalness: 0.04,
      transmission: 0.82,
      thickness: 1.2,
      ior: 1.52,
      attenuationColor: new THREE.Color(0xb45309),
      attenuationDistance: 2.5
    });

    // Signature Vibrant Lemon/Golden Yellow Reagent Carousel
    const matReagentYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.28,
      metalness: 0.06
    });

    const matReactionDiskDark = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.45
    });

    const matGlowingCyanLed = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 2.2,
      roughness: 0.2
    });

    // Mainboard PCB Materials
    const matPCBGreen = new THREE.MeshStandardMaterial({
      color: 0x065f46, // Rich Industrial Soldermask Green
      roughness: 0.35,
      metalness: 0.2
    });

    const matSiliconChip = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.6
    });

    const matHeatsinkAluminum = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.8
    });

    const matGoldContacts = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85
    });

    const matDiagnosticHeartbeat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2.5
    });

    const matDiagnosticBus = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 2.2
    });

    const matCopperPipes = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.3,
      metalness: 0.7
    });

    const matGlassSyringe = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      transmission: 0.92,
      thickness: 0.8
    });

    const matCuvetteGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.08,
      transmission: 0.85
    });

    // --- HIERARCHY ROOT ---
    const machineRoot = new THREE.Group();
    scene.add(machineRoot);

    // Two primary visibility groups: EXTERIOR vs INTERNALS
    const exteriorGroup = new THREE.Group();
    const internalsGroup = new THREE.Group();
    machineRoot.add(exteriorGroup);
    machineRoot.add(internalsGroup);

    // ==========================================
    // 1. EXTERIOR BENCHTOP CABINET & CASING
    // ==========================================
    // A. Dark Bottom Perimeter Base Tray & Rubber Feet
    const baseTrayGeo = new THREE.BoxGeometry(27.8, 0.7, 17.2);
    const baseTray = new THREE.Mesh(baseTrayGeo, matBaseTrim);
    baseTray.position.y = 0.65;
    baseTray.castShadow = true;
    baseTray.receiveShadow = true;
    exteriorGroup.add(baseTray);

    // 4 Conical Vibration-Absorbing Black Rubber Feet (Under chassis)
    [[-12.2, 6.8], [12.2, 6.8], [-12.2, -6.8], [12.2, -6.8]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.6, 20), matBaseTrim);
      foot.position.set(fx, 0.3, fz);
      machineRoot.add(foot);
    });

    // B. High-Resolution Texture Canvas for Front Panel (DIRUI CS-T240 Red Logo + Handle Indent)
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 512;
    const fctx = frontCanvas.getContext('2d');
    if (fctx) {
      fctx.fillStyle = '#f8fafc';
      fctx.fillRect(0, 0, 1024, 512);

      // Recessed horizontal handle grip indent in upper-middle
      fctx.fillStyle = '#e2e8f0';
      fctx.beginPath();
      fctx.roundRect(360, 95, 304, 26, 12);
      fctx.fill();

      fctx.strokeStyle = '#cbd5e1';
      fctx.lineWidth = 2;
      fctx.beginPath();
      fctx.roundRect(360, 95, 304, 26, 12);
      fctx.stroke();

      // Top shadow of handle indent
      fctx.fillStyle = '#94a3b8';
      fctx.beginPath();
      fctx.roundRect(362, 97, 300, 7, [10, 10, 0, 0]);
      fctx.fill();

      // DIRUI Red Stylized Logo at bottom left
      fctx.fillStyle = '#dc2626';
      fctx.font = '900 48px sans-serif';
      fctx.fillText('DIRUI', 70, 395);

      // Small logo horizontal accent line
      fctx.fillStyle = '#dc2626';
      fctx.fillRect(72, 404, 138, 5);

      // CS-T240 Model Label
      fctx.fillStyle = '#b91c1c';
      fctx.font = 'bold 36px sans-serif';
      fctx.fillText('CS-T240', 222, 395);

      fctx.fillStyle = '#64748b';
      fctx.font = '500 16px sans-serif';
      fctx.fillText('AUTO-CHEMISTRY ANALYZER', 72, 432);
    }
    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.anisotropy = 8;
    const matFrontPanelWithLogo = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.24,
      metalness: 0.05
    });

    // Front Panel Face
    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(27.4, 6.4, 0.4), matFrontPanelWithLogo);
    frontPanel.position.set(0, 4.2, 8.4);
    frontPanel.castShadow = true;
    exteriorGroup.add(frontPanel);

    // Left Side Panel
    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.4, 16.8), matCleanroomWhite);
    leftPanel.position.set(-13.6, 4.2, 0);
    leftPanel.castShadow = true;
    exteriorGroup.add(leftPanel);

    // Right Side Panel (plain - per CS-T200-07-00 exploded cover diagram, ventilation
    // slots are on the Rear Left/Right Covers, not the side panels)
    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.4, 16.8), matCleanroomWhite);
    rightPanel.position.set(13.6, 4.2, 0);
    rightPanel.castShadow = true;
    exteriorGroup.add(rightPanel);

    // Rear Splash Wall rising up to the hood hinge, split into "Rear Left Cover" (#9) and
    // "Rear Right Cover" (#10) sections, each carrying its own ventilation slot grille,
    // matching the CS-T200-07-00 Cover Unit exploded diagram (Section 9.4.9).
    const rearVentCanvas = document.createElement('canvas');
    rearVentCanvas.width = 512;
    rearVentCanvas.height = 512;
    const rvctx = rearVentCanvas.getContext('2d');
    if (rvctx) {
      rvctx.fillStyle = '#f8fafc';
      rvctx.fillRect(0, 0, 512, 512);

      // Dense grid of ventilation slots (two stacked grilles, as shown on both rear covers)
      rvctx.fillStyle = '#334155';
      for (let block = 0; block < 2; block++) {
        for (let col = 0; col < 8; col++) {
          for (let row = 0; row < 5; row++) {
            rvctx.beginPath();
            rvctx.roundRect(40 + col * 30, 40 + block * 220 + row * 26, 20, 16, 3);
            rvctx.fill();
          }
        }
      }
    }
    const rearVentTexture = new THREE.CanvasTexture(rearVentCanvas);
    const matRearCoverWithVents = new THREE.MeshStandardMaterial({
      map: rearVentTexture,
      roughness: 0.24,
      metalness: 0.05
    });

    const rearLeftCover = new THREE.Mesh(new THREE.BoxGeometry(13.6, 11.8, 0.6), matRearCoverWithVents);
    rearLeftCover.position.set(-6.85, 6.9, -8.3);
    rearLeftCover.castShadow = true;
    exteriorGroup.add(rearLeftCover);

    const rearRightCover = new THREE.Mesh(new THREE.BoxGeometry(13.6, 11.8, 0.6), matRearCoverWithVents);
    rearRightCover.position.set(6.85, 6.9, -8.3);
    rearRightCover.castShadow = true;
    exteriorGroup.add(rearRightCover);

    // Working Basin Inner Deck Floor (Recessed down)
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.1 });
    const deckFloor = new THREE.Mesh(new THREE.BoxGeometry(26.8, 0.4, 16.0), deckMat);
    deckFloor.position.set(0, 7.2, 0);
    deckFloor.receiveShadow = true;
    exteriorGroup.add(deckFloor);

    // Front Basin Lip Step
    const frontBasinLip = new THREE.Mesh(new THREE.BoxGeometry(27.4, 0.6, 1.4), matCleanroomWhite);
    frontBasinLip.position.set(0, 7.3, 7.7);
    exteriorGroup.add(frontBasinLip);

    // =========================================================================
    // B. AUTHENTIC DIRUI CS-T240 INTERNAL HARDWARE ARCHITECTURE (SERVICE MANUAL)
    // =========================================================================
    // Additional Materials for authentic electronics & fluidics
    const matStainlessBulkhead = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 });
    const matWarningYellow = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });
    const matLedSevenSegmentRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 3.2,
      roughness: 0.2
    });
    const matBrassStandoff = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.25 });
    const matGroundGreenYellow = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.4 });
    const matPeltierWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });

    // -------------------------------------------------------------------------
    // 1. HEAVY CHASSIS, MOUNTING BASE & ISOLATION PARTITION BULKHEADS
    // -------------------------------------------------------------------------
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.35 });
    const internalFloorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.4 });

    // Heavy Cast Steel Base Chassis Plate (Chassis Frame)
    const internalFloor = new THREE.Mesh(new THREE.BoxGeometry(25.6, 0.5, 15.6), internalFloorMat);
    internalFloor.position.set(0, 0.3, 0);
    internalsGroup.add(internalFloor);

    // 4 Heavy Industrial Rubber Vibration Dampening Foot Pads
    [[-11.5, -6.5], [11.5, -6.5], [-11.5, 6.5], [11.5, 6.5]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.5, 16), matDarkMedicalBezel);
      foot.position.set(fx, 0.05, fz);
      internalsGroup.add(foot);
    });

    // Brass Grounding Busbar with braided grounding wire runs
    const groundBusbar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.6), matBrassStandoff);
    groundBusbar.position.set(-11.0, 0.65, 6.0);
    internalsGroup.add(groundBusbar);

    const groundBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 12), matStainlessSteel);
    groundBolt.position.set(-11.0, 0.9, 6.0);
    internalsGroup.add(groundBolt);

    // Yellow/Green Grounding Cable Run
    const groundWireCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-11.0, 0.7, 6.0),
      new THREE.Vector3(-8.0, 1.2, 4.0),
      new THREE.Vector3(-3.5, 4.5, -4.5)
    );
    const groundWire = new THREE.Mesh(new THREE.TubeGeometry(groundWireCurve, 16, 0.08, 6, false), matGroundGreenYellow);
    internalsGroup.add(groundWire);

    // 4 Corner vertical steel structural columns with gusset braces
    [[-12.4, -7.2], [12.4, -7.2], [-12.4, 7.2], [12.4, 7.2]].forEach(([colX, colZ]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.0, 0.8), frameMat);
      col.position.set(colX, 3.8, colZ);
      internalsGroup.add(col);

      const gusset = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), frameMat);
      gusset.position.set(colX * 0.94, 0.6, colZ * 0.94);
      internalsGroup.add(gusset);
    });

    // Compartment Isolation Bulkhead dividing Electronics bay (Left-Rear) from Power/SSR bay (Right)
    const midDividerWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.5, 15.0), matStainlessBulkhead);
    midDividerWall.position.set(1.5, 3.8, 0);
    internalsGroup.add(midDividerWall);

    // Front-to-Rear separation bulkhead dividing Fluidics (Front-Left) from Reaction Drive (Rear-Left)
    const fluidicDividerWall = new THREE.Mesh(new THREE.BoxGeometry(13.5, 6.5, 0.3), matStainlessBulkhead);
    fluidicDividerWall.position.set(-5.5, 3.8, 1.8);
    internalsGroup.add(fluidicDividerWall);

    // Intermediate horizontal stainless steel shelf skeleton with apertures
    const midDeckPlate = new THREE.Mesh(new THREE.BoxGeometry(25.4, 0.3, 15.4), matStainlessBulkhead);
    midDeckPlate.position.set(0, 7.05, 0);
    internalsGroup.add(midDeckPlate);

    // -------------------------------------------------------------------------
    // 2. BO MẠCH ĐIỀU KHIỂN CHÍNH (MAIN CONTROL BOARD - Mục 6.4.3 / SAP 2001488)
    // -------------------------------------------------------------------------
    const mainboardGroup = new THREE.Group();
    mainboardGroup.position.set(-3.5, 4.8, -4.5);
    internalsGroup.add(mainboardGroup);

    // Mainboard PCB Base (13.5 x 0.25 x 7.0)
    const mainPcb = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.25, 7.0), matPCBGreen);
    mainboardGroup.add(mainPcb);

    // 6 Brass Standoffs
    [[-6.2, -3.0], [6.2, -3.0], [-6.2, 3.0], [6.2, 3.0], [0, -3.0], [0, 3.0]].forEach(([sx, sz]) => {
      const so = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 12), matBrassStandoff);
      so.position.set(sx, -0.25, sz);
      mainboardGroup.add(so);
    });

    // CPU Master MCU with Finned Heatsink
    const cpuHeatsink = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2.4), matHeatsinkAluminum);
    cpuHeatsink.position.set(-3.0, 0.45, 0);
    mainboardGroup.add(cpuHeatsink);

    for (let f = 0; f < 6; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 0.1), matHeatsinkAluminum);
      fin.position.set(-3.0, 0.9, -0.8 + f * 0.32);
      mainboardGroup.add(fin);
    }

    // J02 RS-232 DB9 Serial Port (connecting to PC Workstation software)
    const db9Port = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 1.0), matStainlessSteel);
    db9Port.position.set(-6.0, 0.45, -3.2);
    mainboardGroup.add(db9Port);

    // J10 DB9 Rack: second serial port for monitoring/debug (per Section 5.3.4 wiring
    // diagram - "Interface for serial port monitoring and communication", not RJ45)
    const debugDb9Port = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 0.9), matStainlessSteel);
    debugDb9Port.position.set(-4.3, 0.45, -3.2);
    mainboardGroup.add(debugDb9Port);

    // J04 Water Tank / Incubation Bath Pressure Sensor Connector
    const socketJ04 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), matCleanroomWhite);
    socketJ04.position.set(1.4, 0.35, -2.6);
    mainboardGroup.add(socketJ04);

    // J07 Float Switch / Liquid Level Signal Connector (water tank + waste tank floats)
    const socketJ07 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.6), matCleanroomWhite);
    socketJ07.position.set(3.0, 0.35, -2.6);
    mainboardGroup.add(socketJ07);

    // J424 Diaphragm Pump Driver Connector
    const connJ424 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.5), matSiliconChip);
    connJ424.position.set(4.0, 0.3, -2.4);
    mainboardGroup.add(connJ424);

    // Solenoid Valve Driver FETs for SV6, SV10, SV13 with mini heatsinks
    [-1.2, -0.2, 0.8].forEach(vx => {
      const fet = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.4), matSiliconChip);
      fet.position.set(vx, 0.35, -2.2);
      mainboardGroup.add(fet);

      const fTab = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 0.08), matStainlessSteel);
      fTab.position.set(vx, 0.45, -2.4);
      mainboardGroup.add(fTab);
    });

    // J05 Incubation Bath PT100 Temperature Sensor Connector (White 4-pin socket)
    const socketJ05 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), matCleanroomWhite);
    socketJ05.position.set(2.2, 0.35, -2.6);
    mainboardGroup.add(socketJ05);

    // CAN Bus Transceiver IC and Master CAN Bus Interface
    const canTransceiver = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.6), matSiliconChip);
    canTransceiver.position.set(0.5, 0.25, 0.5);
    mainboardGroup.add(canTransceiver);

    // Array of Solid Filter Capacitors
    for (let c = 0; c < 6; c++) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16), matStainlessSteel);
      cap.position.set(4.0 + (c % 3) * 0.7, 0.4, 1.2 + Math.floor(c / 3) * 0.8);
      mainboardGroup.add(cap);
    }

    // Diagnostic LEDs (Heartbeat Green pulsing, Data Bus Blue blinking, Error Red)
    const ledHeartbeat = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12), matDiagnosticHeartbeat);
    ledHeartbeat.position.set(5.5, 0.25, 2.4);
    mainboardGroup.add(ledHeartbeat);

    const ledDataBus = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12), matDiagnosticBus);
    ledDataBus.position.set(5.9, 0.25, 2.4);
    mainboardGroup.add(ledDataBus);

    const ledErr = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 }));
    ledErr.position.set(6.3, 0.25, 2.4);
    mainboardGroup.add(ledErr);

    // -------------------------------------------------------------------------
    // 3. BO MẠCH MÂM MẪU & HÓA CHẤT & KIM HÚT (REAGENT & SAMPLE BOARD - Mục 6.4.7 / SAP 2001491)
    // -------------------------------------------------------------------------
    const sampleReagentBoardGroup = new THREE.Group();
    sampleReagentBoardGroup.position.set(5.5, 4.8, -4.0);
    internalsGroup.add(sampleReagentBoardGroup);

    const srbPcb = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.25, 6.5), matPCBGreen);
    sampleReagentBoardGroup.add(srbPcb);

    // Carousel Stepping Motor Driver IC & Heat spreader
    const carouselDriver = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), matSiliconChip);
    carouselDriver.position.set(-2.5, 0.35, -1.5);
    sampleReagentBoardGroup.add(carouselDriver);

    // Probe Z & R Movement Driver ICs
    [-1.0, 0.5].forEach(px => {
      const probeDriver = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 1.0), matSiliconChip);
      probeDriver.position.set(px, 0.35, -1.5);
      sampleReagentBoardGroup.add(probeDriver);
    });

    // DEDICATED DRIVER IC U13 FOR THE 500 μL SYRINGE PUMP (Jack J103/P103)
    const syringeDriverU13 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 1.2), matSiliconChip);
    syringeDriverU13.position.set(2.4, 0.35, -1.5);
    sampleReagentBoardGroup.add(syringeDriverU13);

    const syringeDriverHeatsink = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 1.1), matHeatsinkAluminum);
    syringeDriverHeatsink.position.set(2.4, 0.65, -1.5);
    sampleReagentBoardGroup.add(syringeDriverHeatsink);

    // White Connector J103/P103 for Syringe Stepping Motor
    const connJ103 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.6), matCleanroomWhite);
    connJ103.position.set(2.4, 0.35, -2.7);
    sampleReagentBoardGroup.add(connJ103);

    // Liquid Level Detection (LLD) Pre-amplifier Circuit & J6/J7 Connectors
    const lldShieldBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 2.0), matStainlessSteel);
    lldShieldBox.position.set(-2.2, 0.4, 1.5);
    sampleReagentBoardGroup.add(lldShieldBox);

    const bncJ6 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16), matStainlessSteel);
    bncJ6.position.set(-2.6, 0.8, 1.5);
    sampleReagentBoardGroup.add(bncJ6);

    const bncJ7 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16), matStainlessSteel);
    bncJ7.position.set(-1.8, 0.8, 1.5);
    sampleReagentBoardGroup.add(bncJ7);

    // Barcode Reader Interface IC (Code 128)
    const barcodeDecoderIc = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.0), matSiliconChip);
    barcodeDecoderIc.position.set(1.5, 0.25, 1.5);
    sampleReagentBoardGroup.add(barcodeDecoderIc);

    // -------------------------------------------------------------------------
    // 4. BO MẠCH MÂM PHẢN ỨNG (REACTION DISK BOARD - Mục 6.4.5 / SAP 2001489)
    // -------------------------------------------------------------------------
    // Placed directly beneath the Reaction Cuvette Carousel
    const reactionBoardGroup = new THREE.Group();
    reactionBoardGroup.position.set(-2.8, 3.2, 0.6);
    internalsGroup.add(reactionBoardGroup);

    const rdbPcb = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.25, 6.0), matPCBGreen);
    reactionBoardGroup.add(rdbPcb);

    // Stepper Motor Driver IC U3
    const driverU3 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.3), matSiliconChip);
    driverU3.position.set(-1.8, 0.35, -1.2);
    reactionBoardGroup.add(driverU3);

    // High Torque 2-Phase Stepping Motor PK266M-01B for Reaction Carousel Drive
    const motorPK266 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 3.2), matDarkMedicalBezel);
    motorPK266.position.set(1.4, 2.0, 0.5);
    reactionBoardGroup.add(motorPK266);

    const motorDriveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.6, 20), matStainlessSteel);
    motorDriveShaft.position.set(1.4, 4.0, 0.5);
    reactionBoardGroup.add(motorDriveShaft);

    // 120-Tooth Metal Optical Code Disc (Đĩa mã 120 xung quang học)
    const codeDisc120 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.15, 48), matStainlessSteel);
    codeDisc120.position.set(1.4, 4.6, 0.5);
    reactionBoardGroup.add(codeDisc120);

    // 2 Counting Optocouplers (J704 & J705) reading the 120 pulses
    [0.45, -0.45].forEach(offsetAngle => {
      const opto = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.5), matSiliconChip);
      opto.position.set(1.4 + Math.sin(offsetAngle) * 2.0, 4.6, 0.5 + Math.cos(offsetAngle) * 2.0);
      reactionBoardGroup.add(opto);
    });

    // Zero-Position Reset Sensor (pointing to Cuvette #71)
    const resetOpto = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.45), matCleanroomWhite);
    resetOpto.position.set(1.4 - 2.0, 4.6, 0.5);
    reactionBoardGroup.add(resetOpto);

    // -------------------------------------------------------------------------
    // 5. BO MẠCH TRẠM RỬA & CÁNH KHUẤY (RINSING & MIXING BOARD - Mục 6.4.6 / SAP 2001490)
    // -------------------------------------------------------------------------
    const rinseMixBoardGroup = new THREE.Group();
    rinseMixBoardGroup.position.set(-2.8, 4.8, -3.2);
    internalsGroup.add(rinseMixBoardGroup);

    const rmbPcb = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.25, 5.5), matPCBGreen);
    rinseMixBoardGroup.add(rmbPcb);

    // Driver IC U8 for Stirring Hollow-Cup Motor
    const driverU8 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.1), matSiliconChip);
    driverU8.position.set(-2.2, 0.35, -1.0);
    rinseMixBoardGroup.add(driverU8);

    // Driver IC U7 for Wash Station Vertical Lift Mechanism
    const driverU7 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.1), matSiliconChip);
    driverU7.position.set(-0.6, 0.35, -1.0);
    rinseMixBoardGroup.add(driverU7);

    // Optocoupler Limit Connector P02 (pins 5-6, 8-9, 11-12)
    const socketP02 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.6), matCleanroomWhite);
    socketP02.position.set(-1.4, 0.35, 1.8);
    rinseMixBoardGroup.add(socketP02);

    // Solenoid Valve Driver Array for SV1, SV2, SV3, SV4, SV5, SV7, SV8, SV9, SV11 (8 Valves)
    for (let v = 0; v < 8; v++) {
      const vfet = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.35), matSiliconChip);
      vfet.position.set(1.0 + (v % 4) * 0.7, 0.35, -0.6 + Math.floor(v / 4) * 1.0);
      rinseMixBoardGroup.add(vfet);
    }

    // -------------------------------------------------------------------------
    // 6. BO MẠCH RƠ-LE BÁN DẪN CÔNG SUẤT (SOLID-STATE RELAY BOARD - Mục 6.4.4 / SAP 2000398)
    // -------------------------------------------------------------------------
    const ssrBoardGroup = new THREE.Group();
    ssrBoardGroup.position.set(7.5, 2.5, 4.0);
    internalsGroup.add(ssrBoardGroup);

    // Heavy Aluminum Heatsink Baseplate
    const ssrHeatsink = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.6, 5.2), matHeatsinkAluminum);
    ssrHeatsink.position.y = 0;
    ssrBoardGroup.add(ssrHeatsink);

    const ssrPcb = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, 5.0), matPCBGreen);
    ssrPcb.position.y = 0.4;
    ssrBoardGroup.add(ssrPcb);

    // 4 High-Voltage Solid State Relays (SSR1 - SSR4)
    const ssrLabels = ['SSR1: 37°C 200W', 'SSR2: H2O 180W', 'SSR3: PUMP', 'SSR4: LAMP'];
    for (let s = 0; s < 4; s++) {
      const ssrBlock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.8), matDarkMedicalBezel);
      ssrBlock.position.set(-2.2 + s * 1.5, 0.9, -0.5);
      ssrBoardGroup.add(ssrBlock);

      // Metallic load terminals on top of SSR
      const term1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), matStainlessSteel);
      term1.position.set(-2.2 + s * 1.5, 1.45, -1.0);
      ssrBoardGroup.add(term1);

      const term2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), matStainlessSteel);
      term2.position.set(-2.2 + s * 1.5, 1.45, 0.0);
      ssrBoardGroup.add(term2);
    }

    // High Voltage Warning Triangle Label
    const warningLabel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 1.0), matWarningYellow);
    warningLabel.position.set(0, 0.52, 1.8);
    ssrBoardGroup.add(warningLabel);

    // Ceramic High-Voltage Terminal Barrier Strip
    const hvTerminalStrip = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.6, 0.8), matDarkMedicalBezel);
    hvTerminalStrip.position.set(0, 0.8, 1.8);
    ssrBoardGroup.add(hvTerminalStrip);

    // -------------------------------------------------------------------------
    // 7. BO MẠCH LÀM LẠNH BÁN DẪN & CỤM PELTIER (COOLING BOARD - Mục 6.4.2 / SAP 2001492)
    // -------------------------------------------------------------------------
    const coolingBoardGroup = new THREE.Group();
    coolingBoardGroup.position.set(6.2, 4.8, 1.0);
    internalsGroup.add(coolingBoardGroup);

    const coolingPcb = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.25, 4.8), matPCBGreen);
    coolingBoardGroup.add(coolingPcb);

    // DUAL 7-SEGMENT DIGITAL RED LED TEMPERATURE DISPLAY (Shows "08" °C)
    const ledDisplayBezel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.0), matDarkMedicalBezel);
    ledDisplayBezel.position.set(-1.6, 0.45, -1.2);
    coolingBoardGroup.add(ledDisplayBezel);

    // Two red 7-segment digit blocks
    [-1.9, -1.3].forEach(dx => {
      const digit = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.7), matLedSevenSegmentRed);
      digit.position.set(dx, 0.72, -1.2);
      coolingBoardGroup.add(digit);
    });

    // High-current Shunt Resistor measuring Peltier current (> 5A)
    const shuntResistor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.6), matStainlessSteel);
    shuntResistor.position.set(1.0, 0.4, -1.2);
    coolingBoardGroup.add(shuntResistor);

    // Peltier Sub-assembly (Directly below Reagent Carousel)
    const peltierSubGroup = new THREE.Group();
    peltierSubGroup.position.set(0, -1.8, 1.2);
    coolingBoardGroup.add(peltierSubGroup);

    // Copper Cold Plate
    const copperColdPlate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.3, 4.8), matCopperPipes);
    copperColdPlate.position.y = 1.0;
    peltierSubGroup.add(copperColdPlate);

    // Peltier Thermoelectric Module FPH1-12708AC (SAP 1013593)
    const peltierModule = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.25, 4.0), matPeltierWhite);
    peltierModule.position.y = 0.75;
    peltierSubGroup.add(peltierModule);

    // Heavy Aluminum Finned Heat Sink Block
    const peltierHeatsink = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 5.2), matHeatsinkAluminum);
    peltierHeatsink.position.y = -0.25;
    peltierSubGroup.add(peltierHeatsink);

    for (let finI = 0; finI < 10; finI++) {
      const pFin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.7, 5.0), matCleanroomWhite);
      pFin.position.set(-2.2 + finI * 0.48, -0.25, 0);
      peltierSubGroup.add(pFin);
    }

    // 120mm Industrial DC Brushless Cooling Fan
    const fanHousing = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.8, 5.0), matDarkMedicalBezel);
    fanHousing.position.set(0, -1.5, 0);
    peltierSubGroup.add(fanHousing);

    const coolingFanBlades = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.3, 16), matStainlessSteel);
    coolingFanBlades.position.set(0, -1.5, 0);
    peltierSubGroup.add(coolingFanBlades);

    // Wire protective finger guard
    const fanGuard = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 8, 32), matStainlessSteel);
    fanGuard.rotation.x = Math.PI / 2;
    fanGuard.position.set(0, -1.95, 0);
    peltierSubGroup.add(fanGuard);

    // -------------------------------------------------------------------------
    // 8. BO MẠCH THU NHẬN QUANG 12 KÊNH A/D (AD BOARD - Mục 6.4.9 / SAP 2001962)
    // -------------------------------------------------------------------------
    const adBoardGroup = new THREE.Group();
    adBoardGroup.position.set(1.8, 5.2, -5.2);
    internalsGroup.add(adBoardGroup);

    // Shielded Die-Cast Aluminum Enclosure (Chống nhiễu quang học & điện từ)
    const adShieldCase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 3.2), matStainlessSteel);
    adBoardGroup.add(adShieldCase);

    // Optical slit interface flange
    const opticFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.6, 16), matDarkMedicalBezel);
    opticFlange.rotation.x = Math.PI / 2;
    opticFlange.position.set(0, 0, 1.8);
    adBoardGroup.add(opticFlange);

    // 12 Channel Ribbon Cable running to Main Control Board
    const adRibbonCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(1.8, 5.2, -4.5),
      new THREE.Vector3(-0.5, 5.0, -4.5),
      new THREE.Vector3(-2.0, 5.0, -4.5)
    );
    const adRibbon = new THREE.Mesh(new THREE.TubeGeometry(adRibbonCurve, 12, 0.15, 6, false), matCleanroomWhite);
    internalsGroup.add(adRibbon);

    // -------------------------------------------------------------------------
    // 9. BỘ NGUỒN CÔNG NGHIỆP Y TẾ N1-N4 & BỘ LỌC EMI (Mục 6.4.1)
    // -------------------------------------------------------------------------
    const psuGroup = new THREE.Group();
    psuGroup.position.set(7.5, 3.2, 2.5);
    internalsGroup.add(psuGroup);

    // Perforated Medical PSU Enclosure
    const psuEnclosure = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.6, 6.2), matStainlessSteel);
    psuGroup.add(psuEnclosure);

    // AC Power Inlet Socket
    const acInlet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.8), matDarkMedicalBezel);
    acInlet.position.set(2.6, 0.5, -1.8);
    psuGroup.add(acInlet);

    // EMI Line Filter module (Cover Unit #12, SAP 1013214, internal fuse 5x20 6.3A 250V)
    const emiFilterModule = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.1), matStainlessSteel);
    emiFilterModule.position.set(2.6, 0.45, -3.0);
    psuGroup.add(emiFilterModule);

    const emiFilterFuseCap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 16), matDarkMedicalBezel);
    emiFilterFuseCap.rotation.z = Math.PI / 2;
    emiFilterFuseCap.position.set(1.9, 0.45, -3.0);
    psuGroup.add(emiFilterFuseCap);

    // Main Power Rocker Switch S1 (Red toggle)
    const switchS1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), matLedSevenSegmentRed);
    switchS1.position.set(2.6, 0.5, 0);
    psuGroup.add(switchS1);

    // Fuse Holder F6.3AL250V (5×20mm)
    const fuseHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 16), matDarkMedicalBezel);
    fuseHolder.rotation.z = Math.PI / 2;
    fuseHolder.position.set(2.6, 0.5, 1.5);
    psuGroup.add(fuseHolder);

    // Color-Coded DC Output Wire Loom (+24V Yellow, +12V Orange, +5V Red, -12V Blue, GND Black)
    const psuWireColors = [0xeab308, 0xf97316, 0xef4444, 0x3b82f6, 0x0f172a];
    for (let w = 0; w < 5; w++) {
      const wMat = new THREE.MeshStandardMaterial({ color: psuWireColors[w], roughness: 0.3 });
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), wMat);
      wire.position.set(-1.8 + w * 0.9, 1.8, 3.2);
      wire.rotation.x = 0.6;
      psuGroup.add(wire);
    }

    // -------------------------------------------------------------------------
    // 10. BƠM TIÊM VI LƯỢNG ĐƠN 500 μL PISTON THỦY TINH (SAP 2003863)
    //     (DUY NHẤT 1 CỤM BƠM TIÊM CHUẨN CS-T240 - XÓA HOÀN TOÀN BƠM ĐÔI)
    // -------------------------------------------------------------------------
    const syringeGroup = new THREE.Group();
    syringeGroup.position.set(-6.8, 4.2, 3.2);
    internalsGroup.add(syringeGroup);

    const syringePlungers: THREE.Mesh[] = [];

    // Heavy NEMA 17 Stepping Motor at Base
    const syringeMotor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), matDarkMedicalBezel);
    syringeMotor.position.set(0, -2.4, 0);
    syringeGroup.add(syringeMotor);

    // Chrome Precision Ground Lead Screw
    const syringeLeadScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.8, 16), matStainlessSteel);
    syringeLeadScrew.position.set(0, 0.6, 0);
    syringeGroup.add(syringeLeadScrew);

    // Anti-Backlash Brass Drive Nut
    const leadScrewNut = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.5, 12), matBrassStandoff);
    leadScrewNut.position.set(0, 1.2, 0);
    syringeGroup.add(leadScrewNut);

    // Borosilicate Glass 500 μL Syringe Barrel (Calibrated scale)
    const syringeBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 3.4, 24), matGlassSyringe);
    syringeBarrel.position.set(0, 2.2, 0);
    syringeGroup.add(syringeBarrel);

    // Volumetric Graduation Rings on Syringe Glass (100uL increments)
    for (let gr = 0; gr < 5; gr++) {
      const gRing = new THREE.Mesh(new THREE.TorusGeometry(0.725, 0.015, 6, 24), matStainlessSteel);
      gRing.rotation.x = Math.PI / 2;
      gRing.position.set(0, 1.2 + gr * 0.5, 0);
      syringeGroup.add(gRing);
    }

    // Precision Ground Glass Piston Plunger with Teflon Tip
    const syringePlunger = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 1.4, 24), matStainlessSteel);
    syringePlunger.position.set(0, 1.8, 0);
    syringeGroup.add(syringePlunger);
    syringePlungers.push(syringePlunger);

    // 3-Way Rotary Distribution Valve Head (Teflon body with stainless fittings)
    const valveHead = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.8, 20), matCleanroomWhite);
    valveHead.position.set(0, 4.1, 0);
    syringeGroup.add(valveHead);

    // Inlet and Outlet PTFE Tube Connections
    [-0.7, 0.7].forEach(tx => {
      const barb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12), matStainlessSteel);
      barb.position.set(tx, 4.1, 0);
      barb.rotation.z = Math.PI / 2;
      syringeGroup.add(barb);
    });

    // Home Position Optical Sensor Flag P043
    const homeSensorP043 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), matSiliconChip);
    homeSensorP043.position.set(1.2, -1.0, 0);
    syringeGroup.add(homeSensorP043);

    // -------------------------------------------------------------------------
    // 11. CỤM THỦY LỰC: KHỐI 5 VAN Z11/Z35 & BỘ CHIA NƯỚC Z7 & BÌNH KHỬ KHÍ Z40
    // -------------------------------------------------------------------------
    const fluidicsGroup = new THREE.Group();
    fluidicsGroup.position.set(-1.5, 3.8, 3.5);
    internalsGroup.add(fluidicsGroup);

    // FIVE VALVE PLATE ASSEMBLY Z11/Z35 (SV1 to SV5)
    const valveManifold = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 1.5), matStainlessSteel);
    valveManifold.position.set(-2.0, 0.5, 0);
    fluidicsGroup.add(valveManifold);

    for (let v = 0; v < 5; v++) {
      const vCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 16), matDiruiChassisBlue);
      vCoil.position.set(-3.8 + v * 0.9, 1.4, 0);
      fluidicsGroup.add(vCoil);

      const vPlunger = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 12), matStainlessSteel);
      vPlunger.position.set(-3.8 + v * 0.9, 2.05, 0);
      fluidicsGroup.add(vPlunger);
    }

    // WATER INLET 7-WAY ASSEMBLY Z7 (Bộ chia nước 7 ngả)
    const waterManifoldZ7 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.2), matCleanroomWhite);
    waterManifoldZ7.position.set(1.6, 0.6, -0.5);
    fluidicsGroup.add(waterManifoldZ7);

    for (let p = 0; p < 7; p++) {
      const barb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), matStainlessSteel);
      barb.rotation.x = Math.PI / 2;
      barb.position.set(0.8 + (p % 4) * 0.5, 0.8, -1.2);
      fluidicsGroup.add(barb);
    }

    // DEGASSING TANK ASSEMBLY Z40 (Bình khử bọt khí hòa tan)
    const degasTank = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.4, 20), matGlassSyringe);
    degasTank.position.set(2.2, 2.0, 1.5);
    fluidicsGroup.add(degasTank);

    const degasCap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.4, 20), matCleanroomWhite);
    degasCap.position.set(2.2, 3.3, 1.5);
    fluidicsGroup.add(degasCap);

    // VACUUM TANK Z25 (Bình gom chân không ≥ -70 kPa)
    const vacuumTankZ25 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.2, 24), matStainlessSteel);
    vacuumTankZ25.position.set(-4.8, 1.6, -1.8);
    fluidicsGroup.add(vacuumTankZ25);

    // MAGNETIC CIRCULATION PUMP MP-20RZ (Z6/Z8 - Bơm tuần hoàn nước bể ủ 37°C)
    const pumpMP20 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.4, 20), matDiruiChassisBlue);
    pumpMP20.rotation.z = Math.PI / 2;
    pumpMP20.position.set(2.4, 0.8, 3.0);
    fluidicsGroup.add(pumpMP20);

    const pumpImpellerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.8, 16), matDarkMedicalBezel);
    pumpImpellerHead.rotation.z = Math.PI / 2;
    pumpImpellerHead.position.set(3.8, 0.8, 3.0);
    fluidicsGroup.add(pumpImpellerHead);

    // DIAPHRAGM PUMP (Z45/Wire J424, SAP 2004363) - a separate pneumatic pump from the
    // magnetic circulation pump above; confirmed by the connector table (Chapter 5)
    const diaphragmPumpBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 1.4), matDarkMedicalBezel);
    diaphragmPumpBody.position.set(-3.4, 1.6, -3.6);
    fluidicsGroup.add(diaphragmPumpBody);

    const diaphragmPumpHead = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 20), matStainlessSteel);
    diaphragmPumpHead.position.set(-3.4, 2.55, -3.6);
    fluidicsGroup.add(diaphragmPumpHead);

    // OVERFLOW VALVE (Z46, SAP 1009835) - sits directly beside the diaphragm pump in
    // Fig 4-2-1, regulating the water tank overflow into the high-concentration waste line
    const overflowValveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 16), matDiruiChassisBlue);
    overflowValveBody.rotation.x = Math.PI / 2;
    overflowValveBody.position.set(-1.9, 1.9, -3.6);
    fluidicsGroup.add(overflowValveBody);

    const overflowValveCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), matDarkMedicalBezel);
    overflowValveCoil.position.set(-1.9, 2.5, -3.6);
    fluidicsGroup.add(overflowValveCoil);

    // Color-Coded Authentic PTFE Tubing Lines
    const fluidTubingPaths = [
      // Pure water feed (Blue) from Z7 to wash station
      { color: 0x0284c7, p1: new THREE.Vector3(1.6, 4.4, 3.0), p2: new THREE.Vector3(-1.0, 5.5, 0.5), p3: new THREE.Vector3(-2.8, 7.8, -3.2) },
      // Sample/Reagent aspiration line (Clear/Cyan) from 500uL Syringe to Probe
      { color: 0x38bdf8, p1: new THREE.Vector3(-6.8, 8.3, 3.2), p2: new THREE.Vector3(-8.0, 8.0, 1.5), p3: new THREE.Vector3(-8.2, 11.2, -0.2) },
      // High-concentration waste drainage (Amber) from Cuvette Wash to Z25
      { color: 0xd97706, p1: new THREE.Vector3(-2.8, 7.8, -3.2), p2: new THREE.Vector3(-4.5, 5.2, -0.5), p3: new THREE.Vector3(-6.3, 5.4, 1.7) },
      // Diaphragm pump -> Overflow valve -> high-concentration waste circuit (Fig 4-2-1)
      { color: 0xd97706, p1: new THREE.Vector3(-3.4, 2.55, -3.6), p2: new THREE.Vector3(-2.6, 2.7, -3.6), p3: new THREE.Vector3(-1.9, 2.5, -3.6) },
      { color: 0xd97706, p1: new THREE.Vector3(-1.9, 1.9, -3.6), p2: new THREE.Vector3(-3.0, 1.0, -2.8), p3: new THREE.Vector3(-4.8, 1.6, -1.8) }
    ];

    fluidTubingPaths.forEach(({ color, p1, p2, p3 }) => {
      const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
      const tMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.1, 8, false),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 })
      );
      internalsGroup.add(tMesh);
    });

    // =========================================================================
    // C. UPPER WORKING DECK (DIRUI CS-T240 EXACT 67-POS DISK & 120 CUVETTES)
    // =========================================================================

    // 1. [ON THE RIGHT] SIGNATURE 67-POSITION SAMPLE & REAGENT CAROUSEL
    const reagentDiskGroup = new THREE.Group();
    reagentDiskGroup.position.set(6.2, 7.4, 0.8);
    machineRoot.add(reagentDiskGroup);

    // Main yellow rotor carousel plate
    const yellowPlate = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.5, 0.7, 64), matReagentYellow);
    yellowPlate.castShadow = true;
    reagentDiskGroup.add(yellowPlate);

    // Yellow outer rim
    const yellowRim = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.3, 64), matReagentYellow);
    yellowRim.position.y = 0.45;
    reagentDiskGroup.add(yellowRim);

    // 45 REAGENT POSITIONS (Outer Ring R1/R2)
    const bottleMatBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const bottleMatAmber = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
    const capMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const capMatRedDetergent = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });

    for (let b = 0; b < 45; b++) {
      const angle = (b / 45) * Math.PI * 2;
      const radius = 3.6;
      // Position #45 is exclusively reserved for CS Detergent (Clean Solution)
      const isDetergentPos = b === 44;
      const bMat = isDetergentPos ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }) : (b % 2 === 0 ? bottleMatBlue : bottleMatAmber);
      const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.8, 0.44), bMat);
      bottle.position.set(Math.cos(angle) * radius, 0.65, Math.sin(angle) * radius);
      bottle.rotation.y = -angle;

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 16), isDetergentPos ? capMatRedDetergent : capMatWhite);
      cap.position.y = 0.45;
      bottle.add(cap);
      reagentDiskGroup.add(bottle);
    }

    // 21 SAMPLE POSITIONS (Inner Ring)
    for (let s = 0; s < 21; s++) {
      const angle = (s / 21) * Math.PI * 2;
      const radius = 2.1;
      const sampleCup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.55, 16), matCleanroomWhite);
      sampleCup.position.set(Math.cos(angle) * radius, 0.55, Math.sin(angle) * radius);
      reagentDiskGroup.add(sampleCup);
    }

    // Yellow Center Locking Hub with Central Hand Knob
    const centerYellowHub = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.85, 32), matReagentYellow);
    centerYellowHub.position.y = 0.5;
    reagentDiskGroup.add(centerYellowHub);

    const centerCapScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), matStainlessSteel);
    centerCapScrew.position.y = 0.95;
    reagentDiskGroup.add(centerCapScrew);

    // 2. [IN THE CENTER-LEFT] 120 CUVETTES REACTION CAROUSEL (6 SETS x 20 CUVETTES)
    const cuvetteDiskGroup = new THREE.Group();
    cuvetteDiskGroup.position.set(-2.8, 7.4, 0.6);
    machineRoot.add(cuvetteDiskGroup);

    // Dark grey rotor casing (37.0°C Incubation Water Bath)
    const reactionHousing = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.6, 0.7, 64), matReactionDiskDark);
    reactionHousing.castShadow = true;
    cuvetteDiskGroup.add(reactionHousing);

    // Center Spindle with Fluted Grip Knob
    const cuvetteCenterSpindle = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.8, 32), matDarkMedicalBezel);
    cuvetteCenterSpindle.position.y = 0.5;
    cuvetteDiskGroup.add(cuvetteCenterSpindle);

    const centerGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.7, 0.4, 16), matDarkMedicalBezel);
    centerGrip.position.y = 0.95;
    cuvetteDiskGroup.add(centerGrip);

    // Chrome Perimeter Ring
    const chromeRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.08, 8, 64), matStainlessSteel);
    chromeRing.rotation.x = Math.PI / 2;
    chromeRing.position.y = 0.36;
    cuvetteDiskGroup.add(chromeRing);

    // EXACTLY 120 HARD OPTICAL CUVETTES (6 segments x 20 cuvettes each, 6mm optical path)
    const fluidMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
    for (let c = 0; c < 120; c++) {
      const angle = (c / 120) * Math.PI * 2;
      const radius = 2.92;
      // Slight visual segment division gap every 20 cuvettes
      const isSegmentDivider = c % 20 === 0;

      const cuv = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.6, 0.22), matCuvetteGlass);
      cuv.position.set(Math.cos(angle) * radius, 0.55, Math.sin(angle) * radius);
      cuv.rotation.y = -angle;

      if (c % 3 === 0) {
        const fluid = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.16), fluidMat);
        fluid.position.y = -0.1;
        cuv.add(fluid);
      }
      cuvetteDiskGroup.add(cuv);

      if (isSegmentDivider) {
        const dividerMarker = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.06), matStainlessSteel);
        dividerMarker.position.set(Math.cos(angle) * (radius + 0.18), 0.55, Math.sin(angle) * (radius + 0.18));
        cuvetteDiskGroup.add(dividerMarker);
      }
    }

    // 3. [ON THE FAR LEFT] SAMPLE & REAGENT ROBOTIC PIPETTING ARM & WASH WELL
    const reagentArmGroup = new THREE.Group();
    reagentArmGroup.position.set(-8.2, 7.4, -0.2);
    machineRoot.add(reagentArmGroup);

    // Dual stainless steel vertical guide columns
    const armGuide1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 4.6, 20), matStainlessSteel);
    armGuide1.position.set(0, 2.3, 0);
    reagentArmGroup.add(armGuide1);

    const armGuide2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.4, 16), matStainlessSteel);
    armGuide2.position.set(0.6, 2.2, 0);
    reagentArmGroup.add(armGuide2);

    // White robotic swing boom
    const armBoom = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 0.7), matCleanroomWhite);
    armBoom.position.set(1.8, 3.8, 0);
    armBoom.castShadow = true;
    reagentArmGroup.add(armBoom);

    // Needle Chuck & Stainless Steel Probe Needle
    const probeChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16), matDarkMedicalBezel);
    probeChuck.position.set(3.8, 3.8, 0);
    reagentArmGroup.add(probeChuck);

    const probe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.025, 2.8, 16), matStainlessSteel);
    probe1.position.set(3.8, 2.2, 0);
    reagentArmGroup.add(probe1);

    // Cylindrical Wash Well Tower (Giếng rửa kim súc rửa xoáy) next to pipette arm
    const washWellGroup = new THREE.Group();
    washWellGroup.position.set(-8.2, 7.4, 2.2);
    machineRoot.add(washWellGroup);

    const washWellTower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 2.0, 24), matCleanroomWhite);
    washWellTower.position.y = 1.0;
    washWellGroup.add(washWellTower);

    const washWellInner = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 20), matDarkMedicalBezel);
    washWellInner.position.y = 1.95;
    washWellGroup.add(washWellInner);

    // 4. REAR STIRRING MIXER & WASH STATION
    const mixerArmGroup = new THREE.Group();
    mixerArmGroup.position.set(-2.8, 7.4, -2.6);
    machineRoot.add(mixerArmGroup);

    const mixerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 3.5, 20), matStainlessSteel);
    mixerBase.position.y = 1.75;
    mixerArmGroup.add(mixerBase);

    const mixerBoom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.5), matCleanroomWhite);
    mixerBoom.position.set(0.8, 3.2, 0);
    mixerArmGroup.add(mixerBoom);

    const mixerPaddle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 2.4, 16), matStainlessSteel);
    mixerPaddle.position.set(1.8, 1.8, 0);
    mixerArmGroup.add(mixerPaddle);

    // Cuvette 8-stage wash manifold block
    const cuvetteWashBlock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 2.8), matStainlessSteel);
    cuvetteWashBlock.position.set(-2.8, 8.2, -3.2);
    machineRoot.add(cuvetteWashBlock);

    // ==========================================
    // 5. CLAMSHELL TOP HOOD WITH AMBER WINDOW
    // ==========================================
    // Hinged at the top-rear of the machine: [x: 0, y: 12.8, z: -8.0]
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(0, 12.8, -8.0);
    machineRoot.add(hoodGroup);

    // White Outer Hood Structure (Curved side cheeks, arch roof, and front grab lip)
    const hoodCheekGeo = new THREE.BoxGeometry(0.5, 6.2, 15.6);
    const hoodLeftCheek = new THREE.Mesh(hoodCheekGeo, matCleanroomWhite);
    hoodLeftCheek.position.set(-13.4, -2.8, 7.8);
    hoodLeftCheek.castShadow = true;
    hoodGroup.add(hoodLeftCheek);

    const hoodRightCheek = new THREE.Mesh(hoodCheekGeo, matCleanroomWhite);
    hoodRightCheek.position.set(13.4, -2.8, 7.8);
    hoodRightCheek.castShadow = true;
    hoodGroup.add(hoodRightCheek);

    // Top Curved Arch Frame Crossbar
    const hoodTopArch = new THREE.Mesh(new THREE.BoxGeometry(27.3, 1.2, 15.6), matCleanroomWhite);
    hoodTopArch.position.set(0, 0.3, 7.8);
    hoodTopArch.castShadow = true;
    hoodGroup.add(hoodTopArch);

    // Front Grab Lip of the Hood
    const hoodFrontLip = new THREE.Mesh(new THREE.BoxGeometry(27.3, 1.4, 0.6), matCleanroomWhite);
    hoodFrontLip.position.set(0, -5.3, 15.7);
    hoodFrontLip.castShadow = true;
    hoodGroup.add(hoodFrontLip);

    // SIGNATURE AMBER / BURNT-ORANGE ACRYLIC OBSERVATION WINDOW
    // Large tinted optical filter acrylic window framed cleanly inside the hood
    const amberWindowGeo = new THREE.BoxGeometry(25.8, 5.0, 0.4);
    const amberWindow = new THREE.Mesh(amberWindowGeo, matAmberWindow);
    amberWindow.position.set(0, -2.4, 15.3);
    amberWindow.castShadow = true;
    hoodGroup.add(amberWindow);

    // Top Amber Glass Roof Pane
    const amberRoofPaneGeo = new THREE.BoxGeometry(25.8, 0.3, 13.8);
    const amberRoofPane = new THREE.Mesh(amberRoofPaneGeo, matAmberWindow);
    amberRoofPane.position.set(0, 0.1, 7.5);
    hoodGroup.add(amberRoofPane);

    // Front Handle Bar on bottom edge of hood
    const hoodHandle = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.3, 0.5), matStainlessSteel);
    hoodHandle.position.set(0, -5.2, 16.1);
    hoodGroup.add(hoodHandle);

    // ==========================================
    // 6. DUAL PNEUMATIC GAS STRUTS (TY BEN KHÍ NÉN)
    // ==========================================
    // Left gas strut assembly
    const leftGasStrutGroup = new THREE.Group();
    leftGasStrutGroup.position.set(-12.4, 8.2, -6.5);
    machineRoot.add(leftGasStrutGroup);

    const leftStrutBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 4.0, 16), matDarkMedicalBezel);
    leftStrutBody.position.y = 2.0;
    leftGasStrutGroup.add(leftStrutBody);

    const leftGasStrutRod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 16), matStainlessSteel);
    leftGasStrutRod.position.y = 4.2;
    leftGasStrutGroup.add(leftGasStrutRod);

    // Right gas strut assembly
    const rightGasStrutGroup = new THREE.Group();
    rightGasStrutGroup.position.set(12.4, 8.2, -6.5);
    machineRoot.add(rightGasStrutGroup);

    const rightStrutBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 4.0, 16), matDarkMedicalBezel);
    rightStrutBody.position.y = 2.0;
    rightGasStrutGroup.add(rightStrutBody);

    const rightGasStrutRod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 16), matStainlessSteel);
    rightGasStrutRod.position.y = 4.2;
    rightGasStrutGroup.add(rightGasStrutRod);

    // ==========================================
    // 7. LAB BENCH TABLE
    // ==========================================
    const labBenchMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.05
    });
    const labBench = new THREE.Mesh(new THREE.BoxGeometry(42, 1.2, 28), labBenchMat);
    labBench.position.y = -0.6;
    labBench.receiveShadow = true;
    scene.add(labBench);

    sceneContextRef.current = {
      scene,
      camera,
      renderer,
      controls,
      machineRoot,
      exteriorGroup,
      internalsGroup,
      reagentDiskGroup,
      cuvetteDiskGroup,
      reagentArmGroup,
      probe1,
      mixerArmGroup,
      mixerPaddle,
      hoodGroup,
      leftGasStrutGroup,
      rightGasStrutGroup,
      leftGasStrutRod,
      rightGasStrutRod,
      syringePlungers,
      coolingFanBlades,
      matGlowingCyanLed,
      matDiagnosticHeartbeat,
      matDiagnosticBus,
      uvOpticalLight,
      targetCameraPos: new THREE.Vector3(0, 15, 34),
      targetControlsLookAt: new THREE.Vector3(0, 7.5, 0)
    };

    // Resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const ctx = sceneContextRef.current;
      if (!ctx) return;

      // Update OrbitControls
      ctx.controls.autoRotate = isAutoRotating;
      ctx.controls.autoRotateSpeed = 1.0;

      // Smooth interpolation for camera & lookAt target ONLY when an automated preset is moving
      if (isCameraAnimatingRef.current) {
        ctx.camera.position.lerp(ctx.targetCameraPos, 0.08);
        ctx.controls.target.lerp(ctx.targetControlsLookAt, 0.08);
        if (
          ctx.camera.position.distanceTo(ctx.targetCameraPos) < 0.08 &&
          ctx.controls.target.distanceTo(ctx.targetControlsLookAt) < 0.08
        ) {
          ctx.camera.position.copy(ctx.targetCameraPos);
          ctx.controls.target.copy(ctx.targetControlsLookAt);
          isCameraAnimatingRef.current = false;
        }
      }
      ctx.controls.update();

      if (isSystemRunning) {
        // Continuous Reagent & Cuvette Carousel Rotation
        ctx.reagentDiskGroup.rotation.y += 0.005;
        ctx.cuvetteDiskGroup.rotation.y += 0.0035;

        // Pipetting arm movement
        const cycleTime = (time * 0.8) % (Math.PI * 2);
        ctx.reagentArmGroup.rotation.y = Math.sin(cycleTime) * 0.65 - 0.2;
        const probeDip = Math.max(0, Math.sin(cycleTime * 2)) * 0.6;
        ctx.probe1.position.y = 1.2 - probeDip;

        // Mixer rotation
        ctx.mixerArmGroup.rotation.y = Math.cos(cycleTime) * 0.45 + 0.1;
        ctx.mixerPaddle.rotation.y += 0.45;
        ctx.mixerPaddle.position.y = 1.0 - Math.max(0, Math.cos(cycleTime * 2)) * 0.5;

        // Syringe pump piston aspiration & dispensing strokes!
        const syringeStroke = Math.sin(cycleTime * 2) * 0.45;
        ctx.syringePlungers.forEach((piston, pIdx) => {
          piston.position.y = 1.8 + (pIdx === 0 ? syringeStroke : -syringeStroke);
        });

        // Peltier cooling fan rotation
        ctx.coolingFanBlades.rotation.y += 0.35;

        // Mainboard diagnostic LEDs blinking
        ctx.matDiagnosticHeartbeat.emissiveIntensity = Math.sin(time * 8) > 0.2 ? 3.0 : 0.2;
        ctx.matDiagnosticBus.emissiveIntensity = Math.sin(time * 14 + 1) > 0 ? 2.5 : 0.1;

        // Dynamic telemetry coordinates
        const curX = (142.84 + Math.sin(time * 0.8) * 12.4).toFixed(2);
        const curY = (88.12 + Math.cos(time * 0.8) * 8.2).toFixed(2);
        const curZ = (-18.30 - probeDip * 25.0).toFixed(2);

        if (Math.floor(time * 10) % 2 === 0) {
          setTelemetryCoords({
            x: `${curX} mm`,
            y: `${curY} mm`,
            z: `${curZ} mm`
          });
        }
      }

      // Smooth hood open/close
      const targetHoodAngle = isHoodOpen ? -Math.PI * 0.35 : 0;
      ctx.hoodGroup.rotation.x += (targetHoodAngle - ctx.hoodGroup.rotation.x) * 0.08;

      // Articulate pneumatic gas struts with hood angle
      if (ctx.leftGasStrutGroup && ctx.rightGasStrutGroup && ctx.leftGasStrutRod && ctx.rightGasStrutRod) {
        const strutPitch = -ctx.hoodGroup.rotation.x * 0.32;
        ctx.leftGasStrutGroup.rotation.x = strutPitch;
        ctx.rightGasStrutGroup.rotation.x = strutPitch;
        const rodExtension = 4.2 + (-ctx.hoodGroup.rotation.x) * 1.8;
        ctx.leftGasStrutRod.position.y = rodExtension;
        ctx.rightGasStrutRod.position.y = rodExtension;
      }

      // Pulse LED and optics
      const pulse = Math.sin(time * 3) * 0.5 + 0.5;
      ctx.matGlowingCyanLed.emissiveIntensity = 1.8 + pulse * 0.8;
      ctx.uvOpticalLight.intensity = 2.5 + Math.sin(time * 6) * 1.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('wheel', handleWheelEvent);
      controls.dispose();
      renderer.dispose();
    };
  }, [isSystemRunning, isAutoRotating, modelId, onToggleHood]);

  // Manage ViewMode changes (Full, Internals, X-Ray)
  useEffect(() => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;

    if (viewMode === 'full') {
      ctx.exteriorGroup.visible = true;
      ctx.exteriorGroup.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
            mesh.material.depthWrite = true;
          }
        }
      });
      ctx.internalsGroup.visible = true; // Still there beneath, occluded naturally
    } else if (viewMode === 'internals') {
      // Hide exterior panels so motherboards, syringe pumps, PSU, and motors are completely exposed!
      ctx.exteriorGroup.visible = false;
      ctx.internalsGroup.visible = true;
    } else if (viewMode === 'xray') {
      // Semi-transparent X-Ray chassis
      ctx.exteriorGroup.visible = true;
      ctx.internalsGroup.visible = true;
      ctx.exteriorGroup.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.transparent = true;
            mesh.material.opacity = 0.28;
            mesh.material.depthWrite = false;
          }
        }
      });
    }
  }, [viewMode]);

  // Handle Zoom In (+), Zoom Out (-), and Fit Overview
  const handleZoomIn = () => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;
    isCameraAnimatingRef.current = false;
    const forward = new THREE.Vector3().subVectors(ctx.controls.target, ctx.camera.position);
    const dist = forward.length();
    if (dist > ctx.controls.minDistance + 2) {
      forward.normalize();
      ctx.camera.position.addScaledVector(forward, Math.min(8, dist - ctx.controls.minDistance - 1));
      ctx.controls.update();
    }
  };

  const handleZoomOut = () => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;
    isCameraAnimatingRef.current = false;
    const backward = new THREE.Vector3().subVectors(ctx.camera.position, ctx.controls.target);
    const dist = backward.length();
    if (dist < ctx.controls.maxDistance - 8) {
      backward.normalize();
      ctx.camera.position.addScaledVector(backward, 10);
      ctx.controls.update();
    }
  };

  const handleFitOverview = () => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;
    isCameraAnimatingRef.current = true;
    ctx.targetCameraPos.set(0, 25, 54);
    ctx.targetControlsLookAt.set(0, 10, 0);
    setActiveCameraPreset('panoramic');
    setSelectedComponentId(null);
  };

  // Handle Camera Presets (Reset View, Top View, Side View, Panoramic, Subsystems)
  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    setActiveCameraPreset(preset);
    setSelectedComponentId(null);
    if (onCameraChange) onCameraChange(preset);
    const ctx = sceneContextRef.current;
    if (!ctx) return;

    isCameraAnimatingRef.current = true;

    if (preset === 'reset' || preset === 'panoramic') {
      // Recenter camera and pivot target to canonical center
      ctx.targetCameraPos.set(0, 16, 36);
      ctx.targetControlsLookAt.set(0, 7.5, 0);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'top') {
      // Orthogonal top-down bird's eye view over carousels and cuvettes
      ctx.targetCameraPos.set(0, 42, 0.2);
      ctx.targetControlsLookAt.set(0, 7.5, 0);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'side') {
      // Lateral profile view showing height, robotic probe arm, and fluidics
      const curX = ctx.camera.position.x;
      const targetSideX = curX > 10 ? -38 : 38;
      ctx.targetCameraPos.set(targetSideX, 9, 0.5);
      ctx.targetControlsLookAt.set(0, 7.5, 0);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'carousel') {
      ctx.targetCameraPos.set(-6, 26, 14);
      ctx.targetControlsLookAt.set(-5.5, 15.5, 0.5);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'pipetting') {
      ctx.targetCameraPos.set(-2, 23, 12);
      ctx.targetControlsLookAt.set(-2.5, 16.5, -1.0);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'optics') {
      ctx.targetCameraPos.set(8, 22, 9);
      ctx.targetControlsLookAt.set(5.2, 16.5, -4.5);
      ctx.camera.up.set(0, 1, 0);
    } else if (preset === 'internals') {
      // Automatically switch to exposed internal view mode
      setViewMode('internals');
      ctx.targetCameraPos.set(0, 10, 24);
      ctx.targetControlsLookAt.set(0, 6, 0);
      ctx.camera.up.set(0, 1, 0);
    }
  }, [onCameraChange]);

  // Sync activePreset prop from parent if provided
  useEffect(() => {
    if (activePreset && activePreset !== activeCameraPreset) {
      handleCameraPreset(activePreset);
    }
  }, [activePreset, activeCameraPreset, handleCameraPreset]);

  // Expose imperative ref methods to parent (ConsoleWorkspace)
  useImperativeHandle(ref, () => ({
    resetView: () => handleCameraPreset('reset'),
    setTopView: () => handleCameraPreset('top'),
    setSideView: () => handleCameraPreset('side'),
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    fitOverview: handleFitOverview,
    recenterTarget: () => {
      const ctx = sceneContextRef.current;
      if (!ctx) return;
      isCameraAnimatingRef.current = true;
      ctx.targetControlsLookAt.set(0, 7.5, 0);
      ctx.camera.up.set(0, 1, 0);
    },
    setPreset: (preset: CameraPreset) => handleCameraPreset(preset)
  }), [handleCameraPreset]);

  // Handle Focus on specific Hardware Component
  const handleSelectComponent = (comp: ComponentFocusDetail) => {
    setSelectedComponentId(comp.id);
    const ctx = sceneContextRef.current;
    if (!ctx) return;

    // If focusing on an internal component, automatically expose internals
    if (comp.category === 'Electronic' || comp.category === 'Hydraulic' || comp.category === 'Thermal') {
      if (viewMode === 'full') {
        setViewMode('internals');
      }
    }

    isCameraAnimatingRef.current = true;
    ctx.targetControlsLookAt.set(...comp.targetPos);
    ctx.targetCameraPos.set(...comp.cameraPos);
  };

  const [activeCategory, setActiveCategory] = useState<'all' | 'Mechanical' | 'Electronic' | 'Hydraulic' | 'Optical'>('all');
  const [isDetailsMinimized, setIsDetailsMinimized] = useState(false);
  const componentScrollRef = useRef<HTMLDivElement>(null);

  const filteredComponents = useMemo(() => {
    if (activeCategory === 'all') return MACHINE_COMPONENTS;
    return MACHINE_COMPONENTS.filter(c => c.category === activeCategory);
  }, [activeCategory]);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (componentScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      componentScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const selectedCompData = MACHINE_COMPONENTS.find(c => c.id === selectedComponentId);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex flex-col">
      {/* 3D Canvas Area Container */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        {/* 3D Canvas Mount Point */}
        <div
          ref={containerRef}
          className="w-full h-[540px] sm:h-[600px] md:h-[660px] lg:h-[700px] relative cursor-grab active:cursor-grabbing select-none"
          title="Kéo chuột trái để xoay tự do • Chuột phải để di chuyển • Cuộn chuột để phóng to/thu nhỏ • Nhấp linh kiện bên dưới để tự động bay góc nhìn"
        />

        {/* Top Minimalist Floating Header Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
          {/* Left Brand Badge */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/90 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-white font-bold tracking-tight font-mono-code">
                DIRUI {modelId}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-cyan-300 font-mono-code bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                3D Service Manual
              </span>
            </div>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800/90 shadow-lg">
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'full'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              type="button"
              title="Xem vỏ ngoài nguyên bản máy Dirui CS-T240"
            >
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Vỏ Ngoài</span>
            </button>

            <button
              onClick={() => setViewMode('internals')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'internals'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              type="button"
              title="Mở toàn bộ khung máy để xem bo mạch chủ, bơm tiêm syringe 500uL và cụm thủy lực"
            >
              <span className="material-symbols-outlined text-[15px]">developer_board</span>
              <span>Nội Thất &amp; Bo Mạch</span>
            </button>

            <button
              onClick={() => setViewMode('xray')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'xray'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              type="button"
              title="Chế độ trong suốt nhìn xuyên thấu toàn bộ cấu trúc cơ điện tử bên trong"
            >
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>X-Ray</span>
            </button>
          </div>

          {/* Right Quick Controls */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800/90 shadow-lg">
            <button
              onClick={onToggleHood}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isHoodOpen ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isHoodOpen ? 'Đóng nắp mica hổ phách' : 'Mở nắp mica hổ phách'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isHoodOpen ? 'lock_open' : 'lock'}
              </span>
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isAutoRotating ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isAutoRotating ? 'Dừng tự động xoay' : 'Bật tự động xoay 360°'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">360</span>
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-0.5 hidden sm:block" />

            <button
              onClick={() => handleCameraPreset('panoramic')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors hidden sm:flex items-center gap-1 ${
                activeCameraPreset === 'panoramic' || activeCameraPreset === 'reset'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Reset góc nhìn chính tâm (0, 7.5, 0)"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
              <span>Reset</span>
            </button>

            <button
              onClick={handleFitOverview}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center"
              title="Thu nhỏ bao quát toàn bộ máy"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">fit_screen</span>
            </button>

            <button
              onClick={() => handleCameraPreset('top')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors hidden md:flex items-center gap-1 ${
                activeCameraPreset === 'top' ? 'bg-slate-800 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Nhìn thẳng từ đỉnh máy xuống 2 mâm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">layers</span>
              <span>Top</span>
            </button>

            <button
              onClick={() => handleCameraPreset('side')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors hidden md:flex items-center gap-1 ${
                activeCameraPreset === 'side' ? 'bg-slate-800 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Góc nhìn cạnh bên sườn"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">view_sidebar</span>
              <span>Side</span>
            </button>
          </div>
        </div>

        {/* Floating Mini Zoom Bar on the Right */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1 rounded-xl shadow-xl border border-slate-800/80">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-cyan-600 text-white transition-colors"
            title="Phóng to gần hơn (+)"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-cyan-600 text-white transition-colors"
            title="Thu nhỏ xem rộng hơn (−)"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <div className="w-4 h-[1px] bg-slate-800 my-0.5" />
          <button
            onClick={handleFitOverview}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors"
            title="Thu nhỏ toàn cảnh"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">fit_screen</span>
          </button>
          <button
            onClick={() => handleCameraPreset('panoramic')}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-emerald-600 text-white transition-colors"
            title="Về chính tâm chuẩn"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          </button>
        </div>

        {/* Floating Hint in Top Center */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden lg:flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-800/40 text-[10px] text-slate-400 font-mono-code">
          <span className="material-symbols-outlined text-[12px] text-cyan-400">touch_app</span>
          <span>Chuột trái: Xoay 3D • Chuột phải: Pan di chuyển • Cuộn chuột: Phóng to/Thu nhỏ</span>
        </div>

        {/* Floating Component Detail Card (Top-Right, compact & collapsible) */}
        {selectedCompData && (
          <div className="absolute top-16 right-3 z-30 w-72 sm:w-84 max-w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-md rounded-xl shadow-2xl border border-cyan-500/50 flex flex-col animate-fade-in overflow-hidden">
            {/* Header of Detail Card */}
            <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedCompData.category}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-code">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ĐẠT CHUẨN
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDetailsMinimized(!isDetailsMinimized)}
                  className="text-slate-400 hover:text-white text-xs p-1 rounded hover:bg-slate-800"
                  title={isDetailsMinimized ? 'Mở rộng' : 'Thu gọn'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isDetailsMinimized ? 'expand_more' : 'expand_less'}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedComponentId(null)}
                  className="text-slate-400 hover:text-white text-xs p-1 rounded hover:bg-slate-800"
                  title="Đóng bảng chi tiết"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="px-3 py-2">
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {selectedCompData.name}
              </h3>
            </div>

            {/* Expandable Body */}
            {!isDetailsMinimized && (
              <div className="px-3 pb-3 flex flex-col gap-2 border-t border-slate-900 pt-2">
                <p className="text-[11px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
                  {selectedCompData.description}
                </p>

                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-cyan-300 font-mono-code">
                    Thông số kỹ thuật Dirui:
                  </span>
                  <ul className="text-[10px] text-slate-200 flex flex-col gap-1 font-mono-code max-h-28 overflow-y-auto">
                    {selectedCompData.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1">
                        <span className="text-cyan-400 text-[9px] mt-0.5">▸</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* SEPARATE HARDWARE COMPONENT EXPLORER PANEL (PLACED OUTSIDE & BELOW CANVAS) */}
      {/* ======================================================================= */}
      <div className="w-full bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 flex flex-col gap-2.5">
        {/* Category Tabs Filter & Global Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 uppercase font-bold font-mono-code whitespace-nowrap mr-1">
              Phân Hệ:
            </span>

            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#00629b] text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              type="button"
            >
              Tất Cả ({MACHINE_COMPONENTS.length})
            </button>

            <button
              onClick={() => setActiveCategory('Mechanical')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Mechanical'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              type="button"
            >
              Mâm Xoay &amp; Cơ Khí
            </button>

            <button
              onClick={() => setActiveCategory('Electronic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Electronic'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              type="button"
            >
              8 Bo Mạch Điện Tử
            </button>

            <button
              onClick={() => setActiveCategory('Hydraulic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Hydraulic'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              type="button"
            >
              Bơm Syringe &amp; Thủy Lực
            </button>

            <button
              onClick={() => setActiveCategory('Optical')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Optical'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              type="button"
            >
              Quang Học &amp; Bể Ủ
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => handleScrollCarousel('left')}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Cuộn sang trái"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={() => handleScrollCarousel('right')}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Cuộn sang phải"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Component Buttons Carousel */}
        <div
          ref={componentScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent select-none"
        >
          {/* Quick Panoramic button */}
          <button
            onClick={() => {
              setSelectedComponentId(null);
              handleCameraPreset('panoramic');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeCameraPreset === 'panoramic' && !selectedComponentId
                ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">center_focus_strong</span>
            <span>Toàn Cảnh Máy</span>
          </button>

          {/* Filtered Components List */}
          {filteredComponents.map(comp => {
            const isSelected = selectedComponentId === comp.id;
            let badgeBg = 'text-slate-400';
            let activeStyle = 'bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-md';

            if (comp.category === 'Electronic') {
              badgeBg = 'text-emerald-400';
              activeStyle = 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md';
            } else if (comp.category === 'Hydraulic') {
              badgeBg = 'text-cyan-400';
              activeStyle = 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md';
            } else if (comp.category === 'Optical') {
              badgeBg = 'text-purple-400';
              activeStyle = 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-md';
            } else if (comp.category === 'Mechanical') {
              badgeBg = 'text-amber-400';
              activeStyle = 'bg-amber-600 text-white ring-2 ring-amber-400 shadow-md';
            }

            return (
              <button
                key={comp.id}
                onClick={() => handleSelectComponent(comp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? activeStyle
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
                type="button"
              >
                <span className={`material-symbols-outlined text-[15px] ${isSelected ? 'text-white' : badgeBg}`}>
                  {comp.category === 'Electronic'
                    ? 'memory'
                    : comp.category === 'Hydraulic'
                    ? 'water_drop'
                    : comp.category === 'Optical'
                    ? 'wb_iridescent'
                    : 'precision_manufacturing'}
                </span>
                <span>{comp.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Real-time Telemetry & Hardware Diagnostics Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono-code text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Tọa độ Robot X/Y/Z:</span>
              <span className="text-white font-bold">{telemetryCoords.x} / {telemetryCoords.y} / {telemetryCoords.z}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Cảm biến LLD:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Bề mặt đạt chuẩn
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Bể ủ phản ứng:</span>
              <span className="text-cyan-300 font-semibold">37.0°C ± 0.1°C</span>
            </div>

            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="text-slate-400">Buồng hóa chất:</span>
              <span className="text-cyan-300 font-semibold">8.0°C (Peltier 5-15°C)</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span>Dirui Service Standard:</span>
            <span className="text-white font-semibold">Model CS-T240</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ThreeMachineViewer.displayName = 'ThreeMachineViewer';
