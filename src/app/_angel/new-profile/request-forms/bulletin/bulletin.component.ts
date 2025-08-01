import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FormStepperComponent } from 'src/app/_angel/shared/form-stepper/form-stepper.component';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
    selector: 'app-bulletin-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        Dialog,
        InlineSVGModule,
        TooltipModule,
        DatePickerModule,
        FormStepperComponent,
        SelectModule
    ],
    templateUrl: './bulletin.component.html',
    styleUrl: './bulletin.component.scss'
})
export class BulletinComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>; // input[type="file"] elementine referans
    @Input() display: boolean;
    @Output() onHide = new EventEmitter<any>;
    @Output() fetchEvent = new EventEmitter<any>();
    stepperFields: any[] = [
        { class: 'stepper-item current', number: 1, title: this.translateService.instant('Bülten'), desc: this.translateService.instant('Bülten_İçeriği') },
        { class: 'stepper-item', number: 2, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('Tarih_Ve_Yayıncı') },
        { class: 'stepper-item', number: 3, title: this.translateService.instant('Resim_Seçin'), desc: this.translateService.instant('Avatar') },
        { class: 'stepper-item', number: 4, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
        { id: '0', class: 'stepper-item', number: 5, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Bülten_PDF') }
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
    uploadedFile: any[] = [];
    src: any;
    uploadedFiles: any[] = [];

    avatars: any[] = [
        { path: 'storyset-1/1.svg' },
        { path: 'storyset-1/2.svg' },
        { path: 'storyset-1/3.svg' },
        { path: 'storyset-1/4.svg' },
        { path: 'storyset-1/5.svg' },
        { path: 'storyset-1/6.svg' },
        { path: 'storyset-1/7.svg' },
        { path: 'storyset-1/8.svg' },
        { path: 'sigma-1/9.png' },
        { path: 'sigma-1/10.png' },
        { path: 'sigma-1/11.png' },
        { path: 'sigma-1/12.png' },
        { path: 'sigma-1/13.png' },
        { path: 'sigma-1/15.png' },
        { path: 'sigma-1/16.png' },
        { path: 'sigma-1/17.png' },
        { path: 'sigma-1/19.png' },
        { path: 'dozzy-1/1.png' },
        { path: 'dozzy-1/2.png' },
        { path: 'dozzy-1/3.png' },
        { path: 'dozzy-1/4.png' },
        { path: 'dozzy-1/5.png' },
        { path: 'dozzy-1/6.png' },
        { path: 'dozzy-1/7.png' },
        { path: 'dozzy-1/8.png' },
        { path: 'dozzy-1/9.png' },
        { path: 'dozzy-1/10.png' },
        { path: 'dozzy-1/11.png' },
        { path: 'dozzy-1/12.png' },
        { path: 'dozzy-1/13.png' },
        { path: 'dozzy-1/15.png' },
        { path: 'dozzy-1/16.png' },
        { path: 'dozzy-1/17.png' },
        { path: 'dozzy-1/19.png' },
        { path: 'dozzy-1/20.png' },
    ];

    pagedAvatars: any[] = [];
    itemsPerPage: number = 6;
    currentPage: number = 1;
    formId: any;
    registryGroups: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private profileService: ProfileService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private breakpointObserver: BreakpointObserver,
        private sanitizer: DomSanitizer,
        public layoutService: LayoutService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.setResponsiveForm();
        this.createFormGroup();
        this.updatePagedAvatars();
        this.fetchRegistryGroup()
    }

    canProceedToNextStep(): boolean {
        if (this.currentStep$.value === 3) {
            this.bulletinFormValues = Object.assign({}, this.bulletinForm.value);

            return this.bulletinForm.valid;
        } else if (this.currentStep$.value === 4) {

            this.bulletinFormValues = Object.assign({}, this.bulletinForm.value);
            this.getFormValues();

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
            registryGroup: ['', Validators.required]
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
        // Yüklenen Dosyalar İçin Detay Bilgiler
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
            let fileInfo = {
                name: file.name,
                type: file.type,
                url: url,
                fileSize: fileSize,
                fileSizeType: fileSizeType,
            };

            this.uploadedFile.push({ files: fileInfo, sendFile: file });
            // this.uploadedFile.push(item);
            console.log('Uploaded File : ', this.uploadedFile);
            this.ref.detectChanges();
        };
    }

    // removeUploadedFile(item: any, file: any) {
    //     const index = item.files.indexOf(file);
    //     if (index !== -1) {
    //         item.files.splice(index, 1);
    //     }
    // }

    closedFormDialog() {
        console.log("Closed Form : ");
        this.bulletinForm.reset();
        this.uploadedFiles = [];
        this.resetStepperFieldsClass();
        this.currentStep$.next(1);
        this.currentItem = this.stepperFields[0];
        this.onHide.emit()
    }

    resetStepperFieldsClass() {
        this.stepperFields.forEach((item, index) => {
            item.class = index === 0 ? "stepper-item current" : "stepper-item";
        });
    }

    getFormValues() {
        let bulletinFormValues = Object.assign({}, this.bulletinForm.value);


        console.log("Form Values : ", bulletinFormValues);
        this.postBulletinForm(bulletinFormValues);
    }

    postBulletinForm(formValues: any) {
        this.profileService.postBulletinForm(formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                this.toastrService.error("İşleminiz Gerçekleştirilemedi", "Hata");
                return;
            }
            console.log("Bülten Gönderildi :", response);
            this.formId = data[0].Id || null;
            this.toastrService.success("Bülten Başarılı Bir Şekilde Oluşturuldu", "Başarılı");

            this.nextPage();
            this.fetchEvent.emit()
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


    // Dosya kaldırıldığında
    removeUploadedFile(item: any) {
        const index = this.uploadedFile.indexOf(item);
        if (index !== -1) {
            this.uploadedFile.splice(index, 1);
            console.log('Dosya Silindi: ', item.files.name);

            // Dosya input'u üzerine kalan dosyaları tekrar güncelleme
            this.updateFileInput();
        }
    }

    // Dosya input'unu, uploadedFile dizisindeki kalan dosyalarla eşleştireceğiz
    updateFileInput() {
        // Önce dosya input'unu sıfırlayalım
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = ''; // input'u sıfırlıyoruz
        }

        // Kalan dosyaları yeniden yükleme
        const fileList = this.createFileListFromUploadedFiles();

        // Dosya input'una yeni file listesi ekliyoruz
        if (this.fileInput && this.fileInput.nativeElement) {
            const inputElement = this.fileInput.nativeElement;
            for (let file of fileList) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElement.files = dataTransfer.files;
            }
        }
    }

    // uploadedFile dizisinden DataTransfer ile file listesi oluşturma
    createFileListFromUploadedFiles() {
        let fileList: File[] = [];

        // uploadedFile dizisini dolaşıp, dosya bilgilerini alıyoruz
        for (let item of this.uploadedFile) {
            const file = new File([item.files], item.files.name, {
                type: item.files.type,
            });
            fileList.push(file);
        }

        return fileList;
    }

    previewFileInNewTab(fileData: any): void {
        const base64Url = fileData?.changingThisBreaksApplicationSecurity;

        if (!base64Url) {
            console.error("Geçersiz dosya verisi.");
            return;
        }

        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(
                `<iframe width="100%" height="100%" src="${base64Url}" frameborder="0" allowfullscreen></iframe>`
            );
        } else {
            console.error("Yeni sekme açılamadı. Tarayıcı pop-up engelleyici aktif olabilir.");
        }
    }


    add() {
        // İşlem tamamlandığında dosya gönderme
        this.profileService
            .postFileForDemand(
                this.uploadedFile[0].sendFile,
                this.formId.toString(),
                'bulten',
                '1'
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                if (response[0].z.islemsonuc != 1) {
                    this.toastrService.error(
                        this.translateService.instant(
                            'Belge_Yüklenirken_Bir_Hata_Oluştu!'
                        ),
                        this.translateService.instant('HATA')
                    );
                    return;
                }
                this.toastrService.success(
                    this.translateService.instant('Belge_Yüklendi'),
                    this.translateService.instant('Başarılı')
                );
                console.log('Dosya gönderildi : ', response);
                this.fetchEvent.emit()
                this.closedFormDialog();
            });

    }

    fetchRegistryGroup() {
        var sp: any[] = [
            {
                mkodu: 'yek326'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.registryGroups = [...data];
        });
    }

    ngOnDestroy(): void {
        // this.closedFormDialog();
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
