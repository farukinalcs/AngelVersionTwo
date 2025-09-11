import { TimePeriod } from "./overview.model";



export function getMetaByTip(tip: TimePeriod) {
  switch (tip) {
    case '1':   return { title: 'Günlük',  desc: 'Bugünün  Malzeme sayıları',  compareText: 'dünkü değere göre' };
    case '7':   return { title: 'Haftalık', desc: 'Son 7 günün  Malzeme sayıları', compareText: 'geçen haftaya göre' };
    case '30':  return { title: 'Aylık',   desc: 'Son 30 günün  Malzeme sayıları', compareText: 'geçen aya göre' };
    case '365': return { title: 'Yıllık',  desc: 'Son 12 ayın  Malzeme sayıları', compareText: 'geçen yıla göre' };
    default:    return { title: 'Haftalık', desc: 'Seçilen aralığın  Malzeme sayıları', compareText: 'önceki döneme göre' };
  }
}

export function toPercentString(value: unknown, digits = 2): string {
  const n = Number(value);
  if (Number.isNaN(n)) return '0.00%';
  return n.toFixed(digits) + '%';
}
