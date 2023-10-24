import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserType } from 'src/app/modules/auth';

@Component({
  selector: 'app-dialog-yetki-talebi',
  templateUrl: './dialog-yetki-talebi.component.html',
  styleUrls: ['./dialog-yetki-talebi.component.scss']
})
export class DialogYetkiTalebiComponent implements OnInit, OnDestroy {
  @Output() authorityRequestFormIsSend: EventEmitter<void> = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: 'Geçiş Grubu', desc: '' },
    { class: 'stepper-item', number: 2, title: 'Süreli-Süresiz', desc: '' },
    { class: 'stepper-item', number: 3, title: 'Açıklama', desc: '' },
    { class: 'stepper-item', number: 4, title: 'Özet', desc: '' },
  ];

  authorityForm: FormGroup;
  formsCount: any = 5;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  stepperOrientation: Observable<StepperOrientation>; // Stepper responsive
  durationType: any;
  formValues: any;
  transitionGroup: any[] = [];
  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  user$: Observable<UserType>;
  displayPersonsList: boolean = false;

  constructor(
    private profileService: ProfileService,
    public layoutService: LayoutService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private translateService : TranslateService,
    private toastrService : ToastrService,
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserInformations();
    this.getTransitionGroup('Yetkitalep');
    this.setResponsiveForm();
    this.createFormGroup();
    this.changedDurationType()
  }

  setResponsiveForm() { // Stepper'ı Yataydan Dikeye Çevir
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  canProceedToNextStep(): boolean { // Sonraki Adım Kontrolü
    if (this.currentStep$.value === 2) {
      // return this.authorityForm.controls['durationType'].valid; // 2. Adımı Geçtiğinde, 2. Adımda İşarretleme Yapıldı Mı Kontrolü
    } else if(this.currentStep$.value === 3) {
      return this.authorityForm.valid; // 3. Adımı Geçtiğinde, Form Geçerli Mi Kontrolü 
    }
    return true;
  }

  canProceedToPrevStep(): boolean { // Önceki Adım Kontrolü
    if (this.currentStep$.value === 1) {
      return this.authorityForm.controls['visitType'].valid;

    } else if(this.currentStep$.value === 2) {
      return this.authorityForm.controls['personInformation'].valid; // 1. Adıma Geri Döndüğünde, 2. Adımı Resetlemek İçin
    }

    return true;
  }

  nextStep() { // Sonraki Adıma Geçtiğinde Çalışan Fonksiyon
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant('TOASTR_MESSAGE.ALANLARI_DOLDURMALISINIZ'),
        this.translateService.instant('TOASTR_MESSAGE.HATA')
      );
      return;
    }
  
    const nextStep = this.currentStep$.value + 1;
    if (nextStep <= this.formsCount) {
      this.currentStep$.next(nextStep);
      this.currentItem = this.stepperFields[nextStep - 1];
      this.currentItem.class = "stepper-item current";

      if (nextStep > 1) {
        this.stepperFields[nextStep - 2].class = "stepper-item completed";
      }
    }

    this.formValues = this.getFormValues();
  }
  
  prevStep() { // Öneceki Adıma Geçtiğinde Çalışan Fonksiyon
    if (this.currentStep$.value === 2) {
      ['startDate', 'startTime', 'endDate', 'endTime'].forEach(controlName => {
        this.authorityForm.controls[controlName].reset();
      });
    }
    
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.currentItem = this.stepperFields[prevStep - 1];
    let prevItem = this.stepperFields[prevStep];
    this.currentItem.class = "stepper-item current";
    prevItem.class = "stepper-item";
  }  

  createFormGroup() { // Formların Oluşması
    this.authorityForm = this.formBuilder.group({
      transitionGroup: ['',Validators.required],
      durationType: ['',Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required ],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getTransitionGroup(valueType: any) {
    this.profileService.getTypeValues(valueType).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.transitionGroup = data;

      console.log("Geçiş Gruubu : ", this.transitionGroup);
      
      this.ref.detectChanges();
    });
  }

  getFormValues(): any {
    let authorityFormValues: any = Object.assign({}, this.authorityForm.value);

    this.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user: any) => {
      authorityFormValues.sicillerim = user.xSicilID;
    });
    
    console.log("Form Values : ", authorityFormValues);
    
    return authorityFormValues;
  }

  changedDurationType() {
    this.authorityForm.controls['durationType'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
      this.durationType = value;

      if (this.durationType == 0) {
        ['startDate', 'startTime', 'endDate', 'endTime'].forEach((control: any) => {
          this.authorityForm.get(control)?.clearValidators();
          this.authorityForm.get(control)?.updateValueAndValidity();
          
        });
      } else {
        ['startDate', 'startTime', 'endDate', 'endTime'].forEach((control: any) => {
          this.authorityForm.get(control)?.setValidators([Validators.required]);
          this.authorityForm.get(control)?.updateValueAndValidity();
        });
      }
    });
  }

  postForm(formValues: any) {
    console.log("Form Gönderildi: ", formValues);
    this.profileService.postAuthorityRequest(formValues, '0').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Yetki Talebi Gönderildi : ", data);
      
      
    });
  }

  getCurrentUserInformations() {
    this.user$ = this.authService.currentUserSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
