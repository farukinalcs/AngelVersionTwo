import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { CardMenuComponent } from '../../shared/dashboard-card/card-menu/card-menu.component';
import { DashboardCardComponent } from '../../shared/dashboard-card/dashboard-card.component';
import {
  ColumnDef,
  ModernTableComponent,
} from '../../shared/modern-table/modern-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';

interface DashboardOption {
  id: number;
  label: string;
  menu: 'refectory';
  items: any[];
  value: string | number;
  icon?: string;
  visible: boolean;
}

type ScoreRow = {
  tarih: string | Date;
  sabah: number | string;
  ogle: number | string;
  aksam: number | string;
  gece: number | string;
  ogundisi: number | string;
};

interface VisitType {
  ID: number;
  Ad: string;
  Simge?: string;
  visible: boolean;
  [k: string]: any;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardMenuComponent,
    DashboardCardComponent,
    ModernTableComponent,
    DropdownModule,
    FormsModule,
    DatePickerModule,
    TooltipModule
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  dashboardOptions: DashboardOption[] = [
    {
      id: 1,
      label: this.translateService.instant('Sabah'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-solid fa-sun',
      visible: true,
    },
    {
      id: 2,
      label: this.translateService.instant('Öğle'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-regular fa-sun',
      visible: true,
    },
    {
      id: 3,
      label: this.translateService.instant('Akşam'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-solid fa-moon',
      visible: true,
    },
    {
      id: 4,
      label: this.translateService.instant('Gece(Tanımlı Değil)'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-regular fa-moon',
      visible: true,
    },
    {
      id: 5,
      label: this.translateService.instant('Öğün Dışı'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-solid fa-hourglass-start',
      visible: true,
    },
    {
      id: 6,
      label: this.translateService.instant('Toplam'),
      menu: 'refectory',
      items: [],
      value: '0',
      icon: 'fa-solid fa-check-double',
      visible: true,
    },
  ];

  userCols: ColumnDef[] = [
    { key: 'adsoyad', header: 'Ad Soyad', sortable: true, width: '80px' },
    { key: 'firma', header: 'Firma', sortable: true, width: '80px' },
    {
      key: 'bolüm',
      header: 'Bölüm',
      sortable: true,
      width: '80px',
      hideOnMobile: true,
    },
    {
      key: 'terminaladi',
      header: 'Terminal',
      sortable: true,
      hideOnMobile: true,
      width: '80px',
    },
    {
      key: 'zaman',
      header: 'Geçiş Zamanı',
      sortable: true,
      hideOnMobile: true,
      width: '80px',
      type: 'date',
    },
  ];
  visitTypes: VisitType[] = [];
  editMode = false;
  passList: any = [];
  allScore: ScoreRow[] = [];
  deviceGroups: Array<{ id: number; ad: string; amac: number }> = [];
  selectedGroupId: number = 0; // ilk açılışta "Tüm Terminaller"
selectedDate: Date = new Date(); // bugün default
  private nf = new Intl.NumberFormat('tr-TR'); // 1.234 biçimi için
  constructor(
    private readonly profileService: ProfileService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllScores(this.selectedGroupId, this.selectedDate);
    this.getVisitTypes();
    this.getValues('all', '0');
    this.getValues('gecicikart', '0');
    this.getValues('ck', '0');
    this.getPassList(this.selectedGroupId, this.selectedDate);
    this.getDeviceGroups();
  }

  getDeviceGroups() {
    const sp = [{ mkodu: 'yek190', amac: '3', id: '0' }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;

        const normalized = data.map((r: any) => ({
          id: Number(r.id),
          ad: String(r.ad),
          amac: Number(r.amac),
        }));

        const allOption = { id: 0, ad: 'Tüm Terminaller', amac: 3 };

        const withoutAll = normalized.filter((x: any) => x.id !== 0);
        this.deviceGroups = [allOption, ...withoutAll];

        this.selectedGroupId = 0;
      });
  }

  onGroupChange(event: any) {
    console.log('Seçilen id:', event.value); // sadece id gelir
    const selectedObj = this.deviceGroups.find((x) => x.id === event.value);
    console.log('Seçilen obje:', selectedObj);
    this.getAllScores(event.value, this.selectedDate);
    this.getPassList(event.value, this.selectedDate);
  }

  onDateSelect(date: Date) {
    console.log('Seçilen tarih:', date);
    this.getAllScores(this.selectedGroupId, date);
    this.getPassList(this.selectedGroupId, date);
    // TODO: burada işlemini yap
  }

  getVisitTypes(): void {
    const sp = [{ mkodu: 'yek292', id: '0' as const }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;

        // visible default false
        this.visitTypes = (data as any[]).map((item) => ({
          ...item,
          visible: false,
        }));
        // İlk elemanı (ID:0) çıkar
        if (this.visitTypes.length) this.visitTypes.shift();

        this.getMenuVisible();
      });
  }

  private formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  getAllScores(lokasyon?: number, tarih?: any): void {
    const formatted = this.formatDate(tarih);
    const sp = [{ mkodu: 'yek407', lokasyon: String(lokasyon), tarih: formatted }];
    console.log(sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;
        if (message?.islemsonuc === -1) return;

        this.allScore = [...data];
        this.applyScoreTotals(); // <— toplamlara çevir ve dashboard’a yaz
      });
  }

  onSort(e: { key: string; dir: 'asc' | 'desc' }) {
    console.log('sort:', e.key, e.dir);
    // İstersen burada dışarıdan da veri çeker / server-side sort yaparsın.
  }

  getValues(type: string, id: string): void {
    const today = new Date().toISOString().split('T')[0];

    const sp = [
      {
        mkodu: 'yek289',
        tarih: today,
        tarihbit: today,
        tip: type,
        ziyaretnedeniid: id,
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;
        this.matchValues(data);
      });
  }

  private matchValues(data: any[]): void {
    if (!Array.isArray(data) || data.length === 0) return;

    data.forEach((item) => {
      switch (item?.type?.toString()) {
        case '-2': {
          const card = this.dashboardOptions.find((o) => o.id === -5);
          if (card) {
            card.value = Number(card.value || 0) + 1;
            card.items ??= [];
            card.items.push(item);
          }
          break;
        }
        case '-1': {
          const card = this.dashboardOptions.find((o) => o.id === -1);
          if (card) {
            card.value = Number(card.value || 0) + 1;
            card.items ??= [];
            card.items.push(item);
          }
          break;
        }
        case '1': {
          const vType = this.visitTypes.find(
            (t) => t.ID === item.ZiyaretNedeniId
          );
          const card = this.dashboardOptions.find((o) => o.id === vType?.ID);
          if (card) {
            card.value = Number(card.value || 0) + 1;
            card.items ??= [];
            card.items.push(item);
          }
          break;
        }
        case '0': {
          const card = this.dashboardOptions.find((o) => o.id === -6);
          if (card) {
            card.value = Number(card.value || 0) + 1;
            card.items ??= [];
            card.items.push(item);
          }
          break;
        }
      }
    });
  }

  setMenuVisible(value: string): void {
    const sp = [
      { mkodu: 'yek104', ad: 'refectory_dashboard_visible', deger: value },
    ];

    this.profileService
      .requestMethod(sp, { noloading: 'true' })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.getMenuVisible());
  }

  getMenuVisible(): void {
    const sp = [{ mkodu: 'yek105', ad: 'refectory_dashboard_visible' }];

    this.profileService
      .requestMethod(sp, { noloading: 'true' })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;

        if (message?.islemsonuc === 9) {
          // Güvenlik: index kontrolü
          if (this.visitTypes[1]) this.visitTypes[1].visible = true;
          if (this.visitTypes[2]) this.visitTypes[2].visible = true;
          if (this.visitTypes[3]) this.visitTypes[3].visible = true;

          this.addDashboardOptions();
          const visibleIds = this.visitTypes
            .filter((i) => i.visible)
            .map((i) => i.ID);
          this.setMenuVisible(JSON.stringify(visibleIds));
          return;
        }

        const raw = data?.[0]?.deger ?? '[]';
        let saved: number[] = [];
        try {
          saved = JSON.parse(raw);
        } catch {
          saved = [];
        }

        this.visitTypes = this.visitTypes.map((item) => ({
          ...item,
          visible: saved.includes(item.ID),
        }));

        this.addDashboardOptions();
      });
  }

  private addDashboardOptions(): void {
    this.visitTypes.forEach((item) => {
      const exists = this.dashboardOptions.some((o) => o.id === item.ID);
      if (item.visible && !exists) {
        this.dashboardOptions.push({
          id: item.ID,
          label: item.Ad,
          menu: 'refectory',
          items: [],
          value: '0',
          icon: item?.Simge,
          visible: true,
        });

        this.getValues('s', String(item.ID));
      }
    });
  }

  onChangeVisible(_: any): void {
    const visibleIds = this.visitTypes
      .filter((i) => i.visible)
      .map((i) => i.ID);
    this.setMenuVisible(JSON.stringify(visibleIds));
  }

  removeCard(item: { id: number }): void {
    const vt = this.visitTypes.find((x) => x.ID === item.id);
    if (vt) vt.visible = false;

    const visibleIds = this.visitTypes
      .filter((i) => i.visible)
      .map((i) => i.ID);
    this.setMenuVisible(JSON.stringify(visibleIds));
  }

  editModeToggle(): void {
    this.editMode = !this.editMode;
  }

  getPassList(lokasyon?: number, tarih?: any): void {
    const formatted = this.formatDate(tarih);
    const sp = [{ mkodu: 'yek406', lokasyon: String(lokasyon), tarih: formatted }];
    console.log(sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;
        this.passList = [...data];
        console.log(this.passList);
      });
  }

  private applyScoreTotals(): void {
    const totals = this.allScore.reduce(
      (acc, r) => {
        acc.sabah += this.toNum(r.sabah);
        acc.ogle += this.toNum(r.ogle);
        acc.aksam += this.toNum(r.aksam);
        acc.gece += this.toNum(r.gece);
        acc.ogundisi += this.toNum(r.ogundisi);
        return acc;
      },
      { sabah: 0, ogle: 0, aksam: 0, gece: 0, ogundisi: 0 }
    );

    const toplam =
      totals.sabah + totals.ogle + totals.aksam + totals.gece + totals.ogundisi;

    // Etiketleri Translate ile oluşturduğun için label eşleşmesi güvenli:
    this.setDashValue('Sabah', totals.sabah);
    this.setDashValue('Öğle', totals.ogle);
    this.setDashValue('Akşam', totals.aksam);
    this.setDashValue('Gece(Tanımlı Değil)', totals.gece);
    this.setDashValue('Öğün Dışı', totals.ogundisi);
    this.setDashValue('Toplam', toplam);
  }

  private toNum(v: number | string | null | undefined): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  private setDashValue(labelKey: string, value: number): void {
    const label = this.translateService.instant(labelKey);
    const opt = this.dashboardOptions.find((o) => o.label === label);
    if (opt) opt.value = this.nf.format(value);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
