export type FuelType = "octane_92" | "octane_95" | "diesel";

export type StationStatus = "open" | "paused" | "closed";

export interface FuelAvailability {
  type: FuelType;
  available: boolean;
  price: number;
}

export interface Station {
  id: string;
  name: string;
  nameMy: string;
  address: string;
  addressMy: string;
  distance: number; // km
  queueLength: number;
  currentServing: string;
  estimatedWaitMinutes: number;
  status: StationStatus;
  pauseReason?: string;
  fuels: FuelAvailability[];
  maxCapacity: number;
}

export interface Token {
  id: string;
  tokenNumber: string;
  position: number;
  totalInQueue: number;
  stationId: string;
  stationName: string;
  stationNameMy: string;
  fuelType: FuelType;
  status:
    | "waiting"
    | "notified_30"
    | "notified_10"
    | "called"
    | "serving"
    | "completed"
    | "skipped"
    | "cancelled";
  estimatedCallAt: string; // ISO
  gateNumber?: number;
  createdAt: string;
}

export const MOCK_STATIONS: Station[] = [
  {
    id: "s1",
    name: "Shwe Moe Petrol Station",
    nameMy: "ရွှေမိုး ဆီဆိုင်",
    address: "No.12, Pyay Road, Hlaing Township",
    addressMy: "အမှတ်(၁၂)၊ ပြည်လမ်း၊ လှိုင်မြို့နယ်",
    distance: 0.8,
    queueLength: 34,
    currentServing: "A-021",
    estimatedWaitMinutes: 170,
    status: "open",
    maxCapacity: 200,
    fuels: [
      { type: "octane_92", available: true, price: 1550 },
      { type: "octane_95", available: false, price: 1750 },
      { type: "diesel", available: true, price: 1450 },
    ],
  },
  {
    id: "s2",
    name: "Mya Kyun Thar Fuel",
    nameMy: "မြကြုန်သာ ဆီဆိုင်",
    address: "No.45, Insein Road, Insein Township",
    addressMy: "အမှတ်(၄၅)၊ အင်းစိန်လမ်း၊ အင်းစိန်မြို့နယ်",
    distance: 1.4,
    queueLength: 18,
    currentServing: "B-009",
    estimatedWaitMinutes: 90,
    status: "open",
    maxCapacity: 150,
    fuels: [
      { type: "octane_92", available: true, price: 1550 },
      { type: "octane_95", available: true, price: 1750 },
      { type: "diesel", available: false, price: 1450 },
    ],
  },
  {
    id: "s3",
    name: "Pyi Thar Fuel Station",
    nameMy: "ပြည်သာ ဆီဆိုင်",
    address: "No.8, Kaba Aye Pagoda Road, Mayangone",
    addressMy: "အမှတ်(၈)၊ ကမ္ဘာအေးဘုရားလမ်း၊ မရမ်းကုန်းမြို့နယ်",
    distance: 2.1,
    queueLength: 0,
    currentServing: "-",
    estimatedWaitMinutes: 0,
    status: "paused",
    pauseReason: "ဆီယာဉ် ၂ နာရီကြာမည်",
    maxCapacity: 100,
    fuels: [
      { type: "octane_92", available: true, price: 1550 },
      { type: "octane_95", available: false, price: 1750 },
      { type: "diesel", available: true, price: 1450 },
    ],
  },
  {
    id: "s4",
    name: "Golden Star Petrol",
    nameMy: "ရွှေကြယ် ဆီဆိုင်",
    address: "No.32, Strand Road, Lanmadaw Township",
    addressMy: "အမှတ်(၃၂)၊ ကမ်းနားလမ်း၊ လမ်းမတော်မြို့နယ်",
    distance: 3.5,
    queueLength: 0,
    currentServing: "-",
    estimatedWaitMinutes: 0,
    status: "closed",
    maxCapacity: 200,
    fuels: [
      { type: "octane_92", available: false, price: 1550 },
      { type: "octane_95", available: false, price: 1750 },
      { type: "diesel", available: false, price: 1450 },
    ],
  },
];

export const MOCK_TOKEN: Token = {
  id: "t1",
  tokenNumber: "A-055",
  position: 12,
  totalInQueue: 34,
  stationId: "s1",
  stationName: "Shwe Moe Petrol Station",
  stationNameMy: "ရွှေမိုး ဆီဆိုင်",
  fuelType: "octane_92",
  status: "waiting",
  estimatedCallAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
};

export const MOCK_QUEUE_TOKENS = [
  { id: "q1", tokenNumber: "A-044", fuelType: "octane_92" as FuelType, waitMinutes: 0, status: "serving" },
  { id: "q2", tokenNumber: "A-045", fuelType: "diesel" as FuelType, waitMinutes: 5, status: "waiting" },
  { id: "q3", tokenNumber: "A-046", fuelType: "octane_92" as FuelType, waitMinutes: 10, status: "waiting" },
  { id: "q4", tokenNumber: "A-047", fuelType: "octane_95" as FuelType, waitMinutes: 15, status: "waiting" },
  { id: "q5", tokenNumber: "A-048", fuelType: "octane_92" as FuelType, waitMinutes: 20, status: "waiting" },
  { id: "q6", tokenNumber: "A-049", fuelType: "diesel" as FuelType, waitMinutes: 25, status: "waiting" },
  { id: "q7", tokenNumber: "A-050", fuelType: "octane_92" as FuelType, waitMinutes: 30, status: "waiting" },
  { id: "q8", tokenNumber: "A-051", fuelType: "octane_92" as FuelType, waitMinutes: 35, status: "waiting" },
];

export const FUEL_LABELS: Record<FuelType, { en: string; my: string }> = {
  octane_92: { en: "Octane 92", my: "အော့တိန် ၉၂" },
  octane_95: { en: "Octane 95", my: "အော့တိန် ၉၅" },
  diesel: { en: "Diesel", my: "ဒီဇယ်" },
};
