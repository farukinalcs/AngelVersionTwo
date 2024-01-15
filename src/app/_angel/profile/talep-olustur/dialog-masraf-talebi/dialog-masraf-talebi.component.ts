import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { LayoutService } from 'src/app/_metronic/layout';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dialog-masraf-talebi',
  templateUrl: './dialog-masraf-talebi.component.html',
  styleUrls: ['./dialog-masraf-talebi.component.scss']
})
export class DialogMasrafTalebiComponent implements OnInit {

  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;
  @Output() advanceFormIsSend: EventEmitter<void> = new EventEmitter<void>();

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('IBAN'), desc: this.translateService.instant('IBAN_Bilgileri') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Diğer'), desc: this.translateService.instant('Tarih_Ve_Açıklama') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Tutar'), desc: '' },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
  ];

  formsCount: any = 6;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  advanceFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  advanceForm: FormGroup;
  uploadedFiles: any[] = [];
  uploadedFile: any;

  currentDate = new Date(Date.now());
  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');

  selectedAdvance: any;
  formId: any;
  files: any;
  fileTypes: any[] = [];
  displayUploadedFile: boolean;
  currentUploadedFile: any;
  ibanList: any[] = [] ;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    public layoutService: LayoutService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
    this.getIbanList();
    this.listenIbanValue();
    this.listenSelectedIban();
  }

  getIbanList() {
    this.profileService.getIbanList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      let data = response[0].x;
      const message = response[0].z;

      data.forEach((value: any) => {
        value.iban = value.iban.replace(/\s/g, '').match(/.{1,4}/g).join(' ');
        value.maskIban = this.maskIban(value.iban);
      });
      this.ibanList = data;
      console.log("İban Listesi Geldi : ", data);      

    });
  }

  maskIban(iban: string) {
    const ibanParts = iban.split(' ');
  
    const firstFour = ibanParts[0];
    const lastTwo = ibanParts[ibanParts.length - 1];
  
    const maskedMiddle = ibanParts.slice(1, ibanParts.length - 1).map(part => {
      return part.replace(/[0-9]/g, '*');
    });
  
    const maskedIban = [firstFour, ...maskedMiddle, lastTwo].join(' ');
    
    return maskedIban;
  }

  canProceedToNextStep(): boolean {
    this.advanceFormValues = Object.assign({}, this.advanceForm.value);
    // this.advanceFormValues.tutar != '' ? this.advanceFormValues.tutar = this.advanceFormValues.tutar.toFixed(2) : ''; 
    this.advanceFormValues.ibanKaydet ? this.advanceFormValues.ibanKaydet = 1 : this.advanceFormValues.ibanKaydet = 0;
    console.log("Avans Talep Form :", this.advanceFormValues);

    if (this.currentStep$.value === 3) {
      return this.advanceForm.valid;

    } else if (this.currentStep$.value === 4) {
      this.postForm(this.advanceFormValues);
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean {
    // if (this.currentStep$.value === 1) {
    //   return this.advanceForm.controls['gunluksaatlik'].valid;
    // } 
    // else if(this.currentStep$.value === 2) {
    //   return this.advanceForm.controls['tip'].valid;
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
    //   this.advanceForm.reset();
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
    this.advanceForm = this.formBuilder.group({
      aciklama: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      iban: ['TR', [Validators.required, Validators.pattern(/^TR\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{2}$/)]],
      ibanKaydet: [true],
      kayitliIbanlar: [''],
      tarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      tutar: ['', Validators.required],
      paraBirimi: ['TRY', Validators.required],
      taksit: [1, Validators.required],
      file: [null]
    });
  }

  listenIbanValue() {
    this.advanceForm.get('iban')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
      if (!value.startsWith("TR")) {
        this.advanceForm.get('iban')?.setValue("TR"+ value);
      }
      
      const formattedIBAN = value && value.startsWith('TR') ? value
        .replace(/\s/g, '') // Boşlukları kaldır
        .match(/.{1,4}/g) // Her 4 karakterde bir grupla
        .join(' ') // Her grubun arasına boşluk ekleyerek birleştir
        : 'TR' + value
      this.advanceForm.get('iban')?.setValue(formattedIBAN, { emitEvent: false });
      this.advanceForm.get('kayitliIbanlar')?.setValue(null);
    });  
  }

  listenSelectedIban() {
    this.advanceForm.get('kayitliIbanlar')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: string) => {
      value ? this.advanceForm.get('iban')?.setValue(value) : '';
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
        name: file.name,
        type: file.type,
        url: url,
        fileSize: fileSize,
        fileSizeType: fileSizeType
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
      this.advanceForm.reset();
      this.selectedAdvance = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.advanceFormIsSend.emit();
    });
  }


  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getAdvanceFormValues() {
    this.advanceFormValues = Object.assign({}, this.advanceForm.value);
    console.log("Avans Talep Form :", this.advanceFormValues);
  }

  postForm(formValues: any) {
    this.profileService.postAdvancedRequest(formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;
      const spMessage = response[0].m[0];

      console.log("Avans Form gönderildi :", response);
      if (data[0].sonuc == 1) {
        this.formId = data[0].formid;


        this.toastrService.success(
          this.translateService.instant('Talep_Gönderildi'),
          this.translateService.instant('Başarılı')
        );
      } else {
        this.toastrService.error(
          data[0].sunucucevap,
          this.translateService.instant('Hata')
        );
      }
    });
    this.ref.detectChanges();
  }

  getFileTypeForDemandType(typeId: any, kaynak: any) {
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

  showUploadedFile(item: any) {
    this.displayUploadedFile = true;
    this.currentUploadedFile = item;
  }

  getFormValues() {
    this.advanceFormValues = Object.assign({}, this.advanceForm.value);

    this.fileTypes.forEach((item: any) => {
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

  postOvertimeFile(file: any, formId: any, kaynak: any, fileType: any) {
    this.profileService.postFileForDemand(file, formId, kaynak, fileType)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {

        console.log("Avans talep için dosya gönderildi : ", response);
        this.closedFormDialog();

        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
