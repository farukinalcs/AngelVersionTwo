import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    Dialog,
    InlineSVGModule
  ],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;
  @Input() display: boolean;
  @Output() onHide = new EventEmitter<any>;
  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Duyuru_Bilgileri'), desc: this.translateService.instant('T') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Tarih_Bilgileri'), desc: this.translateService.instant('T') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Önizleme'), desc: this.translateService.instant('T') },
  ];

  formsCount: any = 4;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  announcementFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  announcementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep$.value === 2) {
      this.announcementFormValues = Object.assign({}, this.announcementForm.value);
      return this.announcementForm.valid;
      
    } else if (this.currentStep$.value === 3) {
      this.announcementFormValues = Object.assign({}, this.announcementForm.value);
      
    }
    this.ref.detectChanges();
    
    return true;
    
  }


  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error("Form Alanlarını Doldurmalısınız", "Hata");
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
  }

  prevStep() {
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


  // Formların oluşması
  createFormGroup() {
    this.announcementForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      owner: ['', Validators.required],
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  closedFormDialog() {
    this.announcementForm.reset();
    this.resetStepperFieldsClass();
    this.currentStep$.next(1);
    this.currentItem = this.stepperFields[0];
    this.onHide.emit();
  }

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getFormValues() {
    let announcementFormValues = Object.assign({}, this.announcementForm.value);
    console.log("Form Values : ", announcementFormValues);
    this.postAnnouncementForm(announcementFormValues);
  }

  postAnnouncementForm(formValues : any) {
    // this.profileService.postAnnouncementForm(formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
    //   console.log("Bülten Gönderildi :", response);
    
    // }, (error : any) => {
    //   console.log("Form Gönderilemedi :", error);
      
    // });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
