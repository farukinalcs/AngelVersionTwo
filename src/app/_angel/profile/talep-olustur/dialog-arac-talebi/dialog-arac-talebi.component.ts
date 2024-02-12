import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-dialog-arac-talebi',
  templateUrl: './dialog-arac-talebi.component.html',
  styleUrls: ['./dialog-arac-talebi.component.scss']
})
export class DialogAracTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;
  @Output() vehicleFormIsSend: EventEmitter<void> = new EventEmitter<void>();
  
  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Lokasyon'), desc: this.translateService.instant('Gidilecek_Yer') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('Kalkış_Varış_Zamanı') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Diğer'), desc: '' },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
  ];

  formsCount: any = 6;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  vehicleFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  vehicleForm: FormGroup;
  uploadedFiles: any[] = [];
  uploadedFile: any;

  currentDate = new Date(Date.now());
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');

  selectedVehicle: any;
  formId: any;
  files: any;
  fileTypes: any[] = [];
  displayUploadedFile: boolean;
  currentUploadedFile: any;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
  }

  canProceedToNextStep(): boolean {
    this.vehicleFormValues = Object.assign({}, this.vehicleForm.value);
    console.log("Araç Talep Form :", this.vehicleFormValues);

    if(this.currentStep$.value === 3) {
      return this.vehicleForm.valid;

    } else if(this.currentStep$.value === 4) {
      this.postForm(this.vehicleFormValues);
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean {
    // if (this.currentStep$.value === 1) {
    //   return this.vehicleForm.controls['gunluksaatlik'].valid;
    // } 
    // else if(this.currentStep$.value === 2) {
    //   return this.vehicleForm.controls['tip'].valid;
    // }
    return true;
  }

  
  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
        this.translateService.instant('Hata')
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
  }
  
  prevStep() {
    // if (this.currentStep$.value === 2) {
    //   this.vehicleForm.reset();
    // }
    
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
    this.vehicleForm = this.formBuilder.group({
      aciklama: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      lokasyon: ['', Validators.required],
      bastarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      bassaat: [formatDate(this.currentDate, 'HH:mm', 'en'), Validators.required],
      bittarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      bitsaat: [formatDate(this.currentDate, 'HH:mm', 'en'), Validators.required],
      file: [null] 
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getFile(event: any, item: any) {
    let files: FileList = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      if (!this.checkFileSize(file, 1024 * 1024)) {
        this.toastrService.error(
          this.translateService.instant('Dosya_Boyutu_Yuksek'),
          this.translateService.instant('Hata')
        );
        return;
      }
    }
    
    console.log(files);
    item.sendFile = files[0];

    for (let file of event.target.files) {
      this.readAndPushFile(file, item);
    }
  }
  

  // Dosya boyutunu kontrol eden fonk.
  checkFileSize(file: File, maxSizeInBytes: number): boolean {
    const fileSizeInBytes = file.size;
    const maxSize = maxSizeInBytes;
    return fileSizeInBytes <= maxSize;
  }

  readAndPushFile(file: File, item: any) {
    let fileSize: any = (file.size / 1024).toFixed(1);
    let fileSizeType = 'KB';
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      fileSizeType = 'MB';
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target?.result as string);
      item.files = {
        name : file.name,
        type : file.type,
        url : url,
        fileSize : fileSize,
        fileSizeType : fileSizeType  
      };

      console.log("Uploaded File : ", this.uploadedFile);
      console.log("Uploaded Fileee : ", item);
      this.ref.detectChanges();
    };    
  }

  removeUploadedFile(item: any, file: any) {
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  closedFormDialog() {
    this.closedForm.subscribe(_ => {
      console.log("Closed Form : ", _);
      this.vehicleForm.reset();
      this.selectedVehicle = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.vehicleFormIsSend.emit();
    });
  }
  

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getVehicleFormValues() {
    this.vehicleFormValues = Object.assign({}, this.vehicleForm.value);
    console.log("Araç Talep Form :", this.vehicleFormValues);
  }

  postForm(formValues : any) {
    this.profileService.postOvertimeOrVacationDemand('fm', formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;
      const spMessage = response[0].m[0];

      console.log("Araç Form gönderildi :", response);
      if (data[0].sonuc == 1) {
        this.formId = data[0].formid;


        this.toastrService.success(
          this.translateService.instant('Talep_Gönderildi'),
          this.translateService.instant('Başarılı')
        );
      } else {
        this.toastrService.error(
          this.translateService.instant(spMessage.usermessage),
          this.translateService.instant('Hata')
        );
      }
    });
    this.ref.detectChanges();
  }

  getFileTypeForDemandType(typeId : any, kaynak : any) {
    this.fileTypes = [];
    this.profileService
    .getFileTypeForDemandType(typeId, kaynak)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Tipi geldi", data);
      this.fileTypes = data;

      this.ref.detectChanges();
    });
  }

  showUploadedFile(item : any) {
    this.displayUploadedFile = true;
    this.currentUploadedFile = item;
  }

  getFormValues() {
    this.vehicleFormValues = Object.assign({}, this.vehicleForm.value);

    this.fileTypes.forEach((item : any) => {
      if (item.sendFile) {
        this.postOvertimeFile(item.sendFile, this.formId, 'fm', item.BelgeId);
      }
    });

    this.toastrService.success(
      this.translateService.instant('Talep_Gönderildi'),
      this.translateService.instant('Başarılı')
    );
    // this.closedFormDialog();
  }

  postOvertimeFile(file : any, formId : any, kaynak : any, fileType : any) {
    this.profileService.postFileForDemand(file, formId, kaynak, fileType)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      
      console.log("Araç talep için dosya gönderildi : ", response);
      this.closedFormDialog();

      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
