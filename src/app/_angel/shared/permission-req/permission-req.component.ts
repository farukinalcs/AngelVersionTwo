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
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

import { ProfileService } from '../../profile/profile.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permission-req',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    CalendarModule,
    DialogModule,
  ],
  templateUrl: './permission-req.component.html',
  styleUrls: ['./permission-req.component.scss'],
})
export class PermissionReqComponent implements OnInit, OnChanges, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private toastrService = inject(ToastrService);
  @Input() displayPermission = false;
  @Input() personInfo: any; // dizi beklenir (örnek verdiğin yapı)
  @Output() permissionHideEvent = new EventEmitter<void>();
  @Output() attendanceRefresh = new EventEmitter<any>();
  @Input() partNumber!: any;
  isLoading = new BehaviorSubject<boolean>(false);
  vacationReasons: any[] = [];
  vacationForm!: FormGroup;

  private readonly DAILY_START_EMPTY = false;

  private readonly DAILY_END_AT_MIDNIGHT_NEXT_DAY = true;

  private readonly FORCE_NEXT_DAY_END = true;

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  /* ================= Lifecycle ================= */

  ngOnInit(): void {
    this.createFormGroup();
    this.getVacationReason();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayPermission']?.currentValue === true) {
      this.createFormGroup();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  hidePermission() {
    this.permissionHideEvent.emit();
  }

  private createFormGroup() {
    this.vacationForm = this.fb.group(
      {
        tip: ['', Validators.required],
        aciklama: ['', Validators.required],
        gunluksaatlik: ['gunluk', Validators.required], // 'gunluk' | 'saatlik'
        basSaat: [{ value: null, disabled: true }],
        bitSaat: [{ value: null, disabled: true }],
      },
      { validators: this.timeRangeValidator('basSaat', 'bitSaat') }
    );

    this.vacationForm
      .get('gunluksaatlik')!
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mode: 'gunluk' | 'saatlik') => {
        const start = this.vacationForm.get('basSaat')!;
        const end = this.vacationForm.get('bitSaat')!;
        if (mode === 'saatlik') {
          start.enable({ emitEvent: false });
          end.enable({ emitEvent: false });
          start.addValidators(Validators.required);
          end.addValidators(Validators.required);
        } else {
          start.reset();
          end.reset();
          start.disable({ emitEvent: false });
          end.disable({ emitEvent: false });
          start.clearValidators();
          end.clearValidators();
        }
        start.updateValueAndValidity({ emitEvent: false });
        end.updateValueAndValidity({ emitEvent: false });
        this.vacationForm.updateValueAndValidity();
      });
  }

  private getVacationReason() {
    this.profileService
      .getTypeValues('cbo_izintipleri')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;
          this.vacationReasons = [...data];
        }
      );
  }

  private timeRangeValidator(startKey: string, endKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const mode = group.get('gunluksaatlik')?.value;
      if (mode !== 'saatlik') return null;

      const s: Date | null = group.get(startKey)?.value ?? null;
      const e: Date | null = group.get(endKey)?.value ?? null;
      if (!s || !e) return null;

      const sm = s.getHours() * 60 + s.getMinutes();
      const em = e.getHours() * 60 + e.getMinutes();
      return em > sm ? null : { timeOrder: true };
    };
  }

  /* ================= Utils ================= */

  private two(n: number) {
    return String(n).padStart(2, '0');
  }

  private toYmd(d: Date) {
    return `${d.getFullYear()}-${this.two(d.getMonth() + 1)}-${this.two(
      d.getDate()
    )}`;
  }

  private toYmdHm(d: Date) {
    return `${this.toYmd(d)} ${this.two(d.getHours())}:${this.two(
      d.getMinutes()
    )}`;
  }

  private parseDateSafe(v: any): Date | null {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private cloneDate(d: Date) {
    return new Date(d.getTime());
  }

  private addDaysToMidnight(d: Date, days: number) {
    const c = this.cloneDate(d);
    c.setDate(c.getDate() + days);
    c.setHours(0, 0, 0, 0); // 00:00
    return c;
  }

  private setTime(base: Date, time: Date) {
    const c = this.cloneDate(base);
    c.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return c;
  }

  private getRowBases(row: any) {
    const fromMesaitarih = this.parseDateSafe(row?.mesaitarih);
    const fromMesaibas = this.parseDateSafe(row?.mesaibas);
    const fromMesaibit = this.parseDateSafe(row?.mesaibit);

    const mesaitarih =
      fromMesaitarih ??
      (fromMesaibas
        ? new Date(
            fromMesaibas.getFullYear(),
            fromMesaibas.getMonth(),
            fromMesaibas.getDate()
          )
        : null) ??
      (fromMesaibit
        ? new Date(
            fromMesaibit.getFullYear(),
            fromMesaibit.getMonth(),
            fromMesaibit.getDate()
          )
        : null);

    const startBase =
      fromMesaibas ?? (mesaitarih ? this.cloneDate(mesaitarih) : null);
    const endBase =
      fromMesaibit ?? (mesaitarih ? this.cloneDate(mesaitarih) : null);

    return { mesaitarih, startBase, endBase };
  }

  private getTipId(val: any): string | number | null {
    if (!val) return null;
    return val.id ?? val.ID ?? val.kod ?? val.Kod ?? val.value ?? val ?? null;
  }

  /* ================= Submit ================= */

  sendPermission(): void {
    if (this.vacationForm.invalid) {
      this.vacationForm.markAllAsTouched();
      return;
    }

    this.isLoading.next(true);

    const v = this.vacationForm.getRawValue();
    const isSaatlik = v.gunluksaatlik === 'saatlik';
    const tipId = this.getTipId(v.tip) ?? '';

    // personInfo mutlaka DİZİ olsun
    const people: any[] = Array.isArray(this.personInfo)
      ? this.personInfo
      : this.personInfo
      ? [this.personInfo]
      : [];

    // Saatlikte form saatleri
    const startTime: Date | null = isSaatlik ? v.basSaat : null;
    const endTime: Date | null = isSaatlik ? v.bitSaat : null;

    // *** HER KİŞİ İÇİN AYRI OBJE (INDEX SIRASI KORUNUR) ***
    const sp = people.map((p) => {
      const sicil = String(p?.sicilid ?? p?.sicilno ?? '').trim();
      const { mesaitarih, startBase, endBase } = this.getRowBases(p);

      let bastarihToSend = '';
      let bittarihToSend = '';

      if (!isSaatlik) {
        // GÜNLÜK
        if (mesaitarih) {
          // başlangıç
          if (this.DAILY_START_EMPTY) {
            bastarihToSend = '';
          } else {
            const start = new Date(
              mesaitarih.getFullYear(),
              mesaitarih.getMonth(),
              mesaitarih.getDate(),
              0,
              0,
              0,
              0
            );
            bastarihToSend = this.toYmdHm(start); // "YYYY-MM-DD 00:00"
          }

          // bitiş
          if (this.DAILY_END_AT_MIDNIGHT_NEXT_DAY) {
            const end = this.addDaysToMidnight(mesaitarih, 1); // ertesi gün 00:00
            bittarihToSend = this.toYmdHm(end);
          } else {
            const end = new Date(
              mesaitarih.getFullYear(),
              mesaitarih.getMonth(),
              mesaitarih.getDate(),
              23,
              59,
              0,
              0
            );
            bittarihToSend = this.toYmdHm(end);
          }
        } else {
          // emniyet
          bastarihToSend = '';
          bittarihToSend = '';
          console.warn('Günlük mod: mesaitarih yok, kişi:', p);
        }
      } else {
        // SAATLİK
        const start =
          startBase && startTime ? this.setTime(startBase, startTime) : null;
        let end = endBase && endTime ? this.setTime(endBase, endTime) : null;

        if (this.FORCE_NEXT_DAY_END && end) {
          end.setDate(end.getDate() + 1);
        }
        if (!this.FORCE_NEXT_DAY_END && start && end && end <= start) {
          end.setDate(end.getDate() + 1);
        }

        bastarihToSend = start ? this.toYmdHm(start) : '';
        bittarihToSend = end ? this.toYmdHm(end) : '';
      }

      return {
        mkodu: 'yek049',
        tip: String(tipId),
        kaynak: 'izin',
        siciller: sicil,
        bastarih: bastarihToSend,
        bittarih: bittarihToSend,
        izinadresi: '',
        ulasim: '0',
        yemek: '0',
        aciklama: v.aciklama ?? '',
        otomatikonay: '1',
      };
    });
    console.log(sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const message = response?.[0]?.z;
          this.isLoading.next(false);
          if (message?.islemsonuc === -1) {
            this.toastrService.error('İşlem Başarısız');
          } else {
            this.hidePermission();
            this.toastrService.success('Başarılı');
                      const pn =
            this.partNumber ??
            this.personInfo?.part_number ??
            this.personInfo?.[0]?.part_number;

          if (pn != null) {
            this.attendanceRefresh.emit(pn); // ⬅️ parent burada getAttendanceData'yı çağıracak
          } else {
            console.warn(
              'partNumber bulunamadı, getAttendanceData tetiklenmedi.'
            );
          }
          }
        },
        error: () => this.isLoading.next(false),
      });
  }
}
