import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';

type TermOpt = { label: string; value: number };

const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = (control.value ?? '') as string;
  return value.trim().length === 0 ? { whitespace: true } : null;
};

@Component({
  selector: 'app-in-out',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
  ],
  templateUrl: './in-out.component.html',
  styleUrl: './in-out.component.scss',
})
export class InOutComponent implements OnInit, OnDestroy, OnChanges {
  // ───────────────────────────────────────────────────────────────────────────────
  // Constants (Manual In/Out IDs)
  private readonly MANUAL_IN = 55; // Elle Giriş
  private readonly MANUAL_OUT = 56; // Elle Çıkış
  // ───────────────────────────────────────────────────────────────────────────────

  private profileService = inject(ProfileService);
  private ref = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private ngUnsubscribe = new Subject<void>();
  @Input() partNumber!: any; // parent'tan gelecek
  @Output() attendanceRefresh = new EventEmitter<any>();
  @Input() displayInOut!: boolean;
  @Input() selectedTerminal!: any;
  @Input() silinsin!: any;
  @Input() inOutData: any; // obje veya dizi gelebilir
  @Output() InOutHideEvent: EventEmitter<void> = new EventEmitter<void>();

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  deviceGroups: Array<{ id: number; ad: string }> = [];

  form = this.fb.group({
    terminal: [this.MANUAL_IN, Validators.required], // default: Elle Giriş (55)
    aciklama: [
      '',
      [Validators.required, noWhitespaceValidator, Validators.maxLength(200)],
    ],
    tarih: [new Date(), Validators.required],
    saat: [new Date(), Validators.required],
  });

  // PrimeNG TR locale (opsiyonel)
  tr = {
    firstDayOfWeek: 1,
    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    monthNames: [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ],
  };

  ngOnInit(): void {
    // Saat kontrolünü şu anki saat ile başlat (saniyeleri sıfırla)
    const now = new Date();
    now.setSeconds(0, 0);
    this.form.patchValue({ saat: now });

    // Dropdown verileri
    this.getDeviceGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Seçili terminali form'a set et (0/-1 geldiyse 55/56'ya map et)
    if (changes['selectedTerminal']) {
      let st = this.selectedTerminal;
      if (st === 0) st = this.MANUAL_IN;
      if (st === -1) st = this.MANUAL_OUT;

      if (st !== undefined && st !== null) {
        this.form.patchValue({ terminal: st });
      }
    }

    // displayInOut objesi gelince tarih set et (inOutData içindeki mesaitarih'ten)
    if (changes['displayInOut'] && this.displayInOut) {
      const mesaiTarihStr = this.inOutData?.mesaitarih; // "2025-09-02"
      if (mesaiTarihStr) {
        const date = new Date(mesaiTarihStr); // 00:00 locale
        this.form.patchValue({ tarih: date });
      }
    }
  }

  /** Servisten terminal gruplarını çek ve listeyi oluştur */
  getDeviceGroups(): void {
    this.isLoading.next(true);

    const sp = [{ mkodu: 'yek041', id: '0', kaynak: 'cbo_terminaller' }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x;
          const message = response?.[0]?.z;

          if (message?.islemsonuc === -1) {
            this.isLoading.next(false);
            return;
          }

          const normalized = (data as any[]).map((r: any) => ({
            id: Number(r?.ID ?? r?.id),
            ad: String(r?.ad ?? r?.AD ?? ''),
          }));

          // Yeni manuel seçenekler 55/56
          const manualIn = { id: this.MANUAL_IN, ad: 'Elle Giriş' };
          const manualOut = { id: this.MANUAL_OUT, ad: 'Elle Çıkış' };

          // Backend 55/56 döndürüyorsa kopya olmasın
          const withoutManuals = (normalized ?? []).filter((x: any) => {
            const id = Number(x?.id);
            return id !== this.MANUAL_IN && id !== this.MANUAL_OUT;
          });

          this.deviceGroups = [manualIn, manualOut, ...withoutManuals];

          this.isLoading.next(false);
          this.ref.markForCheck?.();
        },
        error: () => {
          this.isLoading.next(false);
        },
      });
  }

  blurCalendar(ev: any) {
    try {
      (ev?.target as HTMLInputElement)?.blur();
    } catch {}
  }

  /** Modal kapatma */
  hideInOutModal(): void {
    this.InOutHideEvent.emit();
  }

  get f() {
    return this.form.controls;
  }

  private formatForBackend(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`; // "YYYY-MM-DD HH:mm"
  }

  submit(): void {
    // Form validasyonu
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastrService?.error('Açıklama boş bırakılamaz.');
      return;
    }

    const { terminal, aciklama, tarih, saat } = this.form.getRawValue();

    // Ek güvenlik: açıklama trim ve boş kontrolü
    const aciklamaClean = String(aciklama ?? '').trim();
    if (!aciklamaClean) {
      this.form.get('aciklama')?.setErrors({ whitespace: true });
      this.toastrService?.error('Açıklama boş bırakılamaz.');
      return;
    }

    // tarih + saat birleştir
    const when = new Date(tarih as Date);
    const t = new Date(saat as Date);
    when.setHours(t.getHours(), t.getMinutes(), 0, 0);

    // Data her iki formu da desteklesin (obje/array)
    const list: any[] = Array.isArray(this.inOutData)
      ? this.inOutData
      : this.inOutData
      ? [this.inOutData]
      : [];

    // Terminal: @Input öncelikli, yoksa form’dan. 0/-1 geldiyse 55/56'ya map et.
    let terminalValue = this.selectedTerminal ?? terminal;
    terminalValue =
      terminalValue === 0
        ? this.MANUAL_IN
        : terminalValue === -1
        ? this.MANUAL_OUT
        : terminalValue;

    // Ortak alanlar (sil hariç, çünkü satıra göre değişecek)
    const common = {
      terminalid: String(terminalValue),
      aciklama: aciklamaClean,
      tarih: this.formatForBackend(when), // "YYYY-MM-DD HH:mm"
      tamamla: '1',
    };

    // Yardımcı: farklı casing’lerle gelebilecek alanları güvenli oku
    const pickCaseInsensitive = (obj: any, candidates: string[]): any => {
      if (!obj) return undefined;
      for (const key of Object.keys(obj)) {
        const lower = key.toLowerCase();
        for (const cand of candidates) {
          if (lower === cand.toLowerCase()) {
            return obj[key];
          }
        }
      }
      return undefined;
    };

    // sicilid’i güvenli al
    const getSicilId = (row: any) =>
      pickCaseInsensitive(row, ['sicilid', 'sicilId', 'SICILID']);

    // giriş/çıkış id’lerini güvenli al
    const getGirisId = (row: any) =>
      pickCaseInsensitive(row, ['girisid', 'girisId', 'GIRISID']);

    const getCikisId = (row: any) =>
      pickCaseInsensitive(row, ['cikisid', 'cikisId', 'CIKISID']);

    // sil değerini kurala göre hesapla (silinsin: 0 → '0', 1 → terminale göre girisid/cikisid)
    const computeSil = (row: any): string => {
      const s = Number(this.silinsin);
      if (s === 0) return '0';

      const term = Number(terminalValue);
      if (term === this.MANUAL_IN) {
        const gid = getGirisId(row);
        return gid != null ? String(gid) : '0';
      } else if (term === this.MANUAL_OUT) {
        const cid = getCikisId(row);
        return cid != null ? String(cid) : '0';
      }
      return '0';
    };

    const sp: any[] = [];

    for (const row of list) {
      const sicilid = getSicilId(row);
      if (sicilid == null) continue;

      const sil = computeSil(row);

      sp.push({
        mkodu: 'yek412',
        sicilid: String(sicilid),
        sil, // satıra özel
        ...common,
      });
    }

    console.log('Gönderilecek SP:', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const message = response?.[0]?.z;
        if (message?.islemsonuc === -1) {
          this.toastrService.error('İşlem Başarısız');
        } else {
          this.toastrService.success('Başarılı');
          this.hideInOutModal();

          // part number'ı en güvenli yerden bul
          const pn =
            this.partNumber ??
            this.inOutData?.part_number ??
            this.inOutData?.[0]?.part_number;

          if (pn != null) {
            this.attendanceRefresh.emit(pn); // ⬅️ parent burada getAttendanceData'yı çağıracak
          } else {
            console.warn(
              'partNumber bulunamadı, getAttendanceData tetiklenmedi.'
            );
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
