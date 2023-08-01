import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { AccessDataModel } from '../../models/accessData';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ProfileService } from '../../profile.service';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-ziyaretci-talebi',
  templateUrl: './dialog-ziyaretci-talebi.component.html',
  styleUrls: ['./dialog-ziyaretci-talebi.component.scss']
})
export class DialogZiyaretciTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: 'Tip', desc: 'Ziyaret Tipi' },
    { class: 'stepper-item', number: 2, title: 'Kişi', desc: 'Ziyaret Edecek Kişi Bilgileri' },
    { class: 'stepper-item', number: 3, title: 'Ziyaretçiler', desc: '' },
    { class: 'stepper-item', number: 4, title: 'İletişim', desc: 'Diğer Bilgiler' },
    { class: 'stepper-item', number: 5, title: 'Giriş-Çıkış', desc: 'Zaman Bilgileri' },
    { class: 'stepper-item', number: 6, title: 'Dosya Yükle', desc: 'Gerekli belgeler' },
    { class: 'stepper-item', number: 7, title: 'Tamamlandı', desc: 'Özet bilgiler' },
  ];

  formsCount: any = 8;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  visitorFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;
  // Form geçerli ise geçiş olsun
  isLinear: boolean = true

  // First form geçerli mi
  isFirstFormValid: boolean = false;
  // Second form geçerli mi
  isSecondFormValid: boolean = false;
  visitTypeForm: FormGroup;
  visitType: any;
  personInformationForm: FormGroup;
  personInformation: any;
  visitors: any[] = [];
  company: any[];
  selectedCompany: any;
  visitTypes: OKodFieldsModel[];
  uploadedFile: any;
  src: any;
  uploadedFiles: any[] = [];
  isOtherCompany: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private profileService: ProfileService,
    private toastrService : ToastrService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
    this.getAccessData();
    this.getOKodField('cbo_ziyaretnedeni');
    this.visitTypeLearn();
    this.personInformationLearn();
    this.isThereCompany();
    this.closedFormDialog();
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep$.value === 1) {
      return this.visitTypeForm.controls['visitType'].valid;
    } else if(this.currentStep$.value === 2) {
      return this.visitTypeForm.controls['personInformation'].valid;
    }
    return true;
  }

  canProceedToPrevStep(): boolean {
    if (this.currentStep$.value === 1) {
      return this.visitTypeForm.controls['visitType'].valid;
    } else if(this.currentStep$.value === 2) {
      return this.visitTypeForm.controls['personInformation'].valid;
    }
    return true;
  }

  
  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error("Seçim Yapmalısınız", "HATA");
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
    if (this.currentStep$.value === 2) {
      this.visitTypeForm.controls['personInformation'].reset();
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
  

  // Formların oluşması
  createFormGroup() {
    this.visitTypeForm = this.formBuilder.group({
      visitType: ['',Validators.required],
      personInformation: ['',Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: [''],
      company: [''],
      description: [''],
      type: [''],
      entryDate: [''],
      entryTime: [''],
      exitDate: [''],
      exitTime: [''],
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getAccessData() {
    this.profileService.getAccessData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<AccessDataModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      this.company = [];

      if (message.islemsonuc == 1) {
        data.forEach((item: AccessDataModel) => {
          if (item.tip == 'cbo_Firma') {
            this.company.push(item);
          }
        })
      }
      console.log("cbo_firma :", this.company);


      this.ref.detectChanges();
    });
  }

  getOKodField(kaynak: string) {
    this.profileService.getOKodField(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        console.log("Okod Alanları : ", data);
        this.visitTypes = data;
      }

      this.ref.detectChanges();
    });
  }

  visitTypeLearn() {
    this.visitTypeForm.get('visitType')?.valueChanges.subscribe((value) => {
      console.log(value);
      this.visitType = value;
    });
  }

  personInformationLearn() {
    this.visitTypeForm.get('personInformation')?.valueChanges.subscribe((value) => {
      console.log(value);
      this.personInformation = value;
    });
  }

  addVisitor() {
    let formValues = Object.assign({}, this.visitTypeForm.value);

    this.visitors.push({
      name: formValues.name,
      surname: formValues.surname
    });

    console.log("Visitors :", this.visitors);

    this.visitTypeForm.get('name')?.reset();
    this.visitTypeForm.get('surname')?.reset();

    this.ref.detectChanges();
  }

  removeVisitor(item: any) {
    const index = this.visitors.indexOf(item);
    if (index !== -1) {
      this.visitors.splice(index, 1);
      this.ref.detectChanges();
    }
  }

  isFirstVisitor(index: number): boolean {
    return index === 0;
  }

  getFile(event: any) {
    let files: FileList = event.target.files;
    console.log(event.target.files);
  
    for (const item of event.target.files) {
      this.readAndPushFile(item);
    }
  
    console.log("Uploaded Files:", this.uploadedFiles);
  }
  
  readAndPushFile(file: File) {
    let fileSize: any = (file.size / 1024).toFixed(1);
    let fileSizeType = 'KB';
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      fileSizeType = 'MB';
    }
  
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      let url = event.target?.result;
      this.uploadedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        fileSize: fileSize + ' ' + fileSizeType,
        url: url,
      });
      this.ref.detectChanges();
    };
  }

  isThereCompany() {
    this.visitTypeForm.get('company')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value : any) => {
      if (value?.id == '0') {
        this.visitTypeForm.addControl('otherCompany', this.formBuilder.control('', Validators.required));
        this.isOtherCompany = true; // ng-container da durum kontrolü için eklendi
      } else {
        this.isOtherCompany = false; // ng-container da durum kontrolü için eklendi
      }
    });
  }

  removeUploadedFile(item: any) {
    const index = this.uploadedFiles.indexOf(item);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  closedFormDialog() {
    this.closedForm.subscribe(_ => {
      console.log("Closed Form : ", _);
      this.visitTypeForm.reset();
      this.visitors = [];
      this.uploadedFiles = [];
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
    });
  }
  

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }
  


  ngOnDestroy(): void {
    this.visitTypeForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}