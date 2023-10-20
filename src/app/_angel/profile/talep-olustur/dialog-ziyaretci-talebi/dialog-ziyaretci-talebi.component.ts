import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ProfileService } from '../../profile.service';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-dialog-ziyaretci-talebi',
  templateUrl: './dialog-ziyaretci-talebi.component.html',
  styleUrls: ['./dialog-ziyaretci-talebi.component.scss']
})
export class DialogZiyaretciTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;
  @Output() visitRequestFormIsSend: EventEmitter<void> = new EventEmitter<void>();

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_1'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_1') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_2'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_2') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_3'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_3') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_4'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_4') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_5'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_5') },
    { class: 'stepper-item', number: 6, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_7'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_7') },
    { class: 'stepper-item', number: 7, title: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.HEADER_6'), desc: this.translateService.instant('ZIYARETCI_TALEP_DIALOG.STEPPER.MESSAGE_6') },
  ];

  formsCount: any = 8;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  visitorFormValues: any;
  stepperOrientation: Observable<StepperOrientation>; // Stepper responsive
  visitTypeForm: FormGroup; // Ziyaretçi Formu İçin oluşturulan FormGroup
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
  selectedVisitor: any; 
  selectedVisitorIndex: number; 
  user$ = this.auth.currentUserSubject.asObservable(); // Login Bilgilerinin Tutulduğu Değişken (sbs)
  fileTypes: any[] = []; // Zorunlu Belge tiplerinin Tutuluduğu Arr
  displayUploadFiles : boolean = false;

  
  
  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private profileService: ProfileService,
    private toastrService : ToastrService,
    public authService : AuthService,
    private translateService : TranslateService,
    private ref: ChangeDetectorRef,
    public auth : AuthService,
    public layoutService : LayoutService,
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
    this.getVisitorCompany('cbo_ziyaretcifirma');
    this.getVisitTypes('cbo_ziyaretnedeni');
    this.visitTypeLearn();
    this.personInformationLearn();
    this.isThereCompany();
    // this.closedFormDialog();
    this.typeChanges();
  }

  canProceedToNextStep(): boolean { // Sonraki Adım Kontrolü
    if (this.currentStep$.value === 1) {
      return this.visitTypeForm.controls['visitType'].valid; // 2. Adımı Geçtiğinde, 1. Adımda İşarretleme Yapıldı mı Kontrolü

    } else if(this.currentStep$.value === 2) {
      return this.visitTypeForm.controls['personInformation'].valid; // 3. Adımı Geçtiğinde, 2. Adımda İşarretleme Yapıldı mı Kontrolü
      
    } else if(this.currentStep$.value === 5) {
      return this.visitTypeForm.valid;

    } else if(this.currentStep$.value === 6) {
      this.postVisitorForm(this.getFormValues()); // 6. Adımı Geçtiğinde Girilen Form API'ye gönderiliyor   
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean { // Önceki Adım Kontrolü
    if (this.currentStep$.value === 1) {
      return this.visitTypeForm.controls['visitType'].valid;

    } else if(this.currentStep$.value === 2) {
      return this.visitTypeForm.controls['personInformation'].valid; // 1. Adıma Geri Döndüğünde, 2. Adımı Resetlemek İçin
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

    let visitorFormValues = Object.assign({}, this.visitTypeForm.value);
    visitorFormValues.visitors = this.visitors;

    this.visitorFormValues = visitorFormValues;
    console.log("Form Values : ", this.visitorFormValues);
  }
  
  prevStep() { // Öneceki Adıma Geçtiğinde Çalışan Fonksiyon
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

  createFormGroup() { // Formların Oluşması
    this.visitTypeForm = this.formBuilder.group({
      visitType: ['',Validators.required],
      personInformation: ['',Validators.required],
      name: [''],
      surname: [''],
      email: ['', Validators.compose([Validators.required, Validators.email]) ],
      company: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      entryDate: ['', Validators.required],
      entryTime: ['', Validators.required],
      exitDate: ['', Validators.required],
      exitTime: ['', Validators.required],
    });
  }

  setResponsiveForm() { // Stepper'ı Yataydan Dikeye Çevir
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getVisitorCompany(kaynak: string) { // API'den Ziyaretçi Firmaları Alıyor
    this.profileService.getTypeValues(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      this.company = [];

      if (message.islemsonuc == 1) {
        this.company = data;
      }
      console.log("cbo_firma :", this.company);


      this.ref.detectChanges();
    });
  }

  getVisitTypes(kaynak: string) { // API'den Ziyaret Nedenlerini Alıyor
    this.profileService.getTypeValues(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        console.log("Okod Alanları : ", data);
        this.visitTypes = data;
      }

      this.ref.detectChanges();
    });
  }

  visitTypeLearn() { // 1. Adımın Form Değerini Alıyor
    this.visitTypeForm.get('visitType')?.valueChanges.subscribe((value) => {
      console.log(value);
      this.visitType = value;
    });
  }

  personInformationLearn() { // 2.Adımın Form Değerini Alıyor
    this.visitTypeForm.get('personInformation')?.valueChanges.subscribe((value) => {
      this.visitors = [];
      this.visitTypeForm.get('name')?.clearValidators();
      this.visitTypeForm.get('surname')?.clearValidators();

      this.visitTypeForm.get('name')?.setValue('');
      this.visitTypeForm.get('surname')?.setValue('');

      this.visitTypeForm.get('surname')?.enable();
      this.visitTypeForm.get('name')?.enable();

      console.log(value);
      this.personInformation = value;

      this.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((_user : any) => {
        if (this.personInformation == 5) {
          this.visitors.push({
            name: _user.ad,
            surname: _user.soyad,
            // files : []
          });

        } else if (this.personInformation == 3) {
          this.visitTypeForm.get('name')?.addValidators([Validators.required]);
          this.visitTypeForm.get('surname')?.addValidators([Validators.required]);

          this.visitTypeForm.get('name')?.setValue(_user.ad);
          this.visitTypeForm.get('surname')?.setValue(_user.soyad);
          
          // this.visitTypeForm.get('name')?.disable();
          // this.visitTypeForm.get('surname')?.disable();

        }
      });
      
    });
  }

  addVisitor() { // Ziyaretçi Ekleme Fonksiyonu
    let formValues = Object.assign({}, this.visitTypeForm.value);

    if (formValues.name && formValues.surname) {
      this.visitors.push({
        name: formValues.name,
        surname: formValues.surname,
        // files : []
      });  
    } else {
      this.toastrService.error("İsim-Soyisim Alanı Boş Bırakılamaz", "HATA");
    }
    

    console.log("Visitors :", this.visitors);

    this.visitTypeForm.get('name')?.reset();
    this.visitTypeForm.get('surname')?.reset();

    this.ref.detectChanges();
  }

  removeVisitor(item: any) { // Ziyaretçi Kaldırma Fonksiyonu
    const index = this.visitors.indexOf(item);
    if (index !== -1) {
      this.visitors.splice(index, 1);
      this.ref.detectChanges();
    }
  }

  isFirstVisitor(index: number): boolean { // Ziyaretçilerden İlk Ekleneni (Ekip Lideri) Döndürüyor.
    return index === 0;
  }
  
  selectVisitor(visitor: any) { // Yeni bir nesne oluşturarak her ziyaretçinin kendi seçili ziyaretçisi oluşturulur
    this.selectedVisitor = visitor;
    // this.selectedVisitor = { ...visitor }; // Kopya oluşturulur
    this.displayUploadFiles = true;
  }
  
  getFile(event: any, fileType: any) { // Dosya yükleme işlemi her zaman seçili ziyaretçiye eklenir
    if (this.selectedVisitor) {
      const visitorIndex = this.visitors.findIndex(
        (v : any) => v.Id === this.selectedVisitor.Id
      );

      const fileTypeIndex = this.selectedVisitor.fileTypes.findIndex(
        (ft :any) => ft.id === fileType.id
      );
  
      if (fileTypeIndex !== -1) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          this.readAndPushFile(files[i], visitorIndex, fileTypeIndex);
        }
      }
    }
  }

  readAndPushFile(file: File, visitorIndex: any, fileTypeIndex : any) { // Yüklenen Dosyalar İçin Detay Bilgiler
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
  
      if (this.selectedVisitor) {

        this.visitors = this.visitors.map((visitor, index) => {
          if (index === visitorIndex) {
            return {
              ...visitor,
              fileTypes: visitor.fileTypes.map((fileType: any, fileTypeIndexx: any) => {
                if (fileTypeIndexx === fileTypeIndex) {
                  return {
                    ...fileType,
                    files: {
                      fileName: file.name,
                      type: file.type,
                      size: file.size,
                      fileSize: fileSize + ' ' + fileSizeType,
                      url: url,
                    },
                    sendFile : file
                  };
                }
                return fileType;
              }),
            };
          }
          return visitor;
        });


        this.selectedVisitor.fileTypes = this.selectedVisitor.fileTypes.map((fileType : any, fileTypeIndexx : any) => {
          if (fileTypeIndexx === fileTypeIndex) {
            return {
              ...fileType,
              files: {
                fileName: file.name,
                type: file.type,
                size: file.size,
                fileSize: fileSize + ' ' + fileSizeType,
                url: url,
              },
              sendFile : file
            };
          }
          return fileType;
        });
        
        // this.visitors[visitorIndex].fileTypes[fileTypeIndex].files = {
        //   fileName: file.name,
        //   type: file.type,
        //   size: file.size,
        //   fileSize: fileSize + ' ' + fileSizeType,
        //   url: url,
        // };

      }
      console.log("Dosya yüklendi :", this.visitors);
      
  
      this.ref.detectChanges();
    };
  }

  isThereCompany() { // Ziyaretçi Firmalar Arasında Var mı Yok mu Kontrolü
    this.visitTypeForm.get('company')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value : any) => {
      if (value?.ID == '0') {
        this.visitTypeForm.addControl('otherCompany', this.formBuilder.control('', Validators.required));
        this.isOtherCompany = true; // ng-container da durum kontrolü için eklendi
      } else {
        this.isOtherCompany = false; // ng-container da durum kontrolü için eklendi
      }
    });
  }

  removeUploadedFile(item: any, file: any) { // Karşıya Yükelenen Dosyayı Kaldırma Fonksiyonu
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  closedFormDialog() { // Dialog Penceresi Kapatıldığında İlgili Alanları Sıfırlamak İçin
    // this.closedForm.subscribe(_ => {
      // console.log("Closed Form : ", _);
      this.visitTypeForm.reset();
      this.visitors = [];
      this.uploadedFiles = [];
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.visitRequestFormIsSend.emit();
    // });
  }
  
  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getFormValues() {
    let visitorFormValues = Object.assign({}, this.visitTypeForm.value);
    
    visitorFormValues.entryDateTime = visitorFormValues.entryDate + ' ' + visitorFormValues.entryTime;
    visitorFormValues.exitDateTime = visitorFormValues.exitDate + ' ' + visitorFormValues.exitTime;
    visitorFormValues.otherCompany = visitorFormValues.company.Ad ? visitorFormValues.company.Ad.toString() : visitorFormValues.company;

    if (this.visitors.length != 0) {
      this.visitors.forEach((visitor : any) => {  
        visitor.nameSurname = visitor.name + '|' + visitor.surname;
        
        visitorFormValues.visitorsNameSurname = visitorFormValues.visitorsNameSurname ? 
        visitorFormValues.visitorsNameSurname + ',' + visitor.nameSurname : 
        '' + visitor.nameSurname;           
      });
    } else {
      visitorFormValues.visitorsNameSurname = visitorFormValues.name + '|' + visitorFormValues.surname;  
    }

    visitorFormValues.visitors = this.visitors;  
    
    return visitorFormValues
  }

  postVisitorForm(formValues : any) {
    console.log("Form Values : ", formValues);
    this.profileService.postVisitForm(formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      const data = response[0].x;
      console.log("Ziyaret Formu Gönderildi : ", data);
      this.visitors = data;
      

      // this.fileTypes.forEach((fileType : any) => {
      //   fileType.files = ' ';
      // });

      this.visitors.forEach((visitor : any) => {
        visitor.fileTypes = this.fileTypes;
      });
      

      console.log("Visitors Son Hali :", this.visitors);

      this.ref.detectChanges()
    });
  }
  
  getFileTypeForDemandType(typeId : any, kaynak : any) { // API'ye, Seçilen Ziyaret Tipine Ait Zorunlu Belgeleri Alması İçin İstek Atılıyor 
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

  typeChanges() { // Form Alanlarından "tip" Değiştikçe, API'ye, O Tipe Ait Zorunlu Belgeleri Çekmesi İçin "getFileTypeForDemandType" Fonksiyonuna İlgili Parametreler Gönderiliyor 
    this.visitTypeForm.controls['type'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      item ? this.getFileTypeForDemandType(item, 'ziyaretci') : '';
    });
  }

  postUploadedFilesForVisitors() {
    let count: number = 0;

    this.visitors.forEach((visitor : any) => {
      visitor.fileTypes.forEach((fileType : any) => {
        if (fileType.sendFile) {
          this.postVisitorFile(fileType.sendFile, visitor.Id, 'ziyaretci', fileType.BelgeId);
        } else {
          count++;   
        }
      });

      if (count == visitor.fileTypes.length) {
        this.toastrService.warning("Yüklenecek Dosya Yok!", "UYARI");      
      }
    });
    
  }

  postVisitorFile(file : any, formId : any, kaynak : any, fileType : any) { // API'ye, Oluşturulan Ziayaretçi Talebi İçin Yüklenen Dosyaları İleten Kısım 
    this.profileService.postFileForDemand(file, formId, kaynak, fileType)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      
      this.toastrService.success("Dosyalar Gönderildi", "BAŞARALI");

      console.log("İzin için dosya gönderildi : ", response);
      this.closedFormDialog();

      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.closedFormDialog();

    // this.visitTypeForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}