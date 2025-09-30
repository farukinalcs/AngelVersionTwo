import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormArray,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProfileService } from '../../profile/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';
import Swal from 'sweetalert2';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

interface RegistryGroup {
  id: number;
  ad: string;
  olusturmatarihi: string;
  duzenleyen: number;
}
interface ProductItem {
  id: number;
  ad: string;
  durum: number;
  kayitzamani: string;
  xsicilid: number;
}
interface DistributionRow {
  id: number;
  ad: string;
  dagitimurunid: number;
  secenekler: string | null;
  talepbaslangic: string;
  talepbitis: string;
  dagitimbaslangic: string;
  dagitimbitis: string;
  sicilgrubu: number;
  urunadi: string;
  sicilgrupadi: string;
  durum: number;
}

@Component({
  selector: 'app-product-distribution',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // PrimeNG
    ButtonModule,
    DropdownModule,
    CalendarModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    DialogModule,

    // Diğer
    TranslateModule,
    CustomPipeModule,
  ],
  providers: [DatePipe],
  templateUrl: './product-distribution.component.html',
  styleUrls: ['./product-distribution.component.scss'],
})
export class ProductDistributionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  @Output() submitted = new EventEmitter<any>();

  private confirmationService = inject(ConfirmationService);
  private datePipe = inject(DatePipe);
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService);
  private i18n = inject(TranslateService);
  private translateService = inject(TranslateService);

  // --- UI state ---
  display = false;             // (kullanımda değil, gerekirse)
  editDisplay = false;         // güncelle popup
  editingId: number | null = null;

  // --- dropdown verileri ---
  registryGroups: RegistryGroup[] = [];
  registryGroupOptions: { label: string; value: number }[] = [];

  productList: ProductItem[] = [];
  productOptions: { label: string; value: number }[] = [];
  productLabelById: Record<number, string> = {};

  // --- liste / arama ---
  filterText = '';
  distributionList: DistributionRow[] = [];

  // --- lokasyonlar ---
  locationList: Array<{ id: number; ad: string }> = [];
  selectedLocationId: number | null = null;

  // --- alert ---
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | null = null;

  // --- CREATE form (ekleme) ---
  form = this.fb.group(
    {
      ad: ['', [Validators.required, Validators.maxLength(120)]],
      dagitimurunid: [null as number | null, [Validators.required]],
      sicilgrubu: [null as number | null, [Validators.required]],

      talepbaslangic: [null as Date | null, [Validators.required]],
      talepbitis: [null as Date | null, [Validators.required]],
      dagitimbaslangic: [null as Date | null, [Validators.required]],
      dagitimbitis: [null as Date | null, [Validators.required]],

      // seçenekler opsiyonel: validators yok
      secenekler: this.fb.array([this.createOptionGroup('Numara', '')]),
    },
    { validators: [dateRangeValidator] }
  );

  // --- EDIT form (güncelle) ---
  editForm = this.fb.group(
    {
      ad: ['', [Validators.required, Validators.maxLength(120)]],
      dagitimurunid: [null as number | null, [Validators.required]],
      sicilgrubu: [null as number | null, [Validators.required]],

      talepbaslangic: [null as Date | null, [Validators.required]],
      talepbitis: [null as Date | null, [Validators.required]],
      dagitimbaslangic: [null as Date | null, [Validators.required]],
      dagitimbitis: [null as Date | null, [Validators.required]],

      secenekler: this.fb.array([]), // doldurulacak
    },
    { validators: [dateRangeValidator] }
  );

  // --- FormArray erişimleri ---
  get secenekler(): FormArray<
    FormGroup<{
      key: FormControl<string | null>;
      value: FormControl<string | null>;
    }>
  > {
    return this.form.get('secenekler') as any;
  }
  get editSecenekler(): FormArray<
    FormGroup<{
      key: FormControl<string | null>;
      value: FormControl<string | null>;
    }>
  > {
    return this.editForm.get('secenekler') as any;
  }

  private createOptionGroup(initKey = 'Numara', initValue = '') {
    return this.fb.group({
      key: this.fb.control<string | null>(initKey),
      value: this.fb.control<string | null>(initValue),
    });
  }
  createEditOption(key = 'Numara', value = '') {
    return this.fb.group({
      key: this.fb.control<string | null>(key),
      value: this.fb.control<string | null>(value),
    });
  }

  addOption() {
    const lastKey =
      this.secenekler.length > 0
        ? this.secenekler.at(this.secenekler.length - 1).get('key')?.value ||
          'Numara'
        : 'Numara';
    this.secenekler.push(this.createOptionGroup(lastKey, ''));
  }
  removeOption(i: number) {
    if (this.secenekler.length === 1) return;
    this.secenekler.removeAt(i);
  }

  trackByIndex = (i: number) => i;

  // --- seçenekler string build (tek tırnaklı istenen format) ---
  private buildSeceneklerString(): string | null {
    const rows = this.secenekler.controls
      .map((g) => {
        const key = (g.get('key')?.value ?? '').trim();
        const val = (g.get('value')?.value ?? '').trim();
        return { key, val };
      })
      .filter((x) => x.key && x.val);
    if (rows.length === 0) return null;

    const esc = (s: string) => s.replace(/'/g, "\\'");
    const parts = rows.map((x) => `{\'${esc(x.key)}\': \'${esc(x.val)}\'}`);
    return `[${parts.join(',')}]`;
  }
  private buildSeceneklerStringFrom(arr: FormArray): string | null {
    const rows = arr.controls
      .map((g: any) => {
        const key = (g.get('key')?.value ?? '').trim();
        const val = (g.get('value')?.value ?? '').trim();
        return { key, val };
      })
      .filter((x: any) => x.key && x.val);
    if (rows.length === 0) return null;

    const esc = (s: string) => s.replace(/'/g, "\\'");
    const parts = rows.map((x: any) => `{\'${esc(x.key)}\': \'${esc(x.val)}\'}`);
    return `[${parts.join(',')}]`;
  }

  // --- lifecycle ---
  ngOnInit(): void {
    this.getRegistryGroups();
    this.getProductList();
    this.getMyLocations(); // lokasyonlar yüklendikten sonra liste çekilecek
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // --- yardımcılar ---
  groupLabel(id: number | null | undefined): string {
    if (id == null) return '—';
    const found = this.registryGroupOptions.find((o) => o.value === id);
    return found?.label ?? '—';
  }
  productLabel(id: number | null | undefined): string {
    if (id == null) return '—';
    return this.productLabelById[id] ?? '—';
  }

  private parseSecenekler(src: string | null | undefined): string[] {
    if (!src) return [];
    const fixed = src.replace(/'/g, '"').trim();
    try {
      const arr = JSON.parse(fixed); // [{ "Numara": "39" }, ...]
      if (!Array.isArray(arr)) return [];
      return arr
        .map((o) => {
          const key = Object.keys(o ?? {})[0];
          if (!key) return '';
          return `${key}:${o[key]}`;
        })
        .filter(Boolean);
    } catch {
      return src
        .replace(/^\[|\]$/g, '')
        .split('},')
        .map((s) => s.replace(/[{}\[\]'"]/g, '').trim())
        .filter(Boolean);
    }
  }
  seceneklerPreview(row: DistributionRow): string {
    const parts = this.parseSecenekler(row.secenekler);
    return parts.join(', ') || '—';
  }

  private fmt(d: string | Date | null | undefined): string {
    if (!d) return '—';
    if (d instanceof Date)
      return this.datePipe.transform(d, 'dd.MM.yyyy') ?? '—';
    const s = String(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return this.datePipe.transform(s + 'T00:00:00', 'dd.MM.yyyy') ?? '—';
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
      const [dd, mm, yyyy] = s.split('-');
      return `${dd}.${mm}.${yyyy}`;
    }
    return s;
  }
  range(a: string, b: string): string {
    return `${this.fmt(a)} – ${this.fmt(b)}`;
  }

  private toDDMMYYYY(d: Date | null): string | null {
    if (!d) return null;
    // Backend 'yyyy-MM-dd' bekliyor
    return this.datePipe.transform(d, 'yyyy-MM-dd');
  }

  private parseToDate(s: string | null | undefined): Date | null {
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T00:00:00');
    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
      const [dd, mm, yyyy] = s.split('-').map(Number);
      return new Date(yyyy, mm - 1, dd);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // --- dropdown data ---
  getProductList(): void {
    const sp: any[] = [{ mkodu: 'yek424' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as ProductItem[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.productList = data;
          this.productOptions = this.productList.map((p) => ({
            label: p.ad,
            value: p.id,
          }));
          this.productLabelById = this.productOptions.reduce((acc, o) => {
            acc[o.value] = o.label;
            return acc;
          }, {} as Record<number, string>);

          if (
            !this.form.get('dagitimurunid')?.value &&
            this.productOptions.length
          ) {
            this.form.patchValue({
              dagitimurunid: this.productOptions[0].value,
            });
          }
        },
        error: () => {
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  getRegistryGroups(preselectId?: number): void {
    const sp: any[] = [{ mkodu: 'yek326' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as RegistryGroup[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.registryGroups = data;
          this.registryGroupOptions = this.registryGroups.map((g) => ({
            label: g.ad,
            value: g.id,
          }));

          const current =
            typeof preselectId === 'number'
              ? preselectId
              : this.form.get('sicilgrubu')?.value;
          if (current == null && this.registryGroupOptions.length) {
            this.form.patchValue({
              sicilgrubu: this.registryGroupOptions[0].value,
            });
          }
        },
        error: () => {
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  // --- LOKASYONLAR ---
  getMyLocations(): void {
    const sp: any[] = [{ mkodu: 'yek438', modul: 'dagitim' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as any[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.locationList = data ?? [];
          if (this.locationList.length > 0) {
            this.selectedLocationId = this.locationList[0].id; // ilk lokasyon otomatik seç
          } else {
            this.selectedLocationId = null;
          }

          // lokasyon belli -> listeyi çek
          this.getDistributionList();
        },
        error: () => {
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  onLocationChange(): void {
    this.getDistributionList();
  }

  // --- LİSTE ---
  getDistributionList(): void {
    if (!this.selectedLocationId) {
      // lokasyon yoksa API çağrısı yapma; listeyi temizle
      this.distributionList = [];
      return;
    }

    const sp: any[] = [{ mkodu: 'yek428', lokasyonid: String(this.selectedLocationId) }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as DistributionRow[];
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;
          this.distributionList = data ?? [];
        },
        error: () => {
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  // --- SUBMIT (CREATE) ---
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.setAlert('Lütfen zorunlu alanları ve tarih aralıklarını kontrol edin.', 'danger');
      return;
    }
    if (!this.selectedLocationId) {
      this.toastr.warning('Lütfen bir lokasyon seçiniz.');
      return;
    }

    const v = this.form.getRawValue();

    const sp: any[] = [{
      mkodu: 'yek430',
      ad: v.ad!,
      dagitimurunid: String(v.dagitimurunid!),
      secenekler: this.buildSeceneklerString() || null,
      talepbaslangictarihi: this.toDDMMYYYY(v.talepbaslangic)!,
      talepbitistarihi: this.toDDMMYYYY(v.talepbitis)!,
      dagitimbaslangictarihi: this.toDDMMYYYY(v.dagitimbaslangic)!,
      dagitimbitistarihi: this.toDDMMYYYY(v.dagitimbitis)!,
      sicilgrubu: String(v.sicilgrubu!),
      lokasyonid: String(this.selectedLocationId), // seçili lokasyon
    }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const message = response?.[0]?.z;
          if (message?.islemsonuc == -1) return;

          this.toastr.success(this.translateService.instant('Başarılı'));
          this.resetForm();
          this.getDistributionList();
          this.submitted.emit(sp[0]);
        },
        () => {
          this.toastr.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  // --- UPDATE ---
  update(item: DistributionRow) {
    this.editingId = item.id;
    this.editForm.reset({
      ad: item.ad,
      dagitimurunid: item.dagitimurunid ?? null,
      sicilgrubu: item.sicilgrubu ?? null,
      talepbaslangic: this.parseToDate(item.talepbaslangic),
      talepbitis: this.parseToDate(item.talepbitis),
      dagitimbaslangic: this.parseToDate(item.dagitimbaslangic),
      dagitimbitis: this.parseToDate(item.dagitimbitis),
    });
    this.fillEditOptionsFromString(item.secenekler ?? null);
    this.editDisplay = true;
  }
  private fillEditOptionsFromString(src: string | null) {
    this.editSecenekler.clear();
    const list = this.parseSecenekler(src).map((pair) => {
      const idx = pair.indexOf(':');
      if (idx === -1) return { k: 'Numara', v: pair };
      return { k: pair.slice(0, idx), v: pair.slice(idx + 1) };
    });
    if (list.length === 0) {
      this.editSecenekler.push(this.createEditOption('Numara', ''));
    } else {
      list.forEach((x) => this.editSecenekler.push(this.createEditOption(x.k, x.v)));
    }
  }
  closeEdit() {
    this.editDisplay = false;
    this.editingId = null;
  }
  submitUpdate(): void {
    if (this.editForm.invalid || this.editingId == null) {
      this.editForm.markAllAsTouched();
      this.toastr.warning(this.i18n.instant('Lütfen formu kontrol edin.'));
      return;
    }
    const v = this.editForm.getRawValue();

    const sp: any[] = [{
      mkodu: 'yek431',
      dagitimid: String(this.editingId),
      ad: v.ad!,
      dagitimurunid: String(v.dagitimurunid!),
      secenekler: this.buildSeceneklerStringFrom(this.editSecenekler), // null olabilir
      talepbaslangictarihi: this.toDDMMYYYY(v.talepbaslangic)!,
      talepbitistarihi: this.toDDMMYYYY(v.talepbitis)!,
      dagitimbaslangictarihi: this.toDDMMYYYY(v.dagitimbaslangic)!,
      dagitimbitistarihi: this.toDDMMYYYY(v.dagitimbitis)!,
      sicilgrubu: String(v.sicilgrubu!),
    }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const message = res?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.toastr.success(this.i18n.instant('Güncellendi'));
          this.editDisplay = false;
          this.getDistributionList();
        },
        error: () => {
          this.toastr.error(
            this.i18n.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.i18n.instant('Hata')
          );
        },
      });
  }

  // --- delete ---
  delete(item: any) {
    this.confirmationService.confirmDelete(item.ad).then((result: any) => {
      if (result.isConfirmed) {
        const sp: any[] = [{ mkodu: 'yek429', id: item.id.toString() }];

        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const message = response?.[0]?.z;
            if (message?.islemsonuc == -1) return;

            this.confirmationService.success('Kayıt Kaldırıldı');
            this.getDistributionList();
            this.closeAction();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.confirmationService.error('İşlem Yapmaktan Vazgeçildi!');
      }
    });
  }

  // --- diğer ---
  closeAction() {
    this.display = false;
  }
  resetForm(): void {
    this.form.reset({
      ad: '',
      dagitimurunid: null,
      sicilgrubu: null,
      talepbaslangic: null,
      talepbitis: null,
      dagitimbaslangic: null,
      dagitimbitis: null,
      secenekler: [],
    });
    this.secenekler.clear();
    this.secenekler.push(this.createOptionGroup('Numara', ''));
  }
  private setAlert(msg: string, type: 'success' | 'danger' | 'warning') {
    this.alertMessage = msg;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
  get f() {
    return this.form.controls;
  }
}

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const s1 = group.get('talepbaslangic')?.value as Date | null;
  const e1 = group.get('talepbitis')?.value as Date | null;
  const s2 = group.get('dagitimbaslangic')?.value as Date | null;
  const e2 = group.get('dagitimbitis')?.value as Date | null;
  const bad1 = s1 && e1 ? s1 > e1 : false;
  const bad2 = s2 && e2 ? s2 > e2 : false;
  return bad1 || bad2 ? { dateRange: true } : null;
}
