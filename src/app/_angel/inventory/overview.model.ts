// Zaman periyotları
export type TimePeriod = '1' | '7' | '30' | '365';

// Backend zarflayıcı
export interface ApiEnvelope<T> {
  x: T;
  z?: { islemsonuc: number; [k: string]: any };
}

// Chart API
export type SarfRow = Record<string, number | string>;
export type SarfApi = SarfRow[];

// Stat API
export interface StatApiItem {
  buay: number | string;
  artisorani: number | string;
  buyil: number | string;
  oncekiyil: number | string;
  zaman: number | string;
  oncekizaman: number | string;
}
export type StatApi = StatApiItem[];

// Chart serileri: Kartezyen (line/bar) VEYA Pie/Donut (number[])
export type CartesianSeries = { name: string; data: (number | string)[] }[];
export type PieSeries = number[];

// Tek ViewModel
export interface ChartVm {
  id?: string;                 // (opsiyonel) UI için
  title: string;
  description: string;
  series: CartesianSeries | PieSeries;  // <-- donut/pie için number[] destekli
  options: any;                // ApexOptions kullanıyorsan onunla değiştir
  collapsed?: boolean;         // (opsiyonel)
  visible?: boolean;           // (opsiyonel)
}

export interface StatVm {
  id?: string;                 // (opsiyonel) UI için
  title: string;
  value: string;
  unit: string;
  change: string;
  icon: string;
  color: string;
  visible?: boolean;           // (opsiyonel)
}

// Component forkJoin tipleri için pratik tip
export type ChartResp = { vm: ChartVm; meta: any };
