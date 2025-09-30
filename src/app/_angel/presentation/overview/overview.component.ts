import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

interface Stats {
  dagitimda: number;
  taleptoplama: number;
  tamamlanan: number;
  aktifteslim: number;
  aktifteslimedilmeyen: number;
  aktifteslimedilemeyen: number;
}

interface Activity {
  adsoyad: string;
  zaman: string;
  urunadi: string;
  teslim: number;
  problem: number;
  teslimalan: string;
}

interface DistributionSummary {
  lokasyon: number;
  dagitimsorumlusu: string;
  dagitimkalangun: number;
  talepkalangun: number;
  dagitimad: string;
  alici: number;
  teslim: number;
  kalan: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private ngUnsubscribe = new Subject<void>();

  loading432 = false;
  loading433 = false;
  loading435 = false;
  animatedPct: number[] = [];
  private rafBars: number[] = [];

  stats: Stats | null = null;
  activities: Activity[] = [];
  distributions: DistributionSummary[] = [];
  animatedStats: Partial<Stats> = {};
  private rafHandles: Record<keyof Stats, number> = {} as any;
  readonly today = new Date();

  ngOnInit(): void {
    this.getList();
    this.getList2();
    this.getList3();
  }
  private startCount<K extends keyof Stats>(
    key: K,
    to: number,
    duration = 900
  ) {
    const from = Number(this.animatedStats[key] ?? 0);
    if (this.rafHandles[key]) cancelAnimationFrame(this.rafHandles[key]);

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (to - from) * eased);
      this.animatedStats[key] = value as any;

      if (progress < 1) {
        this.rafHandles[key] = requestAnimationFrame(step);
      }
    };
    this.rafHandles[key] = requestAnimationFrame(step);
  }
  getList(): void {
    this.loading432 = true;
    const sp: any[] = [{ mkodu: 'yek432', lokasyonid: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as any[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.stats = (data?.[0] ?? null) as Stats | null;

          if (this.stats) {
            (Object.keys(this.stats) as (keyof Stats)[]).forEach((k) => {
              this.startCount(k, Number(this.stats![k] ?? 0), 900);
            });
          } else {
            this.animatedStats = {};
          }
        },
        error: () => {},
        complete: () => (this.loading432 = false),
      });
  }

  getList2(): void {
    this.loading433 = true;
    const sp: any[] = [{ mkodu: 'yek433', lokasyonid: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as any[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.activities = [...(data as Activity[])];
        },

        error: () => {},
        complete: () => (this.loading433 = false),
      });
  }

  completionPct(row: DistributionSummary): number {
    const total = Number(row.alici) || 0;
    const delivered = Number(row.teslim) || 0;
    if (total <= 0) return 0;
    const pct = (delivered / total) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }

  private animateBar(index: number, to: number, duration = 900) {
    const from = this.animatedPct[index] ?? 0;
    if (this.rafBars[index]) cancelAnimationFrame(this.rafBars[index]);

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (to - from) * eased;
      this.animatedPct[index] = Math.round(value);

      if (progress < 1) {
        this.rafBars[index] = requestAnimationFrame(step);
      }
    };
    this.rafBars[index] = requestAnimationFrame(step);
  }

  getList3(): void {
    this.loading435 = true;
    const sp: any[] = [{ mkodu: 'yek435', lokasyonid: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as any[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.distributions = data as DistributionSummary[];

          this.animatedPct = new Array(this.distributions.length).fill(0);
          this.distributions.forEach((row, i) => {
            const target = this.completionPct2(row);
            this.animateBar(i, target, 900);
          });
        },
        error: () => {},
        complete: () => (this.loading435 = false),
      });
  }

  trackByIndex = (i: number) => i;

  completionPct2(row: DistributionSummary): number {
    const total = Number(row.alici) || 0;
    const delivered = Number(row.teslim) || 0;
    if (total <= 0) return 0;
    const pct = (delivered / total) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    (Object.keys(this.rafHandles) as (keyof Stats)[]).forEach((k) => {
      if (this.rafHandles[k]) cancelAnimationFrame(this.rafHandles[k]);
    });
    this.rafBars.forEach((h) => h && cancelAnimationFrame(h));
  }
}
