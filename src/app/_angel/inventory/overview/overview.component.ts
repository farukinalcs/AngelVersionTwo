// overview.component.ts (tam sürüm)

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { InventoryService, OVERVIEW_VIS_KEYS } from '../inventory.service';
import { TimePeriod } from '../overview.model';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type HiddenItem<T> = { item: T; index: number };

// Görsel öğe tipleri
type StatItem = any & { id: string; visible?: boolean };
type ChartItem = any & { id: string; visible?: boolean };

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  timePeriod: TimePeriod = '7';
  propForStat: any;

  private toastr = inject(ToastrService);
  private i18n = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private overview = inject(InventoryService);

  private _editMode = signal<boolean>(false);
  private _loading = signal<boolean>(true);

  /** Artık listeden silmiyoruz; visible=false yapıyoruz */
  stats: StatItem[] = [];
  charts: ChartItem[] = [];

  get loading() {
    return this._loading();
  }
  set loading(v: boolean) {
    this._loading.set(!!v);
  }

  get editMode() {
    return this._editMode();
  }
  set editMode(v: boolean) {
    this._editMode.set(!!v);
  }

  // Şablonda kullan: {{ compareText }}
  get compareText(): string {
    switch (this.timePeriod) {
      case '1':
        return 'düne göre';
      case '7':
        return 'geçen haftaya göre';
      case '30':
        return 'geçen aya göre';
      case '365':
        return 'geçen yıla göre';
      default:
        return 'önceye göre';
    }
  }

  // Görünen/gizli listeleri pratik getter’larla ayır
  get visibleStats() {
    return this.stats.filter((s) => s.visible !== false);
  }
  get hiddenStats() {
    return this.stats.filter((s) => s.visible === false);
  }
  get visibleCharts() {
    return this.charts.filter((c) => c.visible !== false);
  }
  get hiddenCharts() {
    return this.charts.filter((c) => c.visible === false);
  }

  ngOnInit(): void {
    this.loadAll();
  }

  /** Tüm verileri çek; sonra persist görünürlük uygula */
  private loadAll() {
    this.loading = true;

    const safe = <T>(obs: any) => obs.pipe(catchError(() => of(null as T)));

    forkJoin({
      // Charts
      sarf: safe(this.overview.getSarfChart(this.timePeriod)),
      dept: safe(this.overview.getDepartmentChart(this.timePeriod)),
      pie: safe(this.overview.getPieChart(this.timePeriod)),
      // Stats
      s0: safe(this.overview.getToplamEkipmanStat(this.timePeriod)),
      s1: safe(this.overview.getToplamEkipmanSahibi(this.timePeriod)),
      s2: safe(this.overview.getToplamSarfSahibi(this.timePeriod)),
      s3: safe(this.overview.getOrtalamaSüre(this.timePeriod)),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          // ---------------- Build charts (stabil id + default visible:true)
          const charts: ChartItem[] = [];
          if (res.sarf?.vm)
            charts.push({ id: 'chart_sarf', ...res.sarf.vm, visible: true });
          if (res.dept?.vm)
            charts.push({ id: 'chart_dept', ...res.dept.vm, visible: true });
          if (res.pie?.vm)
            charts.push({ id: 'chart_pie', ...res.pie.vm, visible: true });
          this.charts = charts;

          // ---------------- Build stats (stabil id + default visible:true)
          const stats: StatItem[] = [];
          if (res.s0)
            stats.push({ id: 'stat_total_requests', ...res.s0, visible: true });
          if (res.s1)
            stats.push({
              id: 'stat_equipment_owners',
              ...res.s1,
              visible: true,
            });
          if (res.s2)
            stats.push({ id: 'stat_sarf_owners', ...res.s2, visible: true });
          if (res.s3)
            stats.push({ id: 'stat_avg_response', ...res.s3, visible: true });
          this.stats = stats;

          // meta
          this.propForStat =
            res.sarf?.meta || res.dept?.meta || res.pie?.meta || null;

          // Persist görünürlük uygula (ikisi bağımsız)
          forkJoin({
            chartsVis: this.overview.getVisibility(OVERVIEW_VIS_KEYS.charts),
            statsVis: this.overview.getVisibility(OVERVIEW_VIS_KEYS.stats),
          })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: ({ chartsVis, statsVis }) => {
                // Charts
                this.applyVisibilityResult(
                  this.charts,
                  OVERVIEW_VIS_KEYS.charts,
                  chartsVis
                );

                // Stats
                this.applyVisibilityResult(
                  this.stats,
                  OVERVIEW_VIS_KEYS.stats,
                  statsVis
                );

                this.loading = false;
              },
              error: () => {
                // Persist okunamadıysa varsayılan (hepsi visible:true) ile devam
                this.loading = false;
              },
            });
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  /** Backend’den gelen görünürlük sonucunu mevcut listeye uygula */
  private applyVisibilityResult(
    items: { id: string; visible?: boolean }[],
    key: string,
    result: { status: number; ids: string[] | null }
  ) {
    if (result.status === -1) {
      // Hata: hiçbir şey yapmayalım (varsayılan: hepsi visible)
      return;
    }
    if (result.status === 9) {
      // İlk kez: hepsini visible yapıp default olarak backend’e yazalım
      items.forEach((i) => (i.visible = true));
      const ids = items.map((i) => i.id);
      this.overview
        .saveVisibility(key, ids)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      return;
    }
    // status 1: gelen id’lere göre işaretle
    const set = new Set(result.ids ?? []);
    items.forEach((i) => (i.visible = set.has(i.id)));
  }

  setTimePeriod(period: TimePeriod): void {
    this.timePeriod = period;
    this.loadAll(); // yeni data + persist tekrar uygulanır
  }

  toggleEditMode() {
    this._editMode.update((prev) => !prev);
  }

  /** "Gizle" butonu → visible=false + backend’e kaydet */
  test(item: any) {
    // Stat mı chart mı bul
    let type: 'stats' | 'charts' | null = null;
    let list: any[] | null = null;

    const sIdx = this.stats.indexOf(item);
    if (sIdx > -1) {
      type = 'stats';
      list = this.stats;
    }
    const cIdx = this.charts.indexOf(item);
    if (cIdx > -1) {
      type = 'charts';
      list = this.charts;
    }

    if (!type || !list) return;

    item.visible = false;
    this.persistVisibility(type);
  }

  /** Chip’ten geri al → visible=true + backend’e kaydet */
  restoreStat(h: any) {
    const item = h && 'item' in h ? h.item : h; // wrapper mı, değil mi?
    if (!item) return;
    if (item.visible === true) return; // zaten açık
    item.visible = true;
    this.persistVisibility('stats');
  }

  restoreChart(h: any) {
    const item = h && 'item' in h ? h.item : h;
    if (!item) return;
    if (item.visible === true) return;
    item.visible = true;
    this.persistVisibility('charts');
  }

  /** O anki görünür listeyi backend’e yaz */
  private persistVisibility(type: 'stats' | 'charts') {
    const key =
      type === 'charts' ? OVERVIEW_VIS_KEYS.charts : OVERVIEW_VIS_KEYS.stats;
    const ids = (
      type === 'charts' ? this.visibleCharts : this.visibleStats
    ).map((i) => i.id);
    this.overview
      .saveVisibility(key, ids)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.toastr.warning(
            this.i18n.instant('Görünürlük kaydedilemedi'),
            this.i18n.instant('Uyarı')
          );
        },
      });
  }

  // *ngFor performansı — id’yi kullan
  trackByStat = (_: number, s: StatItem) => s?.id ?? _;
  trackByChart = (_: number, c: ChartItem) => c?.id ?? _;
}
