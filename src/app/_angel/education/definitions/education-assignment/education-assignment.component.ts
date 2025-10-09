import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';

import { RegistryListComponent } from 'src/app/_angel/shared/registry-list/registry-list.component';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

type RegistryGroup = { id: number; ad: string };
type Education = { id: number; baslik: string };

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as Date | null;
  const end = group.get('endDate')?.value as Date | null;
  if (!start || !end) return null;
  return end.getTime() > start.getTime()
    ? null
    : { range: 'end_must_be_after_start' };
}

@Component({
  selector: 'app-education-assignment',
  standalone: true,
  imports: [
    TranslateModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    TooltipModule,
    InputTextModule,
    InputSwitchModule,
    CommonModule,
    RegistryListComponent,
  ],
  templateUrl: './education-assignment.component.html',
  styleUrls: ['./education-assignment.component.scss'],
})
export class EducationAssignmentComponent implements OnDestroy {
  clear = false;
  refreshEvent = false;
  filterEvent = false;
  bulkChangeEvent = false;
  loading = false;

  private ngUnsubscribe = new Subject<void>();
  requestTime: any;

  tabList = [{ name: this.translateService.instant('Hepsi'), type: '0' }];
  selectedTab = this.tabList[0];

  registryOptions: { label: string; value: number }[] = [];
  educationOptions: { label: string; value: number }[] = [];

  form: FormGroup = this.fb.group(
    {
      registryIds: [[], Validators.required], // MultiSelect -> number[]
      educationId: [null, Validators.required], // Dropdown -> number
      startDate: [null, Validators.required], // Date
      endDate: [null, Validators.required], // Date
      online: [false], // boolean (submit’te 0/1’e çevrilecek)
      egitimadi: ['', [Validators.maxLength(500)]], // etiket toggle’a göre değişir
    },
    { validators: dateRangeValidator }
  );

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private attendanceService: AttendanceService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getRegistryGroups();
    this.getEducationList();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // UI helpers
  clearFilters() {
    this.clear = !this.clear;
  }
  loadingEvent(event: boolean) {
    this.loading = event;
    this.ref.detectChanges();
  }
  getRequestTime(event: any) {
    this.requestTime = event;
  }
  refreshList() {
    this.refreshEvent = !this.refreshEvent;
  }
  onFilter() {
    this.filterEvent = !this.filterEvent;
  }
  onClickBulkChange() {
    this.bulkChangeEvent = !this.bulkChangeEvent;
  }

  // Data
  getRegistryGroups(): void {
    const sp: any[] = [{ mkodu: 'yek326' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as RegistryGroup[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.registryOptions = data
            .map((d) => ({ label: d.ad, value: d.id }))
            .sort((a, b) => (a.value === 0 ? -1 : b.value === 0 ? 1 : 0));
        },
        error: () =>
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          ),
      });
  }

  getEducationList(): void {
    const sp: any[] = [{ mkodu: 'yek449', id: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as any[];
          const z = res?.[0]?.z;
          if (z?.islemsonuc === -1) return;

          this.educationOptions = data.map((e: Education) => ({
            label: e.baslik,
            value: e.id,
          }));
        },
        error: () =>
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          ),
      });
  }

  // Submit
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.errors?.['range']) {
        this.toastrService.warning(
          this.translateService.instant(
            'Bitiş tarihi başlangıçtan büyük olmalı'
          )
        );
      } else {
        this.toastrService.warning(
          this.translateService.instant('Lütfen_zorunlu_alanları_doldurun')
        );
      }
      return;
    }

    const v = this.form.value;
    const items = this.attendanceService.selectedItems$
      .pipe(take(1))
      .subscribe((items) => {
        const he = items
        console.log(he)
      });
    const payload = {
      registryIds: String(this.form.value.registryIds.join(',')),
      educationId: String(this.form.value.educationId),
      startISO: (v.startDate as Date).toISOString(),
      endISO: (v.endDate as Date).toISOString(),
      online: v.online ? 1 : 0, // 0/1
      egitimadi: v.egitimadi?.trim() || '',
    };

    console.log('PAYLOAD →', payload);
    this.toastrService.success(
      this.translateService.instant('Seçimler_loglandı')
    );
    // Buradan gerçek endpoint’e gönderebilirsin.
  }

  // Label helper
  get egitimLabel(): string {
    return this.form.get('online')?.value ? 'Eğitim Linki' : 'Eğitim Yeri';
  }
}
