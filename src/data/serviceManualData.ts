export interface TroubleshootingItem {
  code: string;
  category: 'STIRRING' | 'RINSING' | 'REACTION_DISK' | 'SAMPLE_PROBE' | 'REAGENT_PROBE' | 'SYRINGE_PUMP' | 'INCUBATION_BATH' | 'REFRIGERATION' | 'SYSTEM_RESET' | 'OPTICS_AD' | 'ISE';
  name: string;
  description: string;
  phenomenon: string;
  solution: string[];
  testPoints?: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface SparePartItem {
  sapCode: string;
  name: string;
  nameEn: string;
  category: 'CONSUMABLE' | 'ASSEMBLY' | 'CIRCUIT_BOARD' | 'SOLENOID_VALVE' | 'PUMP' | 'MOTOR' | 'SENSOR' | 'TUBING';
  spec?: string;
  replacementPeriod?: string;
  stockQty?: number;
}

export interface FluidicComponentInfo {
  tag: string;
  name: string;
  type: 'VALVE' | 'PUMP' | 'TANK' | 'SENSOR' | 'MANIFOLD';
  function: string;
  operatingParam: string;
  wiringPort?: string;
}

export const OFFICIAL_DIRUI_CS_T240_SPECS = {
  model: 'DIRUI CS-T240',
  standardSpec: '2-disks + 1-probe + 1-stirring rod',
  throughput: '240 test/giờ tốc độ không đổi (360 test/giờ khi tích hợp ISE)',
  cycleTime: '15 giây/chu kỳ (Working period: 15s)',
  sampleReagentDisk: {
    totalPositions: 67,
    samplePositions: '21 vị trí thường quy (ống nghiệm Φ12-16×75-100mm hoặc cóng tiêu chuẩn Φ14×37mm)',
    reagentPositions: '45 vị trí thuốc thử (lọ 20mL, 70mL, 100mL)',
    detergentPosition: 'Vị trí cố định số 45 (dành riêng cho dung dịch tẩy rửa không phosphat CS)',
    coolingSystem: 'Làm lạnh bán dẫn Peltier liên tục duy trì 5°C - 15°C (hoặc 6°C - 10°C), dòng tải Peltier > 5A',
    barcodeReader: 'Đầu quét mã vạch quang học Code 128 (17 chữ số) tự động nhận diện lọ hóa chất'
  },
  reactionDisk: {
    totalCuvettes: 120,
    cuvetteArrangement: '6 bộ (20 cóng/bộ), nhựa quang học độ cứng cao (hard optical plastic cuvette)',
    opticalPath: '6 mm',
    reactionVolume: '150 μL - 550 μL',
    incubationBath: 'Bể ủ ổn nhiệt tuần hoàn nước 37.0°C ± 0.1°C (điều khiển PID, que gia nhiệt 200W, cảm biến mức nước và xả tràn)',
    reactionTime: '15 phút (đo quang động học liên tục trong 13 phút với 49 điểm đo quang)'
  },
  probeAndStirring: {
    probeCount: 1,
    probeType: '1 kim hút tích hợp đa năng cho cả mẫu và thuốc thử',
    sampleVolume: '3 ~ 35 μL (bước tăng 0.1 μL)',
    reagentVolume: '10 ~ 350 μL (bước tăng 1 μL)',
    probeFeatures: 'Cảm biến mức chất lỏng kỹ thuật số (LLD điện dung), chống va chạm dọc/ngang, rửa thành trong và ngoài bằng bơm áp lực',
    stirringUnit: '1 cánh khuấy xoắn tráng men Teflon cường độ cao, dẫn động bởi motor cốc rỗng tốc độ cao (hollow cup motor)',
    syringePump: 'Bơm tiêm piston thủy tinh chính xác 500 μL'
  },
  opticalSystem: {
    type: 'Hệ thống quang học đo sau cách xạ (Grating rear spectrophotometry + diode array)',
    wavelengths: [340, 380, 405, 450, 480, 505, 546, 570, 600, 660, 700, 750],
    precision: '±2 nm',
    lightSource: 'Đèn Halogen thạch anh tuổi thọ cao 12V / 20W (buồng đèn có ống làm mát)',
    absorbanceRange: '0 ~ 3.3 ABS',
    sensors: '12 cảm biến quang điện cố định + 12 bộ khuếch đại tín hiệu + mạch biến đổi Logarit',
    qualityIndex: 'Giá trị kiểm tra cường độ quang ≤ 18,000; Độ lệch trắng cóng phản ứng cuvette blank trong khoảng -800 ~ +800'
  },
  autoRinsingUnit: {
    steps: 'Rửa tự động 8 điểm dừng 12 bước (8-stop 12-step automatic rinsing)',
    nozzles: '4 cụm kim rửa đôi (Nozzle 1-4) kết hợp đầu lau khô (wiping head block)',
    rinseSequence: 'Bước 1: Hút dịch phản ứng + Bơm nước tẩy rửa -> Bước 2: Hút tẩy rửa + Bơm nước tinh khiết -> Bước 3: Hút + Bơm nước tinh khiết -> Bước 4: Đo trắng nước -> Bước 5: Hút cạn + Lau khô cuvette',
    rinseTemp: 'Nước ấm rửa cuvette ~34°C cung cấp từ bình đun nước cấp',
    vacuumPressure: 'Áp lực âm buồng hút chân không đạt ≥ -70 kPa (-0.7 kgf/cm²)'
  },
  physicalAndFacility: {
    dimensions: '998 mm (Dài) × 752 mm (Rộng) × 515 mm (Cao)',
    weight: 'Khoảng 120 kg',
    powerSupply: 'AC 220V/230V ±22V, 50Hz/60Hz, Công suất định mức 650VA (Khuyên dùng UPS online 3kVA)',
    fuse: 'F6.3AL250V (5mm × 20mm)',
    waterConsumption: 'Tối đa 5 - 6 Lít/giờ nước khử ion siêu sạch (độ dẫn điện < 1 μS/cm, áp lực 50 - 150 kPa)',
    operatingEnvironment: 'Nhiệt độ 15°C ~ 32°C, độ ẩm tương đối 30% ~ 75%, độ cao < 2000m so với mực nước biển',
    noiseLevel: '< 70 dB ở khoảng cách 1 mét'
  }
};

export const DIRUI_TROUBLESHOOTING_CODES: TroubleshootingItem[] = [
  // Stirring mechanism
  {
    code: '1-1',
    category: 'STIRRING',
    name: 'Cơ cấu khuấy không lên đỉnh giếng rửa',
    description: 'Mixing mechanism fails to reach the vertex when it rises at the rinsing bath side.',
    phenomenon: 'Cơ cấu khuấy không chuyển động hoặc không đạt đỉnh; có thể lên đỉnh nhưng không nhận quang trở điểm 0.',
    solution: [
      '1. Kiểm tra chuyển động cơ khí trục khuấy, vệ sinh ray trượt nếu có ma sát lớn.',
      '2. Kiểm tra jack nối motor trục khuấy và độ dẫn điện của dây dẫn.',
      '3. Kiểm tra module mạch điều khiển motor trên bo mạch khuấy/rửa (Rinsing & mixing board).',
      '4. Đo đồng hồ VOM tại jack P02 chân 5-6: điện áp phải chuyển biến 0V - 5V khi lên đỉnh; nếu không đổi kiểm tra quang trở (optocoupler).'
    ],
    testPoints: 'P02 pin 5 & 6 (0V - 5V DC)',
    severity: 'WARNING'
  },
  {
    code: '1-4',
    category: 'STIRRING',
    name: 'Cơ cấu khuấy không tới giếng rửa',
    description: 'Mixing mechanism fails to reach the rinsing bath when it moves to rinsing bath.',
    phenomenon: 'Motor quay khuấy không di chuyển hoặc có lắc nhưng không đến đúng tâm giếng rửa.',
    solution: [
      '1. Kiểm tra vị trí lắp đặt của cặp cảm biến giới hạn trái/phải (limit optocouplers).',
      '2. Dùng tay xoay cơ cấu, đo điện áp chân 8 và 9 của jack P02 (chuyển đổi giữa 0V và 5V).',
      '3. Kiểm tra tín hiệu vào bo mạch reaction plate coupler circuit board.'
    ],
    testPoints: 'P02 pin 8 & 9 (0V - 5V DC)',
    severity: 'WARNING'
  },
  {
    code: '1-5',
    category: 'STIRRING',
    name: 'Cơ cấu khuấy không vào đúng cóng phản ứng',
    description: 'Mixing mechanism fails to reach the reaction cuvette when it moves to reaction cup.',
    phenomenon: 'Cánh khuấy xoay sang mâm phản ứng nhưng không vào đúng tâm cóng.',
    solution: [
      '1. Kiểm tra cảm biến giới hạn trái, đo VOM tại chân 11 và 12 của jack P02 (biến thiên 0V - 5V).',
      '2. Căn chỉnh lại chốt căn độ cao (adjust block) và siết chặt ốc M2 giữ cánh khuấy.',
      '3. Kiểm tra điện áp chân 11 của socket J02 trên bo mạch.'
    ],
    testPoints: 'P02 pin 11 & 12 (0V - 5V DC)',
    severity: 'WARNING'
  },
  {
    code: '1-13',
    category: 'STIRRING',
    name: 'Lỗi IC điều khiển nâng hạ khuấy U9',
    description: 'The drive chip of mixing mechanism lifting motor is abnormal.',
    phenomenon: 'Motor nâng hạ khuấy không chạy, phát chuông cảnh báo hệ thống.',
    solution: [
      '1. Kiểm tra mối hàn IC điều khiển motor U9 trên bo mạch khuấy/rửa xem có bị hở chân (poor soldering) không.',
      '2. Kiểm tra tiếp xúc dây dẫn motor nâng hạ.'
    ],
    testPoints: 'IC U9 trên Rinsing & Mixing Board',
    severity: 'CRITICAL'
  },
  {
    code: '1-14',
    category: 'STIRRING',
    name: 'Lỗi IC điều khiển xoay khuấy U8',
    description: 'Mixing mechanism swinging motor drive chip is abnormal.',
    phenomenon: 'Motor xoay cánh khuấy không phản hồi xung điều khiển.',
    solution: [
      '1. Kiểm tra IC điều khiển U8 trên bo mạch Rinsing & Mixing.',
      '2. Kiểm tra tiếp xúc dây dẫn của motor xoay góc.'
    ],
    testPoints: 'IC U8 trên Rinsing & Mixing Board',
    severity: 'CRITICAL'
  },

  // Rinsing mechanism
  {
    code: '3-1',
    category: 'RINSING',
    name: 'Cơ cấu rửa cóng không lên đỉnh',
    description: 'Cuvette rinsing mechanism fails to reach the vertex when it rises.',
    phenomenon: 'Khối trạm rửa 4 đầu kim không nâng lên hết hành trình hoặc không phát hiện điểm 0.',
    solution: [
      '1. Kiểm tra cơ cấu thanh trượt nâng hạ trạm rửa, tra dầu chuyên dụng nếu kẹt cơ.',
      '2. Kiểm tra dây dẫn và jack nối của motor nâng hạ trạm rửa.',
      '3. Kiểm tra cảm biến quang P02 chân 1-3 (điện áp 5V, chân 2 biến thiên 0-5V khi lên đỉnh).'
    ],
    testPoints: 'P02 pin 1, 2, 3 (0V - 5V)',
    severity: 'WARNING'
  },
  {
    code: '3-4',
    category: 'RINSING',
    name: 'Lỗi IC điều khiển motor trạm rửa U7',
    description: 'Abnormal drive chip of cuvette rinsing mechanism motor.',
    phenomenon: 'Trạm rửa bất động trong suốt chu trình phân tích.',
    solution: [
      '1. Kiểm tra IC U7 trên bo mạch Rinsing & Mixing xem có bong chân hàn hay chập cháy.',
      '2. Kiểm tra điện trở cuộn dây của motor trạm rửa.'
    ],
    testPoints: 'IC U7 trên Rinsing & Mixing Board',
    severity: 'CRITICAL'
  },

  // Reaction disk
  {
    code: '4-1',
    category: 'REACTION_DISK',
    name: 'Đếm xung mâm phản ứng sai lệch',
    description: 'Reaction disk fails to rotate to position (Count optocoupler mismatch).',
    phenomenon: 'Số lượng xung đếm thực tế không trùng khớp với số cóng quay (120 vị trí).',
    solution: [
      '1. Kiểm tra độ dẫn điện của cảm biến quang đếm bước 1 (counting optocoupler 1) tới bo mạch mâm phản ứng.',
      '2. Làm sạch bụi và vết bẩn trên đĩa mã hóa 120 răng (120-tooth code disk).',
      '3. Kiểm tra mạch khuếch đại tín hiệu cảm biến quang trên Reaction Disk Board.'
    ],
    testPoints: 'Socket J704 / J705 trên Reaction Disk Board',
    severity: 'CRITICAL'
  },
  {
    code: '4-3',
    category: 'REACTION_DISK',
    name: 'Mâm phản ứng không tìm thấy điểm 0 (Reset)',
    description: 'Reaction disk cannot find the zeroing position during reset.',
    phenomenon: 'Khi reset máy, mâm cóng quay liên tục không dừng đúng điểm gốc (Vị trí số 71).',
    solution: [
      '1. Kiểm tra cảm biến quang điểm 0 (zeroing optocoupler) và chốt định vị.',
      '2. Kiểm tra dây dẫn kết nối từ cảm biến về jack J704 trên bo mạch mâm phản ứng.',
      '3. Kiểm tra bánh răng truyền động 300 răng và động cơ bước PK266M-01B.'
    ],
    testPoints: 'Cảm biến Zero OC tại vị trí gốc #71',
    severity: 'CRITICAL'
  },
  {
    code: '4-7',
    category: 'REACTION_DISK',
    name: 'Lỗi IC điều khiển motor mâm phản ứng U3',
    description: 'Reaction board motor drive chip is abnormal.',
    phenomenon: 'Motor mâm phản ứng không quay hoặc rung giật mạnh.',
    solution: [
      '1. Kiểm tra IC driver U3 trên bo mạch Reaction Disk Board.',
      '2. Kiểm tra nguồn cấp +24V từ bộ nguồn Switching Box N4.'
    ],
    testPoints: 'IC U3 trên Reaction Disk Board, Nguồn +24V',
    severity: 'CRITICAL'
  },

  // Sample/Reagent probe
  {
    code: '5-3',
    category: 'SAMPLE_PROBE',
    name: 'Kim hút báo chạm bề mặt bất thường',
    description: 'Touch occurs when sample probe descends.',
    phenomenon: 'Kim hút chạm đáy cóng mẫu hoặc báo mức sai khi hạ xuống.',
    solution: [
      '1. Xác nhận xem trong cóng mẫu có bệnh phẩm hay không (tối thiểu 100 μL).',
      '2. Kiểm tra vị trí đặt cóng mẫu trên mâm đã đúng khay chưa.',
      '3. Kiểm tra cáp dẻo (flexible cable) và bo mạch phát hiện mặt chất lỏng (LLD Board).'
    ],
    testPoints: 'Cáp dẻo LLD chân J6, J7',
    severity: 'WARNING'
  },
  {
    code: '8-1',
    category: 'REAGENT_PROBE',
    name: 'Kim hút không lên đến đỉnh khi nâng',
    description: 'Reagent/sample probe couldn’t reach the top while rising.',
    phenomenon: 'Cánh tay robot kim hút kẹt nửa chừng hoặc không nhận cảm biến quang đỉnh.',
    solution: [
      '1. Dùng tay di chuyển thử cụm kim; nếu nặng kiểm tra dây curoa toothed belt và thanh trượt tuyến tính.',
      '2. Đo điện áp chân 4-6 jack P042: phải có 5V; kiểm tra chân 11 socket J042 khi lên đỉnh (0V -> 5V).',
      '3. Kiểm tra IC điều khiển U12 trên bo mạch Sample/Reagent Disk Board.'
    ],
    testPoints: 'Jack P042 chân 4, 5, 6 và Socket J042 pin 11',
    severity: 'WARNING'
  },
  {
    code: '8-2',
    category: 'REAGENT_PROBE',
    name: 'Kim hút chạm thành lọ hoặc đáy lọ hóa chất',
    description: 'Probe detects liquid surface or collision with wall/bottom of bottle.',
    phenomenon: 'Kim hút va chạm vật lý vào thành lọ R1/R2 hoặc xuyên chạm đáy lọ.',
    solution: [
      '1. Căn chỉnh lại tọa độ tâm xoay ngang của kim hút để kim vào chính xác tâm nắp lọ.',
      '2. Kiểm tra thể tích hóa chất còn lại trong lọ (tối thiểu > 3mL).',
      '3. Kiểm tra độ nhạy cảm ứng điện dung của bo mạch LLD (Liquid Level Detection Board).'
    ],
    testPoints: 'Căn chỉnh tọa độ tại Menu Maintenance -> Reagent Probe Horizontal Check',
    severity: 'WARNING'
  },
  {
    code: '8-4',
    category: 'REAGENT_PROBE',
    name: 'Tín hiệu cảm ứng LLD kim hút luôn ở trạng thái chạm',
    description: 'Sample & reagent probe is in effective status of touching and liquid detecting all the time.',
    phenomenon: 'Hệ thống báo kim đang ngập trong chất lỏng ngay cả khi kim đang ở trên không.',
    solution: [
      '1. Dùng tăm bông cồn lau sạch đầu kim tiêm (loại bỏ cặn protein hoặc muối kết tinh).',
      '2. Đo VOM chân 10 âm, chân 9 dương của jack P042: trạng thái thường = 0, chạm = 1 (5V).',
      '3. Kiểm tra cáp mềm kết nối từ đầu kim về bo mạch LLD xem có bị ẩm ướt hoặc rò rỉ dung dịch không.'
    ],
    testPoints: 'P042 pin 9 & 10 (0V bình thường, 5V khi chạm)',
    severity: 'CRITICAL'
  },
  {
    code: '8-8',
    category: 'REAGENT_PROBE',
    name: 'Không phát hiện mặt thoáng chất lỏng lọ R1',
    description: 'Liquid surface is not detected at R1 position.',
    phenomenon: 'Lọ có hóa chất nhưng kim hạ xuống không nhận diện được bề mặt.',
    solution: [
      '1. Kiểm tra tiếp xúc dẫn điện của kim hút về bo mạch phát hiện chất lỏng.',
      '2. Kiểm tra độ nhạy mạch LLD bằng tính năng Probe Sensitivity Test.',
      '3. Bổ sung hóa chất nếu thể tích thực tế quá ít dưới ngưỡng đo.'
    ],
    testPoints: 'LLD Board J7 chân 3 (Surface Level)',
    severity: 'WARNING'
  },
  {
    code: '8-14',
    category: 'REAGENT_PROBE',
    name: 'Lỗi IC điều khiển motor nâng kim U12',
    description: 'Lifting motor drive chip U12 is abnormal.',
    phenomenon: 'Motor nâng hạ kim hút không hoạt động.',
    solution: [
      '1. Kiểm tra chân hàn IC U12 trên bo mạch Sample/Reagent Disk Board.',
      '2. Kiểm tra tiếp xúc dây dẫn motor nâng hạ kim.'
    ],
    testPoints: 'IC U12 trên Reagent/Sample Disk Board',
    severity: 'CRITICAL'
  },

  // Sample/Reagent disk
  {
    code: '10-2',
    category: 'REAGENT_PROBE',
    name: 'Mâm thuốc thử không dừng đúng vị trí',
    description: 'Sample & reagent disk fails to stop at the specified position.',
    phenomenon: 'Mâm hóa chất màu vàng dừng lệch vị trí lọ thuốc thử.',
    solution: [
      '1. Dùng tay xoay nhẹ mâm kiểm tra xem có cọ xát với buồng ủ lạnh Peltier không.',
      '2. Đo điện áp jack P041 chân 5-6 (phải dao động 0V - 5V theo răng mã hóa).',
      '3. Siết chặt ốc hãm puly răng của motor mâm hóa chất.'
    ],
    testPoints: 'Jack P041 chân 5 & 6',
    severity: 'CRITICAL'
  },
  {
    code: '10-4',
    category: 'REAGENT_PROBE',
    name: 'Không tìm thấy đầu đọc mã vạch hóa chất',
    description: 'Could not find sample/reagent barcode reader.',
    phenomenon: 'Hệ thống không thể nhận diện thông tin lọ hóa chất khi quét tự động.',
    solution: [
      '1. Kiểm tra cáp tín hiệu RS-232/USB của đầu đọc Barcode.',
      '2. Vệ sinh cửa sổ kính quang học của đầu đọc bằng gạc tẩm nước khử ion.',
      '3. Đặt lại (reset) đầu đọc barcode trong menu System Maintenance.'
    ],
    testPoints: 'Cửa sổ kính quét Barcode & Cổng J048',
    severity: 'WARNING'
  },

  // Syringe pump
  {
    code: '14-1',
    category: 'SYRINGE_PUMP',
    name: 'Bơm tiêm 500uL không lên đỉnh',
    description: 'Syringe pump doesn’t rise up to the top.',
    phenomenon: 'Piston thủy tinh của bơm tiêm không đẩy lên hết hành trình.',
    solution: [
      '1. Kiểm tra jack cắm motor bơm tiêm J103 / P103.',
      '2. Kiểm tra độ dẫn điện của dây dẫn motor.',
      '3. Kiểm tra cảm biến quang đỉnh bơm tiêm P043 chân 1, 5 (5V) và chân 4 (0V-5V).'
    ],
    testPoints: 'Jack P043 chân 1, 4, 5',
    severity: 'CRITICAL'
  },
  {
    code: '14-4',
    category: 'SYRINGE_PUMP',
    name: 'Lỗi IC điều khiển bơm tiêm U13',
    description: 'Syringe pump motor drive chip U13 is abnormal.',
    phenomenon: 'Bơm tiêm không phản hồi lệnh hút/xả dung dịch.',
    solution: [
      '1. Kiểm tra chân hàn IC U13 trên bo mạch Reagent/Sample Disk Board.',
      '2. Thay thế IC hoặc bo mạch nếu phát hiện hỏng hóc.'
    ],
    testPoints: 'IC U13 trên Reagent/Sample Disk Board',
    severity: 'CRITICAL'
  },

  // Incubation bath
  {
    code: '20-1',
    category: 'INCUBATION_BATH',
    name: 'Nhiệt độ bể ủ phản ứng vượt quá 45°C',
    description: 'The temperature of incubation bath is above 45°C.',
    phenomenon: 'Hệ thống báo động quá nhiệt nghiêm trọng, ngắt ngay nguồn gia nhiệt.',
    solution: [
      '1. Kiểm tra quạt tản nhiệt của máy xem có quay bình thường không.',
      '2. Kiểm tra cảm biến nhiệt độ bể ủ DS18B20 và jack cắm J05 trên bo mạch chính.',
      '3. Kiểm tra rơ le bán dẫn Solid-state Relay Board ngắt que gia nhiệt 200W.'
    ],
    testPoints: 'Socket J05 (Cảm biến nhiệt bể ủ) trên Main Control Board',
    severity: 'CRITICAL'
  },
  {
    code: '20-2',
    category: 'INCUBATION_BATH',
    name: 'Nhiệt độ bể ủ ngoài dải 37°C ± 0.5°C',
    description: 'The temperature of the incubation bath is out of 37°C ± 0.5°C.',
    phenomenon: 'Nhiệt độ không duy trì được ở mức chuẩn 37.0°C trong khi đang phân tích.',
    solution: [
      '1. Kiểm tra nhiệt độ phòng xét nghiệm (yêu cầu 15°C - 32°C).',
      '2. Kiểm tra tuần hoàn nước bể ủ qua bơm từ FLUME PUMP có hoạt động không.',
      '3. Kiểm tra que gia nhiệt 200W và cảm biến nhiệt độ.'
    ],
    testPoints: 'Bơm tuần hoàn nước bể ủ FLUME PUMP & Que đun 200W',
    severity: 'WARNING'
  },

  // Resetting & fluidic system
  {
    code: '143-2',
    category: 'SYSTEM_RESET',
    name: 'Quá thời gian cấp nước vào bình chứa',
    description: 'Water tank fluid circuit system failure, water adding overtime error.',
    phenomenon: 'Bình đun 34°C không đủ nước sau khoảng thời gian quy định.',
    solution: [
      '1. Kiểm tra nguồn nước tinh khiết bên ngoài và van điện từ SV13.',
      '2. Kiểm tra công tắc phao mức nước thấp/cao trong bình chứa (Water tank float switch Wire J301).',
      '3. Kiểm tra xem đường ống dẫn có bị nghẽn khí (air pocket) hoặc tắc màng lọc 200-mesh không.'
    ],
    testPoints: 'Van cấp nước SV13 & Phao nước J301',
    severity: 'WARNING'
  },
  {
    code: '143-28',
    category: 'SYSTEM_RESET',
    name: 'Bình chứa nước thải đã đầy',
    description: 'Waste liquid bottle is full.',
    phenomenon: 'Máy ngừng hút mẫu mới để tránh tràn chất thải lỏng nguy hại sinh học.',
    solution: [
      '1. Đổ chất thải trong bình chứa nước thải nồng độ cao / thấp theo quy trình an toàn sinh học.',
      '2. Kiểm tra cảm biến phao trong bình nước thải và cáp tín hiệu về bo mạch chính.'
    ],
    testPoints: 'Phao báo tràn bình nước thải',
    severity: 'WARNING'
  },
  {
    code: '143-31',
    category: 'SYSTEM_RESET',
    name: 'Áp lực âm bơm hút chân không không đủ',
    description: 'Vacuum pump failure, negative pressure low (< -70 kPa).',
    phenomenon: 'Cuvette không được hút cạn nước sau các bước rửa, gây tràn nước ra mâm.',
    solution: [
      '1. Kiểm tra hoạt động của 2 bơm hút chân không (Vacuum pump Z27).',
      '2. Kiểm tra công tắc áp suất chân không và bình gom chân không xem có bị hở gioăng không.',
      '3. Kiểm tra van điện từ SV11 đóng mở hút chân không cuvette.'
    ],
    testPoints: 'Áp suất đo tại bình gom chân không (Chuẩn ≥ -70 kPa / -0.7 kgf/cm²)',
    severity: 'CRITICAL'
  },
  {
    code: '143-45',
    category: 'OPTICS_AD',
    name: 'Phát hiện 5 cóng phản ứng bị bẩn liên tiếp',
    description: 'Continuous emergence of 5 dirty cups.',
    phenomenon: 'Đo trắng cuvette blank vượt ngưỡng cho phép (ngoài khoảng -800 ~ +800).',
    solution: [
      '1. Thực hiện quy trình rửa ngâm cóng tự động với dung dịch kiềm CS 0.5% NaOH tại vị trí 45.',
      '2. Nếu không hết, tháo cụm 6 bộ cóng ngâm dung dịch tẩy rửa không phosphat 2% trong 8 giờ.',
      '3. Kiểm tra nước tuần hoàn bể ủ và đèn chiếu sáng halogen.'
    ],
    testPoints: 'Cuvette Blank Check Menu (Ngưỡng chuẩn -800 ~ +800)',
    severity: 'WARNING'
  },

  // Refrigeration
  {
    code: '144-1',
    category: 'REFRIGERATION',
    name: 'Thời gian làm lạnh khay thuốc thử bất thường',
    description: 'Refrigeration system abnormal, temperature out of 5°C - 15°C.',
    phenomenon: 'Khay hóa chất màu vàng không đạt dải nhiệt độ bảo quản yêu cầu.',
    solution: [
      '1. Đảm bảo nắp đậy khay thuốc thử đã được đóng kín.',
      '2. Kiểm tra giá trị nhiệt độ hiển thị trên LED 7 đoạn của bo mạch làm lạnh.',
      '3. Kiểm tra dòng tải của chip bán dẫn Peltier (chuẩn > 5A).'
    ],
    testPoints: 'LED 7 đoạn trên Refrigeration Board & Dòng điện Peltier',
    severity: 'WARNING'
  },
  {
    code: '145-1',
    category: 'REFRIGERATION',
    name: 'Dòng điện chip làm lạnh Peltier 1 < 5A',
    description: 'First circuit refrigeration chip current is less than 5A.',
    phenomenon: 'Khối bán dẫn Peltier 1 (ở sườn phải buồng hóa chất) bị suy hao hoặc đứt mạch.',
    solution: [
      '1. Kiểm tra dây nối J422 của chip Peltier 1.',
      '2. Đo kiểm tra trở kháng của tấm bán dẫn nhiệt điện Peltier FPH1-12708AC.',
      '3. Thay mới tấm Peltier nếu dòng dưới 5A khi cấp nguồn 12V.'
    ],
    testPoints: 'Peltier 1 Wire J422, Nguồn cấp 12V',
    severity: 'CRITICAL'
  },

  // Optics AD
  {
    code: '146-1',
    category: 'OPTICS_AD',
    name: 'Kênh thu nhận quang AD 1 (340nm) ngoài dải',
    description: 'First circuit AD collector (340nm) is over normal range.',
    phenomenon: 'Kênh bước sóng cực tím 340nm nhận tín hiệu AD vượt ngưỡng chuẩn 18,000.',
    solution: [
      '1. Kiểm tra đèn halogen 12V 20W xem có bị già bóng (>2000 giờ sử dụng).',
      '2. Vệ sinh thấu kính ngưng tụ và kính cách nhiệt trước buồng cách xạ.',
      '3. Kiểm tra kênh khuếch đại quang điện thứ 1 trên bo mạch AD Board.'
    ],
    testPoints: 'Kênh 340nm trên Data Collection Board 08+09',
    severity: 'CRITICAL'
  },
  {
    code: '146-6',
    category: 'OPTICS_AD',
    name: 'Kênh thu nhận quang AD 6 (505nm) ngoài dải',
    description: 'Sixth circuit AD collector (505nm) is over normal range.',
    phenomenon: 'Kênh đo chính các xét nghiệm Glucose, Cholesterol, Triglycerides gặp sự cố.',
    solution: [
      '1. Kiểm tra diode quang kênh 505nm trên dải Diode Array.',
      '2. Kiểm tra bộ khuếch đại thuật toán kênh 6 trên bo mạch thu nhận dữ liệu quang.'
    ],
    testPoints: 'Kênh 505nm trên Data Collection Board',
    severity: 'CRITICAL'
  }
];

export const DIRUI_SPARE_PARTS: SparePartItem[] = [
  // Consumables & High-wear parts
  {
    sapCode: '1007581',
    name: 'Bộ 20 cóng phản ứng quang học',
    nameEn: 'Reaction Cuvette Set (20 pcs/set)',
    category: 'CONSUMABLE',
    spec: 'Nhựa quang học cứng, quang trình 6mm, chịu nhiệt 37°C',
    replacementPeriod: '3 tháng (hoặc khi độ lệch trắng vượt ±800)',
    stockQty: 72
  },
  {
    sapCode: '2019960',
    name: 'Cụm bóng đèn Halogen thạch anh 12V 20W',
    nameEn: 'Halogen Lamp Assembly',
    category: 'CONSUMABLE',
    spec: '12V / 20W tuổi thọ cao (kèm jack cắm và dây chống cháy)',
    replacementPeriod: '2000 giờ (khuyên thay sau 750 giờ để đảm bảo độ chính xác)',
    stockQty: 2
  },
  {
    sapCode: '1007231',
    name: 'Đầu xốp lau khô cóng phản ứng',
    nameEn: 'Wiping Block / Wiping Head',
    category: 'CONSUMABLE',
    spec: 'Xốp y tế tự hút ẩm gắn tại Nozzle 4 trạm rửa',
    replacementPeriod: '1 năm (hoặc khi mòn/bẩn)',
    stockQty: 1
  },
  {
    sapCode: '2002044',
    name: 'Cụm kim hút mẫu & hóa chất tráng Teflon',
    nameEn: 'Sample & Reagent Probe Assembly (FW)',
    category: 'ASSEMBLY',
    spec: 'Thép y tế 316L, tích hợp cảm biến điện dung LLD',
    replacementPeriod: 'Khi cong vênh hoặc tắc nghẽn không thể thông',
    stockQty: 1
  },
  {
    sapCode: '2003863',
    name: 'Bơm tiêm vi lượng piston thủy tinh 500uL',
    nameEn: 'Syringe Pump Assembly 500uL',
    category: 'ASSEMBLY',
    spec: 'Piston gốm/thủy tinh độ chính xác 0.1 uL, thể tích 500 uL',
    replacementPeriod: '15 tháng (~1 triệu lần hút nhả)',
    stockQty: 1
  },
  {
    sapCode: '1013593',
    name: 'Tấm làm lạnh bán dẫn nhiệt điện Peltier',
    nameEn: 'Peltier Thermoelectric Cooler FPH1-12708AC',
    category: 'CONSUMABLE',
    spec: '12V / 8A max, kiểm soát nhiệt khay hóa chất 5°C - 15°C',
    replacementPeriod: 'Khi dòng điện đo được < 5A',
    stockQty: 2
  },
  {
    sapCode: '1007853',
    name: 'Ty ben khí nén nắp máy vỏ sò',
    nameEn: 'Nitrogen Spring / Gas Strut',
    category: 'ASSEMBLY',
    spec: 'Piston khí nén mạ crom chịu lực nắp acrylic',
    replacementPeriod: 'Khi mất lực đẩy nắp mở',
    stockQty: 2
  },

  // Circuit Boards
  {
    sapCode: '2001488',
    name: 'Bo mạch điều khiển chính (CPU Master)',
    nameEn: 'Main Control Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Điều khiển AC, giám sát áp suất/nhiệt độ, giao tiếp PC RS-232',
    stockQty: 1
  },
  {
    sapCode: '2001489',
    name: 'Bo mạch điều khiển mâm phản ứng',
    nameEn: 'Reaction Disk Control Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Điều khiển motor bước mâm cóng, cổng quang J704/J705',
    stockQty: 1
  },
  {
    sapCode: '2001491',
    name: 'Bo mạch điều khiển mâm hóa chất & kim hút',
    nameEn: 'Reagent & Sample Disk Control Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Điều khiển motor mâm mẫu, motor kim hút, motor bơm tiêm',
    stockQty: 1
  },
  {
    sapCode: '2001490',
    name: 'Bo mạch điều khiển cánh khuấy & trạm rửa',
    nameEn: 'Rinsing and Mixing Control Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Điều khiển motor khuấy, motor trạm rửa và 8 van điện từ',
    stockQty: 1
  },
  {
    sapCode: '2001962',
    name: 'Bo mạch thu nhận dữ liệu quang 12 kênh AD',
    nameEn: 'Data Collection Board 08+09',
    category: 'CIRCUIT_BOARD',
    spec: '12 bộ khuếch đại quang điện + mạch nạp chương trình nạp sẵn',
    stockQty: 1
  },
  {
    sapCode: '2000398',
    name: 'Bo mạch rơ-le bán dẫn công suất (SSR)',
    nameEn: 'Solid-state Relay Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Đóng ngắt que đun 37°C 200W, que đun nước 180W, bơm tuần hoàn',
    stockQty: 1
  },
  {
    sapCode: '2001492',
    name: 'Bo mạch kiểm soát làm lạnh bán dẫn',
    nameEn: 'Cooling / Refrigeration Circuit Board',
    category: 'CIRCUIT_BOARD',
    spec: 'Hiển thị LED 7 đoạn, giám sát dòng Peltier, điều khiển quạt',
    stockQty: 1
  },

  // Solenoid Valves & Fluidics
  {
    sapCode: '1009848',
    name: 'Van điện từ 2 vị trí thường đóng 6011A2.0',
    nameEn: 'Solenoid Valve SV1-SV5 (6011A2.0 PV)',
    category: 'SOLENOID_VALVE',
    spec: 'DC 24V, dùng cho cụm van 5 ngả rửa cóng và kim hút',
    stockQty: 5
  },
  {
    sapCode: '1009821',
    name: 'Van điện từ cấp dung dịch tẩy rửa SV7',
    nameEn: 'Solenoid Valve SV7 (Alkaline Detergent)',
    category: 'SOLENOID_VALVE',
    spec: 'DC 24V, bơm dung dịch tẩy rửa CS vào trạm rửa cóng',
    stockQty: 1
  },
  {
    sapCode: '1009822',
    name: 'Van điện từ 3 ngả 2 vị trí SV8',
    nameEn: 'Three-way Solenoid Valve SV8',
    category: 'SOLENOID_VALVE',
    spec: 'DC 24V, chuyển mạch chân không và nước cấp 7 ngả',
    stockQty: 1
  },
  {
    sapCode: '2003864',
    name: 'Van điện từ cấp nước tinh khiết vào bình SV13',
    nameEn: 'Water Inlet Solenoid Valve SV13',
    category: 'SOLENOID_VALVE',
    spec: 'DC 24V, mở tự động khi phao mức thấp báo thiếu nước',
    stockQty: 1
  },
  {
    sapCode: '1009759',
    name: 'Bơm từ tuần hoàn nước bình cấp MP-20RZ',
    nameEn: 'Magnetic Drive Circulating Pump MP-20RZ',
    category: 'PUMP',
    spec: 'Cột áp 4.6m (50Hz), áp lực làm việc 0.45 kgf/cm²',
    stockQty: 1
  },
  {
    sapCode: '1009731',
    name: 'Bơm hút chân không xả thải áp lực âm',
    nameEn: 'Vacuum Discharge Pump Assembly',
    category: 'PUMP',
    spec: 'Áp lực âm ≥ -70 kPa (-0.7 kgf/cm²), xả thải nồng độ cao',
    stockQty: 2
  }
];

export const FLUIDIC_COMPONENTS_MAP: FluidicComponentInfo[] = [
  {
    tag: 'Z5',
    name: 'Bình gia nhiệt sơ cấp nước rửa (Water Tank)',
    type: 'TANK',
    function: 'Gia nhiệt nước tinh khiết lên 34°C trước khi cấp vào trạm rửa và rửa kim',
    operatingParam: 'Nhiệt độ 34°C, Que sấy 180W, Phao kép mức cao/thấp J301'
  },
  {
    tag: 'Z1',
    name: 'Bể ủ ổn nhiệt phản ứng (Incubation Bath)',
    type: 'TANK',
    function: 'Ủ nhiệt độ 37.0°C ổn định cho 120 cóng phản ứng và làm mát buồng quang',
    operatingParam: '37.0°C ± 0.1°C, Que sấy 200W, Cảm biến nhiệt độ DS18B20'
  },
  {
    tag: 'Z6 / Z8',
    name: 'Bơm dẫn động từ tuần hoàn (Magnetic Pump MP-20RZ)',
    type: 'PUMP',
    function: 'Bơm nước tuần hoàn áp lực ổn định 0.45 kgf/cm² (cột áp 4.6m)',
    operatingParam: 'Áp suất 0.45 kgf/cm² (44 kPa), Đầu ra chia 7 ngả (Z7)'
  },
  {
    tag: 'Z7',
    name: 'Bộ chia nước 7 ngả (Water Inlet 7-way Assembly)',
    type: 'MANIFOLD',
    function: 'Phân phối nước tinh khiết đến: cụm 5 van, bộ khử khí, bể ủ, cảm biến áp lực',
    operatingParam: '7 cổng ra phân nhánh áp suất cân bằng'
  },
  {
    tag: 'Z11 / Z35',
    name: 'Khối 5 van điện từ (Five Valve Plate Assembly)',
    type: 'MANIFOLD',
    function: 'Phân phối nước rửa tới các đầu kim rửa cuvette (SV1-SV3), cánh khuấy (SV4), thành ngoài kim (SV5)',
    operatingParam: 'DC 24V, điều khiển từ Rinsing & Mixing Board'
  },
  {
    tag: 'Z25 / Z5',
    name: 'Bình gom chân không thu hồi chất thải (Vacuum Tank)',
    type: 'TANK',
    function: 'Thu hồi toàn bộ dịch thải nồng độ cao sau phản ứng vào bình chứa cách ly',
    operatingParam: 'Áp suất âm ≥ -70 kPa (-0.7 kgf/cm²)'
  },
  {
    tag: 'Z27',
    name: 'Cụm 2 Bơm hút chân không (Vacuum Pumps)',
    type: 'PUMP',
    function: 'Tạo chân không liên tục cho trạm rửa cóng và hút cạn chất lỏng',
    operatingParam: 'Công suất hút chân không cao, 2 bơm hoạt động song song'
  },
  {
    tag: 'Z40',
    name: 'Bộ khử bọt khí hòa tan (Degassing Tank Assembly)',
    type: 'MANIFOLD',
    function: 'Khử bọt khí vi mô trong nước rửa trước khi đưa vào lòng trong kim hút',
    operatingParam: 'Ngăn ngừa sai số thể tích hút mẫu vi lượng'
  }
];
