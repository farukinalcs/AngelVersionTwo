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
  timePeriod: TimePeriod = '365';
  propForStat: any;

  private toastr = inject(ToastrService);
  private i18n = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private overview = inject(InventoryService);

  private _editMode = signal<boolean>(false);
  private _loading = signal<boolean>(true);

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

  private loadAll() {
    this.loading = true;

    const safe = <T>(obs: any) => obs.pipe(catchError(() => of(null as T)));

    forkJoin({
      sarf: safe(this.overview.getSarfChart(this.timePeriod)),
      dept: safe(this.overview.getDepartmentChart(this.timePeriod)),
      pie: safe(this.overview.getPieChart(this.timePeriod)),

      s0: safe(this.overview.getToplamEkipmanStat(this.timePeriod)),
      s1: safe(this.overview.getToplamEkipmanSahibi(this.timePeriod)),
      s2: safe(this.overview.getToplamSarfSahibi(this.timePeriod)),
      s3: safe(this.overview.getOrtalamaSüre(this.timePeriod)),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          const charts: ChartItem[] = [];
          if (res.sarf?.vm)
            charts.push({ id: 'chart_sarf', ...res.sarf.vm, visible: true });
          if (res.dept?.vm)
            charts.push({ id: 'chart_dept', ...res.dept.vm, visible: true });
          if (res.pie?.vm)
            charts.push({ id: 'chart_pie', ...res.pie.vm, visible: true });
          this.charts = charts;

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

          this.propForStat =
            res.sarf?.meta || res.dept?.meta || res.pie?.meta || null;

          forkJoin({
            chartsVis: this.overview.getVisibility(OVERVIEW_VIS_KEYS.charts),
            statsVis: this.overview.getVisibility(OVERVIEW_VIS_KEYS.stats),
          })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: ({ chartsVis, statsVis }) => {
                this.applyVisibilityResult(
                  this.charts,
                  OVERVIEW_VIS_KEYS.charts,
                  chartsVis
                );

                this.applyVisibilityResult(
                  this.stats,
                  OVERVIEW_VIS_KEYS.stats,
                  statsVis
                );

                this.loading = false;
              },
              error: () => {
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

  private applyVisibilityResult(
    items: { id: string; visible?: boolean }[],
    key: string,
    result: { status: number; ids: string[] | null }
  ) {
    if (result.status === -1) {
      return;
    }
    if (result.status === 9) {
      items.forEach((i) => (i.visible = true));
      const ids = items.map((i) => i.id);
      this.overview
        .saveVisibility(key, ids)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      return;
    }
    const set = new Set(result.ids ?? []);
    items.forEach((i) => (i.visible = set.has(i.id)));
  }

  setTimePeriod(period: TimePeriod): void {
    this.timePeriod = period;
    this.loadAll();
  }

  toggleEditMode() {
    this._editMode.update((prev) => !prev);
  }

  test(item: any) {
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
  restoreStat(h: any) {
    const item = h && 'item' in h ? h.item : h;
    if (!item) return;
    if (item.visible === true) return;
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

  trackByStat = (_: number, s: StatItem) => s?.id ?? _;
  trackByChart = (_: number, c: ChartItem) => c?.id ?? _;
}
