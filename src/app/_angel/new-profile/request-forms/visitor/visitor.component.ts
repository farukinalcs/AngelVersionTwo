import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { OKodFieldsModel } from 'src/app/_angel/profile/models/oKodFields';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { AuthService } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-visitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    Dialog,
    SelectModule,
    InlineSVGModule,
    DatePickerModule
  ],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.scss'
})
export class VisitorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() display: boolean;
  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Tip'), desc: this.translateService.instant('Ziyaret_Tipi') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Kişi'), desc: this.translateService.instant('Ziyaretçi_Bilgileri') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Ziyaretçiler'), desc: '' },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('İletişim'), desc: this.translateService.instant('Diğer_Bilgiler') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('Giriş_Çıkış'), desc: this.translateService.instant('Zaman_Bilgileri') },
    { class: 'stepper-item', number: 6, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
    { id : '0', class: 'stepper-item', number: 7, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
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
    public translateService : TranslateService,
    private ref: ChangeDetectorRef,
    public auth : AuthService,
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
      description: ['', [Validators.required, Validators.maxLength(500)]],
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
      console.log(value + " " +  this.currentStep$.value);
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
      this.toastrService.error("İsim-Soyisim Alanı Boş Bırakılamaz", "Hata");
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
      this.onHide.emit();
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
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.toastrService.error("Form Gönderilemedi!", "HATA");
        this.prevStep();
        return;
      }
      
      console.log("Ziyaret Formu Gönderildi : ", data);
      this.visitors = data;
      

      // this.fileTypes.forEach((fileType : any) => {
      //   fileType.files = ' ';
      // });

      this.visitors.forEach((visitor : any) => {
        visitor.fileTypes = this.fileTypes;
      });
      
      
      console.log("Visitors Son Hali :", this.visitors);

      this.toastrService.success('Ziyaretçi Formu Gönderildi. Ziyaretçilere Ait Dosyaları Bir Sonraki Adımda Veya Daha Sonra Yükleyebilirsiniz', 'Başarılı', {
        timeOut: 5000
      });

      if (this.fileTypes.length == 0) {
        this.closedFormDialog();
      }

      this.ref.detectChanges()
    }, (error: any) => {
      
      this.toastrService.error('Ziyaretçi Formu Gönderilemedi', 'HATA', {
        timeOut: 5000
      });

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
    let hasSendFile = false;
  
    this.visitors.forEach((visitor: any) => {
      visitor.fileTypes.forEach((fileType: any) => {
        if (fileType.sendFile) {
          hasSendFile = true;
          this.postVisitorFile(fileType.sendFile, visitor.Id, 'BeklenenZiyaretci', fileType.BelgeId);
        }
      });
  
      if (!hasSendFile) {
        this.toastrService.warning("Yüklenecek Dosya Yok!", "Uyarı");
      }
  
      hasSendFile = false;
    });
  }
  

  postVisitorFile(file : any, formId : any, kaynak : any, fileType : any) { // API'ye, Oluşturulan Ziayaretçi Talebi İçin Yüklenen Dosyaları İleten Kısım 
    this.profileService.postFileForDemand(file, formId, kaynak, fileType)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      
      this.toastrService.success("Dosyalar Gönderildi", "BAŞARALI");

      console.log("Ziyaretçi için dosya gönderildi : ", response);
      this.closedFormDialog();

      this.ref.detectChanges();
    });
  }

  getTooltopScript(item: any[]): string {
    if(!item) {
      return '';
    }
    
    const bosBelgeler = this.getBosBelgeler(item);
    const bosBelgeSayisi = bosBelgeler.length;
    const belgeAdlari = bosBelgeler.map((belge, index) => `${index + 1}) ${belge}`).join("\r\n");
    
    if (bosBelgeSayisi == 0) {
      return `Eksik Belge Yok`;
    } else {
      return `Yüklenmesi Gereken ${bosBelgeSayisi} Adet Dosya Eksik.\r\n${belgeAdlari}`;
    }
  }

  getBosBelgeler(item: any[]): string[] {
    return item.filter(belge => !belge.files).map(belge => belge.ad);
  }

  getVisitTypeNameById(value: any) {
    return this.visitTypes.filter(item => item.ID == value).map(item => item.ad);
  }

  ngOnDestroy(): void {

    // this.visitTypeForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}