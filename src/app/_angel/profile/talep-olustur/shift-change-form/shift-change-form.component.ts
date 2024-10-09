import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AttendanceService } from 'src/app/_angel/puantaj/attendance.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AuthService, UserType } from 'src/app/modules/auth';

@Component({
  selector: 'app-shift-change-form',
  templateUrl: './shift-change-form.component.html',
  styleUrls: ['./shift-change-form.component.scss'],
})
export class ShiftChangeFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Output() onHideShiftForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() isCompletedFromAttendance: EventEmitter<void> = new EventEmitter<void>();
  @Input() isFromAttendance: boolean;
  @Input() displayShiftForm: boolean;

  stepperFields: any[] = [
    {
      class: 'stepper-item current',
      number: 1,
      title: this.translateService.instant('Mesai_Birimi'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 2,
      title: this.translateService.instant('Neden'),
      desc: '',
    },
    // {
    //   class: 'stepper-item',
    //   number: 3,
    //   title: this.translateService.instant('Tutar'),
    //   desc: '',
    // },
    {
      class: 'stepper-item',
      number: 3,
      title: this.translateService.instant('Tamamlandı'),
      desc: this.translateService.instant('Özet_Bilgiler'),
    },
    // {
    //   id: '0',
    //   class: 'stepper-item',
    //   number: 4,
    //   title: this.translateService.instant('Dosya_Yükleme'),
    //   desc: this.translateService.instant('Gerekli_Belgeler'),
    // },
  ];

  formsCount: any = 4;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  shiftFormValues: any;

  // Stepper responsive
  stepperOrientation: Observable<StepperOrientation>;

  shiftForm: FormGroup;
  uploadedFiles: any[] = [];
  uploadedFile: any;

  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');

  formId: any;
  files: any;
  fileTypes: any[] = [];
  displayUploadedFile: boolean;
  currentUploadedFile: any;

  currentUserValue: UserType;
  selectedType: any;
  selectedEmployeesFromAttendance: any[] = [];
  shiftList: any[] = [];
  currentShift: string = this.translateService.instant('Tarih_Seçmelisiniz');
  isCompleted: boolean = false;
  

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private attendanceService: AttendanceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createFormGroup();

    this.currentUserValue = this.authService.currentUserValue;
    console.log("currentUserValue izin talep :", this.currentUserValue);
    
    if (this.isFromAttendance) {
      this.getSelectedRows();
      this.shiftForm.controls['endDate'].setValidators([Validators.required]);
    }else {
      this.changeStartDate();

    }
    
    this.getShiftList();

    this.setResponsiveForm();
  }

  getTooltipScript(): string {
    const personsLength = this.selectedEmployeesFromAttendance.length;
    const personsName = this.selectedEmployeesFromAttendance.map((person, index) => `${index + 1}) ${person.ad} ${person.soyad}`).join("\r\n");
    let firstPerson: string = '';
  
    const uniquePersons = this.selectedEmployeesFromAttendance.filter((person, index, self) =>
      index === self.findIndex((p) => p.sicilid === person.sicilid)
    );
  
    if (uniquePersons.length === 1) {
      firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad} Seçildi`;
    } else if (uniquePersons.length === 2) {
      firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad} ve ${uniquePersons[1].ad} ${uniquePersons[1].soyad} Seçildi`;
    } else {
      if (personsLength == 1) {
        firstPerson = `${this.selectedEmployeesFromAttendance[0].ad} ${this.selectedEmployeesFromAttendance[0].soyad} Seçildi`;
      } else if (personsLength == 2) {
        firstPerson = `${this.selectedEmployeesFromAttendance[0].ad} ${this.selectedEmployeesFromAttendance[0].soyad} ve ${this.selectedEmployeesFromAttendance[1].ad} ${this.selectedEmployeesFromAttendance[1].soyad} Seçildi`;
      } else if (personsLength > 2) {
        firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad}, ${uniquePersons[1].ad} ${uniquePersons[1].soyad} ve ${personsLength - 2} Kişi Daha Seçildi`;
      }
    }
  
    return firstPerson;
  }

  getShiftList() { // Mesai Birimlerini Almak İçin API'ye İstek 
    this.profileService.getTypeValues('mesailer').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.shiftList = data;
        console.log("Mesai Birimleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  getSelectedRows() {
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      this.selectedEmployeesFromAttendance = items;
      console.log('Puantaj Seçilen Personel :', this.selectedEmployeesFromAttendance);
    });
  }

  canProceedToNextStep(): boolean {
    this.shiftFormValues = Object.assign({}, this.shiftForm.value);
    
    console.log('Mesai Değişiklik Talep Form :', this.shiftFormValues);

    if (this.currentStep$.value === 2) {
      return this.shiftForm.valid;
    }
    //  else if (this.currentStep$.value === 3) {
    //   this.postForm(this.shiftFormValues);
    //   return true;
    // }

    return true;
  }

  canProceedToPrevStep(): boolean {
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
      this.currentItem.class = 'stepper-item current';
      if (nextStep > 1) {
        this.stepperFields[nextStep - 2].class = 'stepper-item completed';
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
    this.currentItem.class = 'stepper-item current';
    prevItem.class = 'stepper-item';
  }

  // Formların oluşması
  createFormGroup() {
    this.shiftForm = this.formBuilder.group({
      shift: ['', Validators.required],
      explanation: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ]),
      ],
      file: [null],
      startDate: ['', Validators.required],
      endDate: ['']
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
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(
        event.target?.result as string
      );
      item.files = {
        name: file.name,
        type: file.type,
        url: url,
        fileSize: fileSize,
        fileSizeType: fileSizeType,
      };

      console.log('Uploaded File : ', this.uploadedFile);
      console.log('Uploaded Fileee : ', item);
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
    console.log('Closed Form');
    this.shiftForm.reset();
    this.uploadedFile = '';
    this.selectedType = '';
    this.resetStepperFieldsClass();
    this.currentStep$.next(1);
    this.currentItem = this.stepperFields[0];
    this.selectedEmployeesFromAttendance = [];
    this.onHideShiftForm.emit();
  }

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? 'stepper-item current' : 'stepper-item';
    });
  }

  getShiftFormValues() {
    this.shiftFormValues = Object.assign({}, this.shiftForm.value);
    console.log('Mesai Talep Form :', this.shiftFormValues);
  }

  postForm(formValues: any) {
    let employees: any[] = [];
    if (this.isFromAttendance) {
      employees = this.selectedEmployeesFromAttendance.map(employee => employee.sicilid.toString());
      console.log("Toplu Talep :", employees);
      
    } else {
      employees.push(this.currentUserValue?.xSicilID.toString());  
    }
    this.profileService.postRequestForm('vardiya', formValues, employees).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      if (!this.isFromAttendance) {
        const data = response[0].x;
        const apiMessage = response[0].z;
        const spMessage = response[0].m[0];

        console.log('Mesai Form gönderildi :', response);
        if (data[0].sonuc == 1) {
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
    });  
    this.ref.detectChanges();
  }

  getFileTypeForDemandType(typeId: any, source: any) {
    this.fileTypes = [];
    this.profileService
      .getFileTypeForDemandType(typeId, source)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        console.log('Tipi geldi', data);
        this.fileTypes = data;

        this.ref.detectChanges();
      });
  }

  showUploadedFile(item: any) {
    this.displayUploadedFile = true;
    this.currentUploadedFile = item;
  }

  getFormValues() {
    this.shiftFormValues = Object.assign({}, this.shiftForm.value);
    console.log("Mesai Talebi Form Değerleri : ", this.shiftFormValues);
    
    if (true) {
      this.postForm(this.shiftFormValues);
      return;
    }

    this.fileTypes.forEach((item: any) => {
      if (item.sendFile) {
        this.postShiftFile(item.sendFile, this.formId, 'fm', item.BelgeId);
      }
    });

    this.toastrService.success(
      this.translateService.instant('Talep_Gönderildi'),
      this.translateService.instant('Başarılı')
    );
    // this.closedFormDialog();
  }

  postShiftFile(file: any, formId: any, source: any, fileType: any) {
    this.profileService
      .postFileForDemand(file, formId, source, fileType)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('Mesai talep için dosya gönderildi : ', response);
        this.closedFormDialog();

        this.ref.detectChanges();
      });
  }

  getCurrentShift(){
    var sp: any[] = [
      {
        mkodu: 'yek108',
        tarih: this.shiftForm.get('startDate')?.value,

      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const apiMessage = response[0].z;
        const spMessage = response[0].m[0];

        console.log('Mevcut Mesai birimi alındı :', response);
        if (apiMessage.islemsonuc != 1) {
          return;
        }

        this.currentShift = data[0].Aciklama;

        this.ref.detectChanges();
      });
  }

  changeStartDate() {
    this.shiftForm.get('startDate')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.getCurrentShift();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
