import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-dialog-bulten-formu',
  templateUrl: './dialog-bulten-formu.component.html',
  styleUrls: ['./dialog-bulten-formu.component.scss'],
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
export class DialogBultenFormuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('Bülten'), desc: this.translateService.instant('Bülten_İçeriği') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('Tarih_Ve_Yayıncı') },
    { id : '0', class: 'stepper-item', number: 3, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Bülten_PDF') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('Resim_Seçin'), desc: this.translateService.instant('Avatar') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
  ];

  formsCount: any = 6;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  bulletinFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;
  // Form geçerli ise geçiş olsun
  isLinear: boolean = true

  bulletinForm: FormGroup;
  uploadedFile: any;
  src: any;
  uploadedFiles: any[] = [];

  avatars : any[] = [
    {path : 'storyset-1/1.svg'},
    {path : 'storyset-1/2.svg'},
    {path : 'storyset-1/3.svg'},
    {path : 'storyset-1/4.svg'},
    {path : 'storyset-1/5.svg'},
    {path : 'storyset-1/6.svg'},
    {path : 'storyset-1/7.svg'},
    {path : 'storyset-1/8.svg'},
    {path : 'sigma-1/9.png'},
    {path : 'sigma-1/10.png'},
    {path : 'sigma-1/11.png'},
    {path : 'sigma-1/12.png'},
    {path : 'sigma-1/13.png'},
    {path : 'sigma-1/15.png'},
    {path : 'sigma-1/16.png'},
    {path : 'sigma-1/17.png'},
    {path : 'sigma-1/19.png'},
    {path : 'dozzy-1/1.png'},
    {path : 'dozzy-1/2.png'},
    {path : 'dozzy-1/3.png'},
    {path : 'dozzy-1/4.png'},
    {path : 'dozzy-1/5.png'},
    {path : 'dozzy-1/6.png'},
    {path : 'dozzy-1/7.png'},
    {path : 'dozzy-1/8.png'},
    {path : 'dozzy-1/9.png'},
    {path : 'dozzy-1/10.png'},
    {path : 'dozzy-1/11.png'},
    {path : 'dozzy-1/12.png'},
    {path : 'dozzy-1/13.png'},
    {path : 'dozzy-1/15.png'},
    {path : 'dozzy-1/16.png'},
    {path : 'dozzy-1/17.png'},
    {path : 'dozzy-1/19.png'},
    {path : 'dozzy-1/20.png'},
  ];

  pagedAvatars: any[] = [];
  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    public layoutService : LayoutService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setResponsiveForm();
    this.createFormGroup();
    this.closedFormDialog();
    this.updatePagedAvatars();
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep$.value === 4) {
      this.bulletinFormValues = Object.assign({}, this.bulletinForm.value);

      return this.bulletinForm.valid;
    } else if (this.currentStep$.value === 5) {
      this.bulletinFormValues = Object.assign({}, this.bulletinForm.value);
      
    }
    this.ref.detectChanges();
    
    return true;
    
  }


  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant("Form_Alanlarını_Doldurmalısınız"),
        this.translateService.instant("Hata")
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
    this.bulletinForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      owner: ['', Validators.required],
      file: [null],
      image: ['', Validators.required],
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }


  getFile(event: any) {
    let files: FileList = event.target.files;
    console.log(files);

    for (let file of event.target.files) {
      this.readAndPushFile(file);
    }
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
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target?.result as string);
      this.uploadedFile = {
        name : file.name,
        type : file.type,
        url : url,
        fileSize : fileSize,
        fileSizeType : fileSizeType
      };

      console.log("Uploaded File : ", this.uploadedFile);
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
      this.bulletinForm.reset();
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

  getFormValues() {
    let bulletinFormValues = Object.assign({}, this.bulletinForm.value);

    // const selectedFile: File = this.bulletinForm.get('file')?.value;

    // if (!selectedFile) {
    //   console.log('Dosya seçilmedi.');
    //   return;
    // }

    // const formData = new FormData();
    // formData.append('file', selectedFile);

    // console.log("Form Data :", formData);
    // console.log("Selected File :", selectedFile);
    

    bulletinFormValues.file = this.uploadedFile.url.changingThisBreaksApplicationSecurity;
    console.log("Form Values : ", bulletinFormValues);
    this.postBulletinForm(bulletinFormValues);
  }

  postBulletinForm(formValues : any) {
    this.profileService.postBulletinForm(formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      console.log("Bülten Gönderildi :", response);
    
    }, error => {
      console.log("Form Gönderilemedi :", error);
      
    });
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedAvatars();
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.avatars.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePagedAvatars();
    }
  }

  updatePagedAvatars(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedAvatars = this.avatars.slice(startIndex, startIndex + this.itemsPerPage);
  }


  ngOnDestroy(): void {
    this.bulletinForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
