import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserType } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { UserInformation } from '../../models/user-information';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { OKodFieldsModel } from '../../models/oKodFields';
import { HelperService } from 'src/app/_helpers/helper.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AttendanceService } from 'src/app/_angel/puantaj/attendance.service';

@Component({
  selector: 'app-dialog-izin-talebi',
  templateUrl: './dialog-izin-talebi.component.html',
  styleUrls: ['./dialog-izin-talebi.component.scss'],
  animations: [
    trigger("fileUploaded", [
      state("uploaded", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: 'translateY(-50%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(200, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class DialogIzinTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() displayVacationForm: boolean;
  @Output() onHideVacationForm: EventEmitter<void> = new EventEmitter<void>();

  @Input() isFromAttendance: boolean;
  selectedEmployeesFromAttendance: any[] = [];
  vacationRightsLoading: boolean = true;
  @Output() isCompletedFromAttendance: EventEmitter<void> = new EventEmitter<void>();
  @Input() isFromRegistryList: boolean;

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Tür'), desc: this.translateService.instant('Günlük_Saatlik') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Tip'), desc: '' },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('İzinli_Süreler') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('Kişisel_Bilgiler'), desc: '' },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
    { id : '0', class: 'stepper-item', number: 6, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
  ];

  formsCount: any = 7;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  vacationFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  vacationForm: FormGroup;
  visitType: any;
  personInformationForm: FormGroup;
  personInformation: any;
  uploadedFiles: any[] = [];
  uploadedFile: any;



  currentDate = new Date(Date.now());
  formDisabled: boolean = true;
  isHourly: boolean = false;
  calcTimeDesc: any;
  calcTimeValue: any;
  currentSicilId: any;
  izinKalan: number = 0;
  userInformation: UserInformation;
  vacationReasons : any[] = [];
  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');
  formId: any;
  files: any;

  fileTypes : any[] = [];
  displayUploadedFile : boolean;
  currentUploadedFile: any;
  currentUserValue: UserType;
  isCompleted: boolean = false;
  vacationRightState: boolean;
  matchedRegistry: string;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private profileService: ProfileService,
    private toastrService : ToastrService,
    public authService : AuthService,
    public translateService : TranslateService,
    private sanitizer: DomSanitizer,
    private helperService : HelperService,
    private ref: ChangeDetectorRef,
    private modeService: ThemeModeService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.currentUserValue = this.authService.currentUserValue;
    console.log("currentUserValue izin talep :", this.currentUserValue);
    
    if (this.isFromAttendance) {
      this.getSelectedRows();
      this.formsCount = 6;
    }

    if (this.isFromRegistryList) {
      this.getRowsFromRegistry();
    }

    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      document.body.style.backgroundImage =
        mode === 'dark'
          ? 'url(./assets/media/auth/bg10-dark.jpeg)'
          : 'url(./assets/media/auth/bg10.jpeg)';
    });

    this.currentSicilId = this.helperService.userLoginModel.xSicilID

    this.setResponsiveForm();
    this.createFormGroup();
    this.getVacationReason();
    this.valueChanges();
    this.dateChanges();
    this.typeChanges();
  }

  getSelectedRows() {
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      this.selectedEmployeesFromAttendance = items;
      console.log('Puantaj Seçilen Personel :', this.selectedEmployeesFromAttendance);
    });
  }

  canProceedToNextStep(): boolean { // Sonraki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
    let vacationFormValues = Object.assign({}, this.vacationForm.value);

    this.vacationFormValues = vacationFormValues;
    console.log("Form Values : ", this.vacationFormValues);
    
    if (this.currentStep$.value === 1) {
      return this.vacationForm.controls['gunluksaatlik'].valid;

    } else if(this.currentStep$.value === 2) {
      return this.vacationForm.controls['tip'].valid;
      
    } else if(this.currentStep$.value === 4) {
      return this.vacationForm.valid;

    } else if(this.currentStep$.value === 5) {
      if (this.isFromRegistryList) {
        this.postFormForRegistryList(vacationFormValues);
      } else {
        this.postVacationForm(vacationFormValues);
      }
      return true;
    } else if(this.currentStep$.value === 6) {
      if (this.fileTypes.length == 0) {
        this.closedFormDialog();
      }
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean { // Önceki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
    if (this.currentStep$.value === 1) {
      return this.vacationForm.controls['gunluksaatlik'].valid;
    } 
    else if(this.currentStep$.value === 2) {
      return this.vacationForm.controls['tip'].valid;
    }
    return true;
  }

  nextStep() { // Sıradaki Adımda Çalışan Fonksiyon
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
  
  prevStep() { // Önceki Adımda Çalışan Fonksiyon
    if (this.currentStep$.value === 2) {
      this.vacationForm.reset();
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
  
  createFormGroup() { // Reactive Form Oluşturaln Kısım
    this.vacationForm = this.formBuilder.group({
      tip : ['', [Validators.required]],
      bastarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bassaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      bittarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bitsaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      aciklama : ['', [Validators.required]],
      izinadresi : ['', [Validators.required]],
      gunluksaatlik : [null, Validators.required],
      file : [null]
    });
  }

  setResponsiveForm() { // Stepper'ı Yataydan Dikeye Çevir
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getFile(event: any, item: any) { // Dosya Yüklendiğinde İlk Çalışan Fonksiyon 
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
  
  checkFileSize(file: File, maxSizeInBytes: number): boolean { // Dosya Boyutunu Kontrol Eden Fonksiyon
    const fileSizeInBytes = file.size;
    const maxSize = maxSizeInBytes;
    return fileSizeInBytes <= maxSize;
  }

  readAndPushFile(file: File, item: any) { // Yüklenen Dosyalar İçin Detay Bilgiler
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
      // this.uploadedFile = {
      //   name : file.name,
      //   type : file.type,
      //   url : url,
      //   fileSize : fileSize,
      //   fileSizeType : fileSizeType
      // };

      console.log("Uploaded File : ", this.uploadedFile);
      console.log("Uploaded Fileee : ", item);
      this.ref.detectChanges();
    };    
  }

  removeUploadedFile(item: any, file: any) { // Yüklenmiş Dosyanın Kaldırlması İçin 
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  closedFormDialog() { // Dialog Penceresi Kapatıldığında İlgili Yerleri Sıfırlamak İçin
    // this.closedForm.subscribe(_ => {
      // console.log("Closed Form : ", _);
      this.vacationForm?.reset();
      this.selectedType = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.selectedEmployeesFromAttendance = [];
      this.onHideVacationForm.emit();
    // });
  }
  
  resetStepperFieldsClass() { // "Stepper" Yapısını Sıfırlamak İçin
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getFormValues() { // Form Verilerinin Alınıp, Yüklenmiş Dosyaların API'ye Gönderilmesi
    let vacationFormValues = Object.assign({}, this.vacationForm.value);
    console.log("Form Values : ", vacationFormValues);

    if (this.isFromAttendance) {
      this.postVacationForm(vacationFormValues);
      this.toastrService.success(
        this.translateService.instant('Talep_Gönderildi'),
        this.translateService.instant('Başarılı')
      );
      return;
    }

    this.fileTypes.forEach((item : any) => {
      if (item.sendFile) {
        this.postVacationFile(item.sendFile, this.formId, 'izin', item.BelgeId);
      }
    });

    this.toastrService.success(
      this.translateService.instant('Talep_Gönderildi'),
      this.translateService.instant('Başarılı')
    );
    // this.closedFormDialog();
  }

  valueChanges() { // Form Alanlarından "gunluksaatlik" Değerinin Günlük Mü Saatlik Mi Olduğunu Öğrenmek İçin
    this.vacationForm.get("gunluksaatlik")?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      console.log("item : ", item);
      if (item == 'saatlik') {
        this.isHourly = true;
        this.vacationForm.get("bassaat")?.enable();
        this.vacationForm.get("bitsaat")?.enable();
        this.formDisabled = false;

      } else {

        this.isHourly = false;
        this.vacationForm.get("bassaat")?.disable();
        this.vacationForm.get("bitsaat")?.disable();
        this.formDisabled = true;
      }
    });
  }
  

  dateChanges() {// İzin Süresinin Ekranda Gösterilmesi İçin Uygunluk Kontrolü
    const bastarihChanges$ = this.vacationForm.get('bastarih')?.valueChanges.pipe(startWith(this.vacationForm.get('bastarih')?.value));
    const bittarihChanges$ = this.vacationForm.get('bittarih')?.valueChanges.pipe(startWith(this.vacationForm.get('bittarih')?.value));
    const bassaatChanges$ = this.vacationForm.get('bassaat')?.valueChanges.pipe(startWith(this.vacationForm.get('bassaat')?.value));
    const bitsaatChanges$ = this.vacationForm.get('bitsaat')?.valueChanges.pipe(startWith(this.vacationForm.get('bitsaat')?.value));
  
    combineLatest([bastarihChanges$, bittarihChanges$, bassaatChanges$, bitsaatChanges$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([bastarih, bittarih, bassaat, bitsaat]:any) => {
        let formValue = Object.assign({}, this.vacationForm.value);
        formValue.siciller = this.currentSicilId;
  
        if (!formValue.tip) {
          this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!';
        } else if (formValue.gunluksaatlik == 'saatlik' && (!formValue.bassaat || !formValue.bitsaat)) {
          this.calcTimeDesc = 'Saat Bilgisi Girimelisiniz!';
        } else {
          this.calcTimeDesc = '';
          if (!this.isFromAttendance) {
            this.calculateVacationTime(formValue);
          }
        }
      });
  }


  calculateVacationTime(form: any) { // İzin Süresinin Hesaplanması İçin API'ye İstek Atılan Fonrksiyon
    this.profileService.calculateVacationTime(form).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;

      if (apiMessage.islemsonuc == -1) {
        return; 
      }
      
      if (apiMessage.islemsonuc == 1) {
        this.calcTimeValue = data[0].izinhesapsure;

      } else if (apiMessage.islemsonuc == -11) {
        this.calcTimeDesc = data[0].izinhesapsure;
      }
      console.log("İzin Süresi Hesaplama :", response);

    });
  }

  getUserInformation() { // API'ye Kullanıcı Bilgileri İçin Atılan İstek
    this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<UserInformation, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;

      console.log("Sicil Bilgiler :", data);

      if (message.islemsonuc == -1) {
        return;
      }

      this.izinKalan = data[0]?.Kalan;
      this.userInformation = data[0];
      console.log("USER :", this.izinKalan);

    })
  }

  getVacationRight() {
    var sp: any[] = [];
    
    if (this.isFromAttendance) {
      if (this.selectedEmployeesFromAttendance.length > 0) {
        this.selectedEmployeesFromAttendance.forEach(item => {
          sp.push({
            mkodu: 'yek107',
            sicilid: item.sicilid.toString(),
            izintip: '3'
          });
        });
        
      } else {
        return;
      }
        
    } else {
      sp.push({
        mkodu: 'yek107',
        sicilid: this.currentUserValue?.xSicilID.toString(),
        izintip: '3'
      })
    }

    this.profileService.requestMethodPost(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      let data: any[] = [];

      response.forEach((res: any) => {
        data.push(res.x[0]);
      });
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log('Vacation Right: ', data);
      if (this.isFromAttendance) {
        data.forEach((item: any) => {
          if (!item) {
            return;
          }
          this.selectedEmployeesFromAttendance.forEach(employe => {
            if (employe.sicilid == item.SicilID) {
              Object.keys(item).forEach(key => {
                employe[key] = item[key];
              });
              employe.error = false;
            }
            return;
          });
          
        });

        console.log("İzin Hakları : ", this.selectedEmployeesFromAttendance);
        this.vacationRightsLoading = false;
      } else {
        this.izinKalan = data[0].Kalan;
      }
      // this.vacationRight = data[0];

      this.ref.detectChanges();
    });
  }

  getVacationReason() { // İzin Tiplerini Almak İçin API'ye İstek 
    this.profileService.getTypeValues('cbo_izintipleri').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.vacationReasons = [...data];
      console.log("İzin Tipleri : ", data);

    });
  }

  postVacationForm(vacationFormValues : any) { // API'ye İzin Talebini Göndermek İçin Fonksiyon
    let employees: any[] = [];
    if (this.isFromAttendance) {
      employees = this.selectedEmployeesFromAttendance.map(employee => employee.sicilid.toString());
      console.log("Toplu Talep :", employees);
      
    } else {
      employees.push(this.currentUserValue?.xSicilID.toString());  
    }
    this.profileService.postRequestForm('izin', vacationFormValues, employees).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      if (!this.isFromAttendance) {
        const data = response[0].x;
        const apiMessage = response[0].z;
        const spMessage = response[0].m[0];

        if (apiMessage.islemsonuc == -1) {
          this.toastrService.error(
            this.translateService.instant('Talep_Gönderilemedi_Daha_Sonra_Tekrar_Deneyiniz'),
            this.translateService.instant('Hata')
          );
          this.prevStep();
          return;
        }

        console.log('İzin Form gönderildi :', response);
        if (data[0].sonuc == 1) {
          // this.vacationFormIsSend.emit();
          // this.vacationForm.reset();
          this.formId = data[0].formid;

          this.toastrService.success(
            this.translateService.instant('Talep_Gönderildi'),
            this.translateService.instant('Başarılı')
          );
        } else {
          this.toastrService.error(
            data[0]?.izinhesapsure,
            this.translateService.instant('Hata')
          );
          this.prevStep();
        }
      } else {
        let data: any[] = [];

        response.forEach((res: any) => {
          data.push(res.x[0]);
        });

        let successDemandCount: number = 0;
        let errorDemandCount: number = 0;
        
        data.forEach((item: any) => {
          if (!item) {
            return;
          }

          item.sonuc == 1 ? successDemandCount++ : errorDemandCount++;
          
          this.selectedEmployeesFromAttendance.forEach(employe => {
            if (employe.sicilid == item.siciller) {
              Object.keys(item).forEach(key => {
                employe[key] = item[key];
              });
              employe.error = false;
            }
            return;
          });
          
        });

        if (successDemandCount > 0) {
          this.toastrService.success(
            this.translateService.instant(successDemandCount + 'Adet_Talep_Başarılı_Bir_Şekilde_Oluşturuldu'),
            this.translateService.instant('Başarılı')
          );  

          this.isCompletedFromAttendance.emit();

        }
        
        if (errorDemandCount > 0) {
          this.toastrService.error(
            this.translateService.instant(errorDemandCount + 'Adet_Talep_Oluşturulurken_Hata_Oluştu'),
            this.translateService.instant('Hatalı')
          );  
        }
        

        console.log("isCompleted : ", this.selectedEmployeesFromAttendance);
        this.isCompleted = true;
      }

      this.ref.detectChanges();
    })
  }

  postVacationFile(file : any, formId : any, kaynak : any, fileType : any) { // API'ye, Oluşturulan İzin Talebi İçin Yüklenen Dosyaları İleten Kısım 
    this.profileService.postFileForDemand(file, formId, kaynak, fileType)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      
      console.log("İzin için dosya gönderildi : ", response);

      this.closedFormDialog();

      this.ref.detectChanges();
    });
  }
  
  getFileTypeForDemandType(typeId : any, kaynak : any) { // API'ye, Seçilen İzin Tipine Ait Zorunlu Belgeleri Alması İçin İstek Atılıyor 
    this.fileTypes = [];
    this.profileService
    .getFileTypeForDemandType(typeId, kaynak)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.toastrService.error(
          this.translateService.instant('Zorunlu_Yüklenmesi_Gereken_Belge_Bulunamadı!'),
          this.translateService.instant('Hata')
        );
        return;
      }

      console.log("Tipi geldi", data);
      this.fileTypes = [...data];
    });
  }

  typeChanges() { // Form Alanlarından "tip" Değiştikçe, API'ye, O Tipe Ait Zorunlu Belgeleri Çekmesi İçin "getFileTypeForDemandType" Fonksiyonuna İlgili Parametreler Gönderiliyor 
    this.vacationRightState = false;
    this.vacationForm.controls['tip'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      item ? this.getFileTypeForDemandType(item.ID, 'izin') : '';

      if (item?.ID == 3 && !this.vacationRightState) {
        this.getVacationRight();

        this.vacationRightState = true;
      }
    });
  }

  showUploadedFile(item : any) { // Yüklenmiş Dosyanın Önizlenmesi İçin Dialog Penceresinin Açılması İçin
    this.displayUploadedFile = true;
    this.currentUploadedFile = item;
  }

  getRowsFromRegistry() {
    this.attendanceService.getSelectedItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      console.log('Sicil Listesinden Seçilen Personel :', items);

      if (items.length == 0) {
        this.toastrService.warning(
          this.translateService.instant("Sicil_Veya_Siciller_Seçiniz"),
          this.translateService.instant("Uyarı")
        );
        this.closedFormDialog()
        return;
      }

      this.matchedRegistry = this.matchRegistry(items, "#"); 
    });
  }

  matchRegistry(items: { Id: number }[], separator: string): string {
    return items.map(item => item.Id).join(separator);
  }

  postFormForRegistryList(form:any) {
    var sp: any[] = [{
      mkodu: 'yek049',
      kaynak: 'izin',
      siciller: this.matchedRegistry,
      tip: form.tip.ID.toString(),
      bastarih: form?.bassaat ? `${form.bastarih} ${form.bassaat}` : form.bastarih,
      bittarih: form?.bitsaat ? `${form.bittarih} ${form.bitsaat}` : form.bittarih,
      izinadresi: form.izinadresi,
      ulasim: form.ulasim?.ID ? form.ulasim.ID.toString() : '',
      yemek: form.yemek?.ID ? form.yemek.ID.toString() : '',
      aciklama: form.aciklama
    }];

    console.log("Sicil Listesinden izin formu params :", sp);
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.toastrService.error(
          this.translateService.instant("İzin_Talep_Formu_Gönderilirken_Hata_Oluştu"),
          this.translateService.instant("Hata")
        );
        this.nextStep();
        return;
      }

      console.log("İzin Talep Formu Gönderildi : ", data);
      this.toastrService.success(
        this.translateService.instant("İzin_Talep_Formu_Gönderildi"),
        this.translateService.instant("Başarılı")
      );
      this.nextStep();
    });
  }
  
  ngOnDestroy(): void {
    this.closedFormDialog();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    document.body.style.backgroundImage = 'none';
  }
}