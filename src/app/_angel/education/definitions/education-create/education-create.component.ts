import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  query,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';
import Swal from 'sweetalert2';

type Category = {
  id: number;
  ad: string;
  xsicilid?: number;
  durum?: number;
  eklenmetarihi?: string;
};

type EducationRow = {
  id: number;
  baslik: string;
  icerik: string; // HTML string
  kategori: string; // "2,12"
  katilim: number; // toplam kontenjan
  egitimsuresi: number; // dakika (ör: 90)
  xsicilid: number;
  durum: number;
  eklenmetarihi: string; // ISO
  kategoriadlari: string; // "Yazılım..., Sertifikasyonlar"
};
const viewSwapAnimation = trigger('viewSwap', [
  transition('list => add', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [style({ position: 'absolute', top: 0, left: 0, width: '100%' })],
      { optional: true }
    ),
    group([
      query(
        ':leave',
        [
          animate(
            '300ms ease',
            style({ opacity: 0, transform: 'translateX(-100px)' })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateX(100px)' }),
          animate(
            '300ms ease',
            style({ opacity: 1, transform: 'translateX(0)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
  transition('add => list', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [style({ position: 'absolute', top: 0, left: 0, width: '100%' })],
      { optional: true }
    ),
    group([
      query(
        ':leave',
        [
          animate(
            '300ms ease',
            style({ opacity: 0, transform: 'translateX(100px)' })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateX(-100px)' }),
          animate(
            '300ms ease',
            style({ opacity: 1, transform: 'translateX(0)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
@Component({
  selector: 'app-education-create',
  standalone: true,
  templateUrl: './education-create.component.html',
  styleUrls: ['./education-create.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    EditorModule,
    InputNumberModule,
    MultiSelectModule,
    CalendarModule,
    ButtonModule,
    DialogModule,
    TooltipModule,

    DropdownModule,

    FloatLabelModule,
    IconFieldModule,
    InputIconModule,

    TranslateModule,
    CustomPipeModule,
  ],
  animations: [
    trigger('flipState', [
      state('list', style({ transform: 'rotateY(0deg)' })),
      state('add', style({ transform: 'rotateY(180deg)' })),
      transition('list <=> add', animate('400ms ease-in-out')),
    ]),
  ],
  providers: [DatePipe],
})
export class EducationCreateComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // UI state
  currentView: 'list' | 'add' = 'list';
  submitted = false;
  editSubmitted = false;
  editDisplay = false;
  editingId: number | null = null;
  filterText = '';

  // data
  categoryList: Category[] = [];
  educationList: EducationRow[] = [];

  // DI
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);
  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService);
  private datePipe = inject(DatePipe);
  private confirmationService = inject(ConfirmationService);
  // CREATE FORM
  form = this.fb.group({
    baslik: ['', [Validators.required, Validators.maxLength(120)]],
    icerik: ['', [Validators.required]],
    katilimSayisi: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(10000)],
    ],
    kategoriIds: [[] as number[], [Validators.required]],
    sure: [new Date(0, 0, 0, 0, 0), [Validators.required]], // 00:00
  });

  // EDIT FORM
  editForm: FormGroup = this.fb.group({
    baslik: ['', [Validators.required, Validators.maxLength(120)]],
    icerik: ['', [Validators.required]],
    katilimSayisi: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(10000)],
    ],
    kategoriIds: [[] as number[], [Validators.required]],
    sure: [new Date(0, 0, 0, 0, 0), [Validators.required]],
  });

  get f() {
    return this.form.controls as any;
  }
  get ef() {
    return this.editForm.controls as any;
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.getEducationList();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /* ---------- Helpers ---------- */

  minutesToHHMM(mins: number | null | undefined): string {
    const m = Number(mins ?? 0);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const hStr = String(h).padStart(2, '0');
    const mStr = String(mm).padStart(2, '0');
    return `${hStr}:${mStr}`;
  }

  hhmmToMinutes(d: Date | null): number | null {
    if (!d) return null;
    return d.getHours() * 60 + d.getMinutes();
  }

  fmtDateTime(iso: string | null | undefined): string {
    if (!iso) return '—';
    return this.datePipe.transform(iso, 'dd.MM.yyyy HH:mm') ?? '—';
  }

  trackById = (_: number, it: EducationRow) => it.id;

  filteredEducationList(): EducationRow[] {
    const q = (this.filterText || '').toLowerCase().trim();
    if (!q) return this.educationList;
    return this.educationList.filter(
      (it) =>
        (it.baslik || '').toLowerCase().includes(q) ||
        (it.kategoriadlari || '').toLowerCase().includes(q)
    );
  }

  submitUpdate() {
    
    this.editSubmitted = true;
    if (this.editForm.invalid || this.editingId == null) {
      this.editForm.markAllAsTouched();
      return;
    }

    const v = this.editForm.value;
    const sureDakika = this.hhmmToMinutes(v.sure as Date | null);

    const payload: any[] = [
      {
        mkodu: 'yek451', // ekle ile aynı kalsın dedin
        id: String(this.editingId),
        baslik: (v.baslik ?? '').trim(),
        icerik: String(v.icerik ?? ''),
        kategori: (v.kategoriIds ?? []).join(','),
        katilim: String(v.katilimSayisi ?? ''),
        egitimsuresi: String(sureDakika ?? ''),
      },
    ];

    console.log('Güncelle payload:', payload);

        this.profileService
          .requestMethod(payload)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const message = response?.[0]?.z;
            if (message?.islemsonuc == -1) return;

            this.confirmationService.success('Kayıt Güncellendi');
            this.getEducationList();
          });
    this.editDisplay = false;
  }
  openUpdate(row: EducationRow) {
    console.log('row', row);

    this.editingId = row.id;
    this.editDisplay = true;

    // gelen stringi normal HTML'e çevir
    const cleanHtml = row.icerik ? row.icerik.replace(/\\"/g, '"') : '';

    setTimeout(() => {
      this.editForm.patchValue({
        baslik: row.baslik,
        icerik: cleanHtml,
        katilimSayisi: row.katilim,
        kategoriIds: row.kategori?.split(',').map((x) => Number(x)) ?? [],
        sure: this.minutesToDate(row.egitimsuresi),
      });
    }, 0);
  }

  // dakika → Date (00:00 formatı)
  minutesToDate(mins: number | null): Date | null {
    if (mins == null) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return new Date(0, 0, 0, h, m);
  }

  showAdd() {
    this.currentView = 'add';
  }
  showList() {
    this.currentView = 'list';
  }

  getCategoryList() {
    const sp: any[] = [{ mkodu: 'yek447', id: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as Category[];
          const z = res?.[0]?.z;
          if (z?.islemsonuc === -1) return;

          this.categoryList = [...data]
            .filter((x) => x.durum === 1)
            .sort((a, b) => {
              const da = a.eklenmetarihi
                ? new Date(a.eklenmetarihi).getTime()
                : 0;
              const db = b.eklenmetarihi
                ? new Date(b.eklenmetarihi).getTime()
                : 0;
              return db - da;
            });
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  getEducationList() {
    const sp: any[] = [{ mkodu: 'yek449', id: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const data = (res?.[0]?.x ?? []) as EducationRow[];
          const z = res?.[0]?.z;
          if (z?.islemsonuc === -1) return;

          // normalize numbers
          this.educationList = (data ?? []).map((r) => ({
            ...r,
            katilim: Number(r.katilim ?? 0),
            egitimsuresi: Number(r.egitimsuresi ?? 0),
          }));
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  /* ---------- Create ---------- */

  onReset() {
    this.submitted = false;
    this.form.reset({
      baslik: '',
      icerik: '',
      katilimSayisi: null,
      kategoriIds: [] as number[],
      sure: new Date(0, 0, 0, 0, 0),
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const sureDakika = this.hhmmToMinutes(v.sure as Date | null);
    const payload: any[] = [
      {
        mkodu: 'yek448',
        baslik: (v.baslik ?? '').trim(),
        icerik: String(v.icerik ?? ''),
        kategori: (v.kategoriIds ?? []).join(','), // array → "1,5,6"
        katilim: String(v.katilimSayisi ?? ''), // number → string
        egitimsuresi: String(sureDakika ?? ''), // number → string
      },
    ];

    this.profileService
      .requestMethod(payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const z = res?.[0]?.z;
          if (z?.islemsonuc === -1) return;

          this.toastr.success(
            this.translateService.instant('Eklendi'),
            this.translateService.instant('Başarılı')
          );
          this.onReset();
          this.showList();
          this.getEducationList();
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  closeEdit() {
    this.editDisplay = false;
    this.editingId = null;
  }

  /* ---------- Delete ---------- */

  confirmDelete(row: EducationRow) {
    this.confirmationService.confirmDelete(row.baslik).then((result: any) => {
      if (result.isConfirmed) {
        const sp: any[] = [{ mkodu: 'yek453', id: row.id.toString() }];

        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const message = response?.[0]?.z;
            if (message?.islemsonuc == -1) return;

            this.confirmationService.success('Kayıt Kaldırıldı');
            this.getEducationList();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.confirmationService.error('İşlem Yapmaktan Vazgeçildi!');
      }
    });
  }

  /* ---------- Category quick actions ---------- */
  selectAllCategories() {
    const all = this.categoryList.map((c) => c.id);
    this.form.patchValue({ kategoriIds: all });
  }
  clearCategories() {
    this.form.patchValue({ kategoriIds: [] });
  }
}
