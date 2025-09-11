import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { TooltipModule } from 'primeng/tooltip';

/** "HH:mm" string'leri için template literal type */
type HM = `${number}:${number}`;

type ApiSchedule = {
  id?: number;
  terminalgrubu?: number | string;
  saat1b?: number;
  saat1s?: number;
  saat2b?: number;
  saat2s?: number;
  saat3b?: number;
  saat3s?: number;
  saat4b?: number;
  saat4s?: number;
  saat5b?: number;
  saat5s?: number;
  saat6b?: number;
  saat6s?: number;
};

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    ToolbarModule,
    NgClass,
    CustomPipeModule,
    TooltipModule,
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnDestroy {
  deviceGroups: any[] = [];
  selectedDeviceGroup: any;
  relations: any[] = [];
  purposes: any[] = [];
  selectedPurpose: any;
  loading = true;

  form: FormGroup;

  private ngUnsubscribe = new Subject<void>();

  private readonly BASES = [
    'saat1',
    'saat2',
    'saat3',
    'saat4',
    'saat5',
    'saat6',
  ] as const;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [],
      terminalgrubu: [],


      saat1b: [this.toDate('00:00')],
      saat1s: [this.toDate('00:00')],
      saat2b: [this.toDate('00:00')],
      saat2s: [this.toDate('00:00')],
      saat3b: [this.toDate('00:00')],
      saat3s: [this.toDate('00:00')],
      saat4b: [this.toDate('00:00')],
      saat4s: [this.toDate('00:00')],
      saat5b: [this.toDate('00:00')],
      saat5s: [this.toDate('00:00')],
      saat6b: [this.toDate('20:00')],
      saat6s: [this.toDate('00:00')], // ertesi gün
    });
  }

  ngOnInit(): void {
    this.getTerminalGroupPurpose();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  private toDate(hm: HM): Date {
    const [h, m] = hm.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }


  private toHM(d: Date | null): HM {
    const dd = d ?? new Date(0);
    const hh = String(dd.getHours()).padStart(2, '0');
    const mm = String(dd.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}` as HM;
  }


  private minutesToHM(min: number): HM {
    const m = ((min % 1440) + 1440) % 1440;
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return `${hh}:${mm}` as HM;
  }

  /** 0–1439 dakika -> bugünün tarihiyle Date */
  private minutesToDate(min: number): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setMinutes(((min % 1440) + 1440) % 1440);
    return d;
  }

  /** 'HH:mm' -> toplam dakika (0–1439) */
  private hmToMinutes(hm: HM): number {
    const [h, m] = hm.split(':').map(Number);
    return (((h * 60 + m) % 1440) + 1440) % 1440;
  }

  private isValidHM(hm: string): hm is HM {
    const m = /^(\d{2}):(\d{2})$/.exec(hm);
    if (!m) return false;
    const h = +m[1],
      mm = +m[2];
    return h >= 0 && h <= 23 && mm >= 0 && mm <= 59;
  }

  private toMinutes(hm: HM): number {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  }

  private overlap(aStart: HM, aEnd: HM, bStart: HM, bEnd: HM): boolean {
    const expand = (s: HM, e: HM) => {
      const sMin = this.toMinutes(s);
      let eMin = this.toMinutes(e);
      if (eMin <= sMin) eMin += 24 * 60; // ertesi gün
      return [sMin, eMin] as const;
    };
    const [as, ae] = expand(aStart, aEnd);
    const [bs, be] = expand(bStart, bEnd);
    return as < be && bs < ae;
  }

  // ===== DATA AKIŞI =====

  getTerminalGroupPurpose() {
    this.loading = true;
    const sp: any[] = [{ mkodu: 'yek041', kaynak: 'sys_amaclar', id: '3' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.purposes = [...data];
          this.getDeviceGroups();
        },
        error: () => this.toastrService.error('Amaçlar alınamadı'),
      });
  }

  getDeviceGroups(item?: any) {
    const sp: any[] = [{ mkodu: 'yek190', amac: '3', id: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.deviceGroups = [...data];
          this.selectDeviceGroup(item || this.deviceGroups[0]);
        },
        error: () => this.toastrService.error('Terminal grupları alınamadı'),
      });
  }

  selectDeviceGroup(item: any) {
    this.selectedDeviceGroup = item;
    this.getRelation();
    this.matchPurpose();

    if (item?.id) {
      this.loadSchedule(item?.id);
    } else {
      this.loading = false;
    }
  }

  getRelation() {
    const sp: any[] = [
      {
        mkodu: 'yek155',
        kaynakid: '0',
        hedefid: String(this.selectedDeviceGroup?.id ?? '0'),
        hedeftablo: 'terminalgroup',
      },
    ];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.relations = [...data];
        },
        error: () => {
          this.toastrService.error('İlişki bilgisi alınamadı');
          this.loading = false;
        },
      });
  }

  matchPurpose() {
    const groupAmac = String(this.selectedDeviceGroup?.amac ?? '');
    this.selectedPurpose =
      this.purposes?.find(
        (p: any) => String(p?.ID ?? p?.id ?? '') === groupAmac
      ) ?? null;
  }


  private applyApiSchedule(api: ApiSchedule) {
    const patch: any = {
      id: api.id ?? null,
      terminalgrubu: api.terminalgrubu ?? this.selectedDeviceGroup?.id ?? null,
    };

    for (const base of this.BASES) {
      const b = `${base}b` as keyof ApiSchedule;
      const s = `${base}s` as keyof ApiSchedule;

      patch[b] = api[b] != null ? this.minutesToDate(api[b] as number) : null;
      patch[s] = api[s] != null ? this.minutesToDate(api[s] as number) : null;
    }

    this.form.patchValue(patch);
    this.ref.markForCheck?.();
  }


  loadSchedule(lokasyon?: number) {
    const sp: any[] = [{ mkodu: 'yek408', lokasyon: String(lokasyon) }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) {
            this.toastrService.error('Saatler yüklenemedi');
            this.loading = false;
            this.loading = false;
            return;
          }

          const row: ApiSchedule | undefined = data?.[0];
          if (row) {
            this.applyApiSchedule(row);
            this.toastrService.info('Saatler yüklendi');
          }
          this.loading = false;
        },
        error: () => {
          this.toastrService.error('Saatler yüklenemedi');
          this.loading = false;
        },
      });
  }



  onSave() {
    const v = this.form.value as Record<string, Date | null>;

    // Saatleri HM string ("HH:mm")'e çevir
    const sabahbas = this.toHM(v.saat1b);
    const sabahbit = this.toHM(v.saat1s);

    const oglenbas = this.toHM(v.saat2b);
    const oglenbit = this.toHM(v.saat2s);

    const aksambas = this.toHM(v.saat3b);
    const aksambit = this.toHM(v.saat3s);

    const gecebas = this.toHM(v.saat4b);
    const gecebit = this.toHM(v.saat4s);

    const ek1bas = this.toHM(v.saat5b);
    const ek1bit = this.toHM(v.saat5s);

    const ek2bas = this.toHM(v.saat6b);
    const ek2bit = this.toHM(v.saat6s);

    const lokasyon = String(this.selectedDeviceGroup?.id ?? '0');

    const sp: any[] = [
      {
        mkodu: 'yek409', 
        sabahbas,
        sabahbit,
        oglenbas,
        oglenbit,
        aksambas,
        aksambit,
        gecebas,
        gecebit,
        ek1bas,
        ek1bit,
        ek2bas,
        ek2bit,
        lokasyon,
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp: any) => {
          const msg = resp?.[0]?.z;
          if (msg?.islemsonuc === -1) {
            this.toastrService.error('Kayıt başarısız');
            return;
          }
          this.toastrService.success('Saatler kaydedildi');
        },
        error: () => this.toastrService.error('Kayıt sırasında hata'),
      });
  }

  onTimeChange(label: string, _event: any) {
  }
}
