import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { getMetaByTip, toPercentString } from './inventory-meta.util';
import {
  TimePeriod,
  ApiEnvelope,
  SarfApi,
  ChartVm,
  StatApi,
  StatVm,
} from './overview.model';

// Overview görünürlük anahtarları (persist)
export const OVERVIEW_VIS_KEYS = {
  charts: 'overview_dashboard_charts_visible',
  stats: 'overview_dashboard_stats_visible',
} as const;

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private profile = inject(ProfileService);

  /** Ortak: SP cevabını doğrula, başarısızsa hata fırlat */
  private assertOk<X>(resp: any[]): ApiEnvelope<X> {
    const env = resp?.[0] as ApiEnvelope<X> | undefined;
    if (!env || env.z?.islemsonuc === -1) {
      throw new Error('İşlem başarısız');
    }
    return env;
  }

  /** Ortak: ilk satırdan labels/values çıkar */
  private kvFromFirstRow(row: Record<string, any> | undefined) {
    const safeRow = row ?? {};
    const labels = Object.keys(safeRow);
    const values = Object.values(safeRow).map((v) => Number(v) || 0);
    return { labels, values };
  }

  // ===================== Charts =====================

  getSarfChart(period: TimePeriod) {
    const sp = [{ mkodu: 'yek399', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<SarfApi>(resp);
        const data = env.x ?? [];
        const { labels: categories, values } = this.kvFromFirstRow(data[0]);

        const meta = getMetaByTip(period);
        const vm: ChartVm = {
          title: `${meta.title} Sarf Malzeme Talebi`,
          description: meta.desc,
          series: [{ name: 'Sarf Malzeme Talepleri', data: values }],
          options: {
            chart: {
              type: 'line',
              height: 350,
              toolbar: { show: false },
              background: 'transparent',
            },
            colors: ['#0d6efd'],
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                gradientToColors: ['#fc2c48ff'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
              },
            },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories, labels: { style: { colors: '#6c757d' } } },
            yaxis: { labels: { style: { colors: '#6c757d' } } },
            grid: { borderColor: '#dee2e6', strokeDashArray: 4 },
            tooltip: { theme: 'light' },
          },
        };
        return { vm, meta };
      })
    );
  }

  getDepartmentChart(period: TimePeriod) {
    const sp = [{ mkodu: 'yek404', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<Record<string, number>[]>(resp);
        const data = env.x ?? [];
        const { labels: categories, values } = this.kvFromFirstRow(data[0]);

        const meta = getMetaByTip(period);
        const title = `${meta.title} Departmanlara Göre Dağılım`;
        const description =
          meta?.desc ?? 'Seçili dönemde departman bazlı ekipman talepleri';

        const vm: ChartVm = {
          title,
          description,
          series: [{ name: 'Ekipman Talepleri', data: values }],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              toolbar: { show: false },
              background: 'transparent',
            },
            colors: ['#d1362bff'],
            plotOptions: {
              bar: { borderRadius: 8, horizontal: false, columnWidth: '60%' },
            },
            xaxis: { categories, labels: { style: { colors: '#6c757d' } } },
            yaxis: { labels: { style: { colors: '#6c757d' } } },
            grid: { borderColor: '#dee2e6', strokeDashArray: 4 },
            tooltip: { theme: 'light' },
          },
        };

        return { vm, meta: { ...meta, title, desc: description } };
      })
    );
  }

  getPieChart(period: TimePeriod) {
    const sp = [{ mkodu: 'yek405', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<Record<string, number>[]>(resp);
        const data = env.x ?? [];
        const { labels, values } = this.kvFromFirstRow(data[0]);

        const meta = getMetaByTip(period);
        const title = `${meta.title} Departmanlara Göre Dağılım (%)`;
        const description =
          meta?.desc ?? 'Seçili dönemde departman bazlı ekipman talepleri';

        const baseColors = [
          '#227409ff',
          '#dc3545',
          '#0d6efd',
          '#6f42c1',
          '#20c997',
          '#ffc107',
          '#6610f2',
          '#fd7e14',
        ];
        const colors =
          labels.length === 2
            ? ['#227409ff', '#dc3545']
            : baseColors.slice(0, Math.max(labels.length, 2));

        const vm: ChartVm = {
          title,
          description,
          // Donut/Pie → number[] (modelde union)
          series: values,
          options: {
            chart: { type: 'donut', height: 350, background: 'transparent' },
            colors,
            labels,
            legend: { position: 'bottom', labels: { colors: '#6c757d' } },
            plotOptions: { pie: { donut: { size: '70%' } } },
            tooltip: { theme: 'light' },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: { width: 200 },
                  legend: { position: 'bottom' },
                },
              },
            ],
          },
        };

        return { vm, meta: { ...meta, title, desc: description } };
      })
    );
  }

  // ===================== Stats =====================

  getToplamEkipmanStat(period: TimePeriod) {
    const sp = [{ mkodu: 'yek400', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<StatApi>(resp);
        const row = env.x?.[0] ?? {};
        const vm: StatVm = {
          title: 'Toplam Ekipman Talebi',
          value: String(row?.buay ?? '0'),
          unit: 'Adet',
          change: toPercentString(row?.artisorani, 2),
          icon: 'bi bi-clock',
          color: 'text-primary',
        };
        return vm;
      })
    );
  }

  getToplamEkipmanSahibi(period: TimePeriod) {
    // SP tip istiyorsa: const sp = [{ mkodu: 'yek401', tip: period }];
    const sp = [{ mkodu: 'yek401' }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<StatApi>(resp);
        const row = env.x?.[0] ?? {};
        const vm: StatVm = {
          title: 'Toplam Ekipman Sahibi Personel',
          value: String(row?.buyil ?? '0'),
          unit: 'Kişi',
          change: toPercentString(row?.artisorani, 2),
          icon: 'bi bi-people',
          color: 'text-success',
        };
        return vm;
      })
    );
  }

  getToplamSarfSahibi(period: TimePeriod) {
    const sp = [{ mkodu: 'yek402', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<StatApi>(resp);
        const row = env.x?.[0] ?? {};
        const vm: StatVm = {
          title: 'Toplam Sarf Ekipman Sahibi Personel',
          value: String(row?.buay ?? '0'),
          unit: 'Kişi',
          change: toPercentString(row?.artisorani, 2),
          icon: 'bi bi-people',
          color: 'text-success',
        };
        return vm;
      })
    );
  }

  getOrtalamaSüre(period: TimePeriod) {
    const sp = [{ mkodu: 'yek403', tip: period }];
    return this.profile.requestMethod(sp).pipe(
      map((resp: any[]) => {
        const env = this.assertOk<StatApi>(resp);
        const row = env.x?.[0] ?? {};
        const vm: StatVm = {
          title: 'Ortalama Talep Yanıt Süresi',
          value: String(row?.zaman ?? '0'),
          unit: 'Saat',
          change: toPercentString(row?.artisorani, 2),
          icon: 'bi bi-clock',
          color: 'text-success',
        };
        return vm;
      })
    );
  }

  // ===================== Persisted Visibility =====================

  /** Görünür id listesini kaydet */
  saveVisibility(key: string, ids: string[]) {
    const sp = [{ mkodu: 'yek104', ad: key, deger: JSON.stringify(ids) }];
    return this.profile.requestMethod(sp, { noloading: 'true' }).pipe(
      map((resp: any[]) => {
        const z = resp?.[0]?.z;
        if (z?.islemsonuc === -1) throw new Error('Görünürlük kaydı başarısız');
        return true;
      })
    );
  }

  /**
   * Görünür id listesini getir.
   * Dönüş: { status: number, ids: string[] | null }
   * status: -1 (hata) | 9 (ilk ayar yok) | 1 (başarılı)
   */
  getVisibility(key: string) {
    const sp = [{ mkodu: 'yek105', ad: key }];
    return this.profile.requestMethod(sp, { noloading: 'true' }).pipe(
      map((resp: any[]) => {
        const x = resp?.[0]?.x;
        const z = resp?.[0]?.z;
        const status = Number(z?.islemsonuc ?? -1);
        if (status === -1) return { status, ids: null as string[] | null };
        if (status === 9) return { status, ids: null as string[] | null };

        let ids: string[] = [];
        try {
          ids = JSON.parse(x?.[0]?.deger ?? '[]');
          if (!Array.isArray(ids)) ids = [];
        } catch {
          ids = [];
        }
        return { status: 1, ids };
      })
    );
  }
}
