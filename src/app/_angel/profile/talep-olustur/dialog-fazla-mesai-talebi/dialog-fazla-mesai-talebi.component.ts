import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserType } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { OKodFieldsModel } from '../../models/oKodFields';
import { HelperService } from 'src/app/_helpers/helper.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostFormModel } from '../../models/postForm';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';

@Component({
  selector: 'app-dialog-fazla-mesai-talebi',
  templateUrl: './dialog-fazla-mesai-talebi.component.html',
  styleUrls: ['./dialog-fazla-mesai-talebi.component.scss'],
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
export class DialogFazlaMesaiTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;
  @Output() overtimeFormIsSend: EventEmitter<void> = new EventEmitter<void>();
  @Output() onHideOvertimeForm: EventEmitter<void> = new EventEmitter<void>();

  @Input() displayOvertimeForm:boolean;
  @Input() isFromAttendance: boolean;
  selectedEmployeesFromAttendance: any[] = [];
  @Output() isCompletedFromAttendance: EventEmitter<void> = new EventEmitter<void>();
  @Input() isFromRegistryList:boolean;
  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Neden_Açıklama'), desc: this.translateService.instant('Fazla_Mesai_Nedeni') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Diğer_Bilgiler'), desc: this.translateService.instant('Ulaşım_Yemek') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('Zaman_Bilgileri'), desc: this.translateService.instant('Fazla_Mesai_Tarihi') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
    { id : '0', class: 'stepper-item', number: 5, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
  ];

  formsCount: any = 6;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  overtimeFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  overtimeForm: FormGroup;
  uploadedFiles: any[] = [];
  uploadedFile: any;

  currentDate = new Date(Date.now());
  currentSicilId: any;
  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');

  fmNedenleri: any[] = [];
  yemek: any[] = [];
  ulasim: any[] = [];
  selectedOvertime: any;
  selectedUlasim: any;
  selectedYemek: any;
  formId: any;
  files: any;
  fileTypes: any[] = [];
  displayUploadedFile: boolean;
  currentUploadedFile: any;

  currentUserValue: UserType;
  isCompleted: boolean = false;
  matchedRegistry: string;

  @ViewChild('btnComplate') btnComplate!: HTMLButtonElement;
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
    private attendanceService: AttendanceService,
  ) { }

  ngOnInit(): void {
    this.currentUserValue = this.authService.currentUserValue;
    console.log("currentUserValue fm talep :", this.currentUserValue);

    if (this.isFromAttendance) {
      this.getSelectedRows();
      this.formsCount = 5;
    }

    if (this.isFromRegistryList) {
      this.getRowsFromRegistyList();
    }

    this.getOvertimeReason('cbo_fmnedenleri');
    this.getOvertimeReason('cbo_ulasim');
    this.getOvertimeReason('cbo_yemek');

    this.currentSicilId = this.helperService.userLoginModel.xSicilID

    this.setResponsiveForm();
    this.createFormGroup();
    this.typeChanges();
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

  getSelectedRows() {
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      this.selectedEmployeesFromAttendance = items;
      console.log('Puantaj Seçilen Personel :', this.selectedEmployeesFromAttendance);
    });
  }

  canProceedToNextStep(): boolean {
    this.overtimeFormValues = Object.assign({}, this.overtimeForm.value);

    for (let key in this.overtimeFormValues) {
      if (this.overtimeFormValues.hasOwnProperty(key) && this.overtimeFormValues[key] === '') {
        if (key === 'tip' || key === 'ulasim' || key === 'yemek') {
          this.overtimeFormValues[key] = '0';
        } else if (key === 'aciklama' || key === 'bastarih' || key === 'bassaat' || key === 'bittarih' || key === 'bitsaat') {
          this.overtimeFormValues[key] = '';
        }
      }
    }

    this.overtimeFormValues.izinadresi = '';
    console.log("Fazla Mesai Form :", this.overtimeFormValues);

    if(this.currentStep$.value === 3) {
      return this.overtimeForm.valid;

    } else if(this.currentStep$.value === 4) {
      if (this.isFromRegistryList) {
        this.postFormForRegistryList(this.overtimeFormValues)
      } else {
        this.postOvertimeForm(this.overtimeFormValues);
      }
      
      return true;
    } else if(this.currentStep$.value === 5) {
      if (this.fileTypes.length == 0) {
        this.closedFormDialog();
      }
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean {
    // if (this.currentStep$.value === 1) {
    //   return this.overtimeForm.controls['gunluksaatlik'].valid;
    // } 
    // else if(this.currentStep$.value === 2) {
    //   return this.overtimeForm.controls['tip'].valid;
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
    //   this.overtimeForm.reset();
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
    this.overtimeForm = this.formBuilder.group({
      aciklama: ['', Validators.required],
      tip: ['', Validators.required],
      ulasim: ['', Validators.required],
      yemek: ['', Validators.required],
      bastarih: ['', Validators.required],
      bassaat: ['', Validators.required],
      bittarih: ['', Validators.required],
      bitsaat: ['', Validators.required],
      file: [null] 
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  // getFile(event: any, item : any) {
  //   let files: FileList = event.target.files[0];
  //   console.log(files);
  //   this.files = files;
  //   item.sendFile = files;

  //   for (let file of event.target.files) {
  //     this.readAndPushFile(file, item);
  //   }
  // }

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
  

  // Dosya boyutunu kontrol eden yöntem
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
      this.overtimeForm?.reset();
      this.selectedType = '';
      this.selectedOvertime = '';
      this.selectedUlasim = '';
      this.selectedYemek = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.selectedEmployeesFromAttendance = [];
      this.onHideOvertimeForm.emit();
  }
  

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getOvertimeFormValues() {
    this.overtimeFormValues = Object.assign({}, this.overtimeForm.value);

    for (let key in this.overtimeFormValues) {
      if (this.overtimeFormValues.hasOwnProperty(key) && this.overtimeFormValues[key] === '') {
        if (key === 'tip' || key === 'ulasim' || key === 'yemek') {
          this.overtimeFormValues[key] = '0';
        } else if (key === 'aciklama' || key === 'bastarih' || key === 'bassaat' || key === 'bittarih' || key === 'bitsaat') {
          this.overtimeFormValues[key] = '';
        }
      }
    }

    this.overtimeFormValues.izinadresi = '';
    console.log("Fazla Mesai Form :", this.overtimeFormValues);

    // this.postOvertimeForm(this.overtimeFormValues);


    // this.postOvertimeFile(this.files, this.formId);

  }

  getOvertimeReason(kaynak: string) {
    this.profileService.getTypeValues(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        if (kaynak == 'cbo_fmnedenleri') {
          this.fmNedenleri = data;
        } else if (kaynak == 'cbo_ulasim') {
          this.ulasim = data;
        } else {
          this.yemek = data;
        }
        console.log("FM Nedenleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  postOvertimeForm(formValues : any) {
    let employees: any[] = [];
    if (this.isFromAttendance) {
      employees = this.selectedEmployeesFromAttendance.map(employee => employee.sicilid.toString());
      console.log("Toplu Talep fm :", employees);
      
    } else {
      employees.push(this.currentUserValue?.xSicilID.toString());  
    }

    this.profileService
      .postRequestForm('fm', formValues, employees)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<PostFormModel, ResponseDetailZ>[]) => {
          if (!this.isFromAttendance) {
            const data = response[0].x;
            const apiMessage = response[0].z;
            const spMessage = response[0].m[0];

            console.log('FM Form gönderildi :', response);
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
                'data[0]?.izinhesapsure',
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

              this.selectedEmployeesFromAttendance.forEach((employe) => {
                if (employe.sicilid == item.siciller) {
                  Object.keys(item).forEach((key) => {
                    employe[key] = item[key];
                  });
                  employe.error = false;
                }
                return;
              });
            });

            if (successDemandCount > 0) {
              this.toastrService.success(
                this.translateService.instant(
                  successDemandCount +
                    'Adet_Talep_Başarılı_Bir_Şekilde_Oluşturuldu'
                ),
                this.translateService.instant('Başarılı')
              );

              this.isCompletedFromAttendance.emit();
            }

            if (errorDemandCount > 0) {
              this.toastrService.error(
                this.translateService.instant(
                  errorDemandCount + 'Adet_Talep_Oluşturulurken_Hata_Oluştu'
                ),
                this.translateService.instant('Hatalı')
              );
            }

            console.log('isCompleted : ', this.selectedEmployeesFromAttendance);
            this.isCompleted = true;
          }
          this.btnComplate.disabled = true;
          this.ref.detectChanges();
        }
      );
  }
  

  typeChanges() {
    this.overtimeForm.controls['tip'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      item ? this.getFileTypeForDemandType(item.ID, 'fm') : '';
    });
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
    this.overtimeFormValues = Object.assign({}, this.overtimeForm.value);

    for (let key in this.overtimeFormValues) {
      if (this.overtimeFormValues.hasOwnProperty(key) && this.overtimeFormValues[key] === '') {
        if (key === 'tip' || key === 'ulasim' || key === 'yemek') {
          this.overtimeFormValues[key] = '0';
        } else if (key === 'aciklama' || key === 'bastarih' || key === 'bassaat' || key === 'bittarih' || key === 'bitsaat') {
          this.overtimeFormValues[key] = '';
        }
      }
    }

    this.overtimeFormValues.izinadresi = '';

    if (this.isFromAttendance) {
      this.postOvertimeForm(this.overtimeFormValues);
      return;
    }


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
      
      console.log("FM için dosya gönderildi : ", response);
      this.closedFormDialog();

      this.ref.detectChanges();
    });
  }

  getRowsFromRegistyList() {
    this.attendanceService.getSelectedItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      console.log("Sicil Listesinden Seçilenler Geldi: ", items);
      if (items.length == 0) {
        this.toastrService.warning(
          this.translateService.instant('Sicil_Veya_Sicilleri_Seçiniz'),
          this.translateService.instant('Uyarı')
        )
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
      kaynak: 'fm',
      siciller: this.matchedRegistry,
      tip: form.tip.ID.toString(),
      bastarih: form?.bassaat ? `${form.bastarih} ${form.bassaat}` : form.bastarih,
      bittarih: form?.bitsaat ? `${form.bittarih} ${form.bitsaat}` : form.bittarih,
      izinadresi: form.izinadresi,
      ulasim: form.ulasim?.ID ? form.ulasim.ID.toString() : '',
      yemek: form.yemek?.ID ? form.yemek.ID.toString() : '',
      aciklama: form.aciklama
    }];
    console.log("Sicil Listesinden mesai formu params :", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.toastrService.error(
          this.translateService.instant("Mesai_Talep_Formu_Gönderilirken_Hata_Oluştu"),
          this.translateService.instant("Hata")
        );
        this.nextStep();
        return;
      }

      console.log("Mesai Talep Formu Gönderildi : ", data);
      this.toastrService.success(
        this.translateService.instant("Mesai_Talep_Formu_Gönderildi"),
        this.translateService.instant("Başarılı")
      );
      this.nextStep();
    });
  }

  ngOnDestroy(): void {
    this.closedFormDialog();

    // this.overtimeForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
