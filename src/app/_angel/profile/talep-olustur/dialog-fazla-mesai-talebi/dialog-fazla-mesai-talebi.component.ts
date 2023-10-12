import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { OKodFieldsModel } from '../../models/oKodFields';
import { HelperService } from 'src/app/_helpers/helper.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostFormModel } from '../../models/postForm';
import { LayoutService } from 'src/app/_metronic/layout';

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

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_1'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_1') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_3'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_3') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_4'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_4') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_6'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_6') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_5'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_5') },
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
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  @Output() overtimeFormIsSend: EventEmitter<void> = new EventEmitter<void>();

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

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private profileService: ProfileService,
    private toastrService : ToastrService,
    public authService : AuthService,
    private translateService : TranslateService,
    private sanitizer: DomSanitizer,
    private helperService : HelperService,
    public layoutService : LayoutService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getOvertimeReason('cbo_fmnedenleri');
    this.getOvertimeReason('cbo_ulasim');
    this.getOvertimeReason('cbo_yemek');

    this.currentSicilId = this.helperService.userLoginModel.xSicilID

    this.setResponsiveForm();
    this.createFormGroup();
    this.typeChanges();

    // this.closedFormDialog();

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
      this.postOvertimeForm(this.overtimeFormValues);
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
      aciklama: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      tip: ['', Validators.required],
      ulasim: ['', Validators.required],
      yemek: ['', Validators.required],
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
          this.translateService.instant('TOASTR_MESSAGE.DOSYA_BOYUTU_YUKSEK'),
          this.translateService.instant('TOASTR_MESSAGE.HATA')
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
    this.closedForm.subscribe(_ => {
      console.log("Closed Form : ", _);
      this.overtimeForm.reset();
      this.selectedType = '';
      this.selectedOvertime = '';
      this.selectedUlasim = '';
      this.selectedYemek = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      this.overtimeFormIsSend.emit();
    });
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
    this.profileService.getOKodField(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
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
    this.profileService.postOvertimeOrVacationDemand('fm', formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<PostFormModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const apiMessage = response[0].z;
      const spMessage = response[0].m[0];

      console.log("Fm Form gönderildi :", response);
      if (data[0].sonuc == 1) {
        this.formId = data[0].formid;


        this.toastrService.success(
          this.translateService.instant('TOASTR_MESSAGE.TALEP_GONDERILDI'),
          this.translateService.instant('TOASTR_MESSAGE.BASARILI')
        );
      } else {
        this.toastrService.error(
          this.translateService.instant(spMessage.usermessage),
          this.translateService.instant('TOASTR_MESSAGE.HATA')
        );
      }
    });
    this.ref.detectChanges();
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

    this.fileTypes.forEach((item : any) => {
      if (item.sendFile) {
        this.postOvertimeFile(item.sendFile, this.formId, 'fm', item.BelgeId);
      }
    });

    this.toastrService.success(
      this.translateService.instant('TOASTR_MESSAGE.TALEP_GONDERILDI'),
      this.translateService.instant('TOASTR_MESSAGE.BASARILI')
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


  ngOnDestroy(): void {
    this.closedFormDialog();

    // this.overtimeForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
