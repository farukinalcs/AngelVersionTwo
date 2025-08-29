import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FormStepperComponent } from 'src/app/_angel/shared/form-stepper/form-stepper.component';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    Dialog,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormStepperComponent,
    SelectModule,
    InlineSVGModule,
    TranslateModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  isCompleted: boolean = false;
  sicilId: any;
  selectedInventoryList: any[] = [];
  @Input() display: boolean;
    @Output() onHide = new EventEmitter<any>;
  stepperFields: any[] = [
    {
      class: 'stepper-item current',
      number: 1,
      title: this.translateService.instant('Ekipman'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 2,
      title: this.translateService.instant('Seçim'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 3,
      title: this.translateService.instant('Tamamlandı'),
      desc: this.translateService.instant('Özet_Bilgiler'),
    },
  ];
  formsCount: any = 3;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  inventoryForm: FormGroup;

  // Stepper responsive
  stepperOrientation: Observable<StepperOrientation>;

  inventoryListForm: FormGroup;
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUserSubject.subscribe((user) => {
      this.sicilId = user?.xSicilID;
    });
    this.inventoryForm = this.formBuilder.group({
      inventoryType: ['', Validators.required],
      inventoryDesc: ['', Validators.required],
      inventoryItem: ['', Validators.required],
    });
  }
  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.currentItem = this.stepperFields[prevStep - 1];
    let prevItem = this.stepperFields[prevStep];
    this.currentItem.class = 'stepper-item current';
    prevItem.class = 'stepper-item';
    this.selectedInventoryList = [] = [];
  }
  submitInventory(): void {
    // Tüm kontrolleri touched yap: UI'da hataları gösterir
    this.inventoryForm.markAllAsTouched();

    const descCtrl = this.inventoryForm.get('inventoryDesc');
    const itemCtrl = this.inventoryForm.get('inventoryItem');

    const descVal = (descCtrl?.value ?? '').toString().trim();

    const rawItemVal = itemCtrl?.value;
    const itemVal =
      rawItemVal == null
        ? ''
        : typeof rawItemVal === 'string'
        ? rawItemVal.trim()
        : (
            rawItemVal.name ??
            rawItemVal.ad ??
            rawItemVal.title ??
            rawItemVal.id ??
            ''
          )
            .toString()
            .trim();
    let hasError = false;
    if (!descVal) {
      this.toastrService.warning(
        this.translateService.instant('Açıklama_Zorunlu'),
        this.translateService.instant('Uyarı')
      );
      hasError = true;
    }
    if (!itemVal) {
      this.toastrService.warning(
        this.translateService.instant('Envanter_Öğesi_Zorunlu'),
        this.translateService.instant('Uyarı')
      );
      hasError = true;
    }
    if (hasError) return;

    if (!this.inventoryForm.valid) {
      this.toastrService.error(
        this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
        this.translateService.instant('Hata')
      );
      return;
    }

    const payload = this.inventoryForm.getRawValue();

    console.log(payload.inventoryDesc);
    const current = this.currentStep$.value;
    const next = current + 1;
    if (next <= this.formsCount) {
      this.currentStep$.next(next);
      this.currentItem = this.stepperFields[next - 1];
      this.currentItem.class = 'stepper-item current';
      if (next > 1)
        this.stepperFields[next - 2].class = 'stepper-item completed';
    }
    var req: any[] = [
      {
        mkodu: 'yek391',
        sicilid: String(this.sicilId),
        zimmetid: String(payload.inventoryItem.id),
        aciklama: payload.inventoryDesc,
      },
    ];
    console.log(req);
    this.profileService
      .requestMethod(req)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          this.toastrService.success(this.translateService.instant('Başarılı'));
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
        this.translateService.instant('Hata')
      );
      return;
    }

    const current = this.currentStep$.value;
    const type = this.inventoryForm.get('inventoryType')!.value as
      | string
      | null; // "0" | "1" | null
    if (current === 1) {
      if (type === '1') this.getAssetList('1'); // Ekipman
      else if (type === '0') this.getAssetList('2');
      else {
        this.toastrService.warning(
          this.translateService.instant('Lütfen_Bir_Tür_Seçin'),
          this.translateService.instant('Uyarı')
        );
        return;
      }
    }

    const next = current + 1;
    if (next <= this.formsCount) {
      this.currentStep$.next(next);
      this.currentItem = this.stepperFields[next - 1];
      this.currentItem.class = 'stepper-item current';
      if (next > 1)
        this.stepperFields[next - 2].class = 'stepper-item completed';
    }
  }

  canProceedToNextStep(): boolean {
    const formValue = this.inventoryForm.value;
    console.log('Envanter Talep Form :', formValue);

    if (this.currentStep$.value === 2) {
      return this.inventoryForm.valid;
    }
    return true;
  }

  getAssetList(type: string) {
    var sp: any[] = [
      {
        mkodu: 'yek385',
        id: '0',
        tip: type,
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('ekipman listesi geldi: ', data);

          this.selectedInventoryList = [...data];
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  closedFormDialog() {
    console.log('Closed Form');
    this.inventoryForm.reset();
    this.currentStep$.next(1);
    this.currentItem = this.stepperFields[0];
    this.selectedInventoryList = [] = [];
    this.onHide.emit();
  }
}
