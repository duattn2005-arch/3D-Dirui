export type MachineModelId = 'CS-T240' | 'CS-6400' | 'FUS-2000' | 'H-800';

export type WorkspaceTab = 
  | 'simulation-console'
  | 'optics-telemetry'
  | 'reagent-carousel'
  | 'sample-pipetting-kinematics'
  | 'photometric-calibration'
  | 'diagnostic-batch-queue'
  | 'subsystem-diagnostics';

export type CameraPreset = 
  | 'panoramic' 
  | 'carousel' 
  | 'pipetting' 
  | 'optics' 
  | 'internals'
  | 'reset'
  | 'top'
  | 'side';

export interface SystemStatus {
  state: 'RUNNING' | 'STANDBY' | 'STOPPED' | 'CALIBRATING';
  temperature: number; // e.g. 37.0
  tempVariance: number; // e.g. 0.1
  throughput: string; // e.g. "240 T/H (400 ISE)"
  washFluidPercent: number; // e.g. 84.5
  lisConnected: boolean;
  firmware: string;
  latencyMs: number;
}

export interface ReagentPosition {
  id: number;
  type: 'R1' | 'R2' | 'SAMPLE' | 'EMPTY';
  name: string;
  code: string;
  remainingMl: number;
  maxMl: number;
  remainingTests: number;
  lotNumber: string;
  expiryDate: string;
  status: 'OPTIMAL' | 'LOW' | 'EXPIRED' | 'EMPTY';
}

export interface AssayResult {
  id: string;
  name: string;
  code: string;
  method: string;
  value: number;
  unit: string;
  refRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'STAT';
  time: string;
}

export interface BatchItem {
  id: string;
  tubeBarcode: string;
  patientName: string;
  gender: 'M' | 'F';
  age: number;
  sampleType: 'Serum' | 'Plasma' | 'Urine' | 'Whole Blood';
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'STAT';
  tests: string[];
  priority: boolean;
  cupPosition: number;
  progress: number;
}

export interface OpticalWavelength {
  nm: number;
  lampIntensity: number;
  strayLightIndex: number;
  absorbance: number;
  status: 'PASS' | 'CALIBRATED' | 'CHECK';
}
