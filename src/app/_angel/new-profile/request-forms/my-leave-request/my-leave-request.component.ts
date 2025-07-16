import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { OKodFieldsModel } from 'src/app/_angel/profile/models/oKodFields';
import { UserInformation } from 'src/app/_angel/profile/models/user-information';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FileUploadComponent } from 'src/app/_angel/shared/file-upload/file-upload.component';
import { FormStepperComponent } from 'src/app/_angel/shared/form-stepper/form-stepper.component';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
    selector: 'app-my-leave-request',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        InlineSVGModule,
        SelectModule,
        FileUploadComponent,
        DatePickerModule,
        FormStepperComponent
    ],
    templateUrl: './my-leave-request.component.html',
    styleUrl: './my-leave-request.component.scss'
})
export class MyLeaveRequestComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() displayVacationForm: boolean;
    @Output() onHideVacationForm: EventEmitter<void> = new EventEmitter<void>();
    vacationRightsLoading: boolean = true;
    stepperFields: any[] = [
        { class: 'stepper-item current', number: 1, title: this.translateService.instant('Tür'), desc: this.translateService.instant('Günlük_Saatlik') },
        { class: 'stepper-item', number: 2, title: this.translateService.instant('Tip'), desc: '' },
        { class: 'stepper-item', number: 3, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('İzinli_Süreler') },
        { class: 'stepper-item', number: 4, title: this.translateService.instant('Kişisel_Bilgiler'), desc: '' },
        { class: 'stepper-item', number: 5, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
        { id: '0', class: 'stepper-item', number: 6, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
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
    currentDate = new Date();
    formDisabled: boolean = true;
    isHourly: boolean = false;
    calcTimeDesc: any;
    calcTimeValue: any;
    currentSicilId: any;
    izinKalan: number = 0;
    userInformation: UserInformation;
    vacationReasons: any[] = [];
    formId: any;
    files: any;
    fileTypes: any[] = [];
    currentUserValue: UserType;
    vacationRightState: boolean;
    matchedRegistry: string;
    loadingStates: { [key: string]: boolean } = {
        calculate: false
    };

    constructor(
        private formBuilder: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private profileService: ProfileService,
        private toastrService: ToastrService,
        public authService: AuthService,
        public translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private helperService: HelperService,
        private modeService: ThemeModeService,
    ) { }

    ngOnInit(): void {
        this.currentUserValue = this.authService.currentUserValue;
        console.log("currentUserValue izin talep :", this.currentUserValue);

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
        this.getUserInformation();
    }


    canProceedToNextStep(): boolean { // Sonraki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
        let vacationFormValues = Object.assign({}, this.vacationForm.value);

        this.vacationFormValues = vacationFormValues;
        console.log("Form Values : ", this.vacationFormValues);

        if (this.currentStep$.value === 1) {
            return this.vacationForm.controls['gunluksaatlik'].valid;

        } else if (this.currentStep$.value === 2) {
            return this.vacationForm.controls['tip'].valid;

        } else if (this.currentStep$.value === 4) {
            return this.vacationForm.valid;

        } else if (this.currentStep$.value === 5) {
            this.postVacationForm(vacationFormValues);
            return true;
        } else if (this.currentStep$.value === 6) {
            // if (this.fileTypes.length == 0) {
            //   this.closedFormDialog();
            // }
            // return true;
        }

        return true;
    }

    canProceedToPrevStep(): boolean { // Önceki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
        if (this.currentStep$.value === 1) {
            return this.vacationForm.controls['gunluksaatlik'].valid;
        }
        else if (this.currentStep$.value === 2) {
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
            tip: ['', [Validators.required]],
            bastarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
            bassaat: [{ value: this.currentDate, disabled: this.formDisabled }, [Validators.required]],
            bittarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
            bitsaat: [{ value: this.currentDate, disabled: this.formDisabled }, [Validators.required]],
            aciklama: ['', [Validators.required]],
            izinadresi: ['', [Validators.required]],
            gunluksaatlik: [null, Validators.required],
            file: [null]
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
                name: file.name,
                type: file.type,
                url: url,
                fileSize: fileSize,
                fileSizeType: fileSizeType
            };
            console.log("Uploaded Fileee : ", item);
        };
    }

    removeUploadedFile(item: any, file: any) { // Yüklenmiş Dosyanın Kaldırlması İçin 
        const index = item.files.indexOf(file);
        if (index !== -1) {
            item.files.splice(index, 1);
        }
    }

    closedFormDialog() { // Dialog Penceresi Kapatıldığında İlgili Yerleri Sıfırlamak İçin
        this.vacationForm?.reset();
        this.resetStepperFieldsClass();
        this.currentStep$.next(1);
        this.currentItem = this.stepperFields[0];
        this.onHideVacationForm.emit();
    }

    resetStepperFieldsClass() { // "Stepper" Yapısını Sıfırlamak İçin
        this.stepperFields.forEach((item, index) => {
            item.class = index === 0 ? "stepper-item current" : "stepper-item";
        });
    }

    getFormValues() { // Form Verilerinin Alınıp, Yüklenmiş Dosyaların API'ye Gönderilmesi
        let vacationFormValues = Object.assign({}, this.vacationForm.value);
        console.log("Form Values : ", vacationFormValues);

        this.fileTypes.forEach((item: any) => {
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


    dateChanges() {
        const bastarihChanges$ = this.vacationForm.get('bastarih')?.valueChanges.pipe(
            startWith(this.vacationForm.get('bastarih')?.value)
        );
        const bittarihChanges$ = this.vacationForm.get('bittarih')?.valueChanges.pipe(
            startWith(this.vacationForm.get('bittarih')?.value)
        );
        const bassaatChanges$ = this.vacationForm.get('bassaat')?.valueChanges.pipe(
            startWith(this.vacationForm.get('bassaat')?.value)
        );
        const bitsaatChanges$ = this.vacationForm.get('bitsaat')?.valueChanges.pipe(
            startWith(this.vacationForm.get('bitsaat')?.value)
        );
        const typeChanges$ = this.vacationForm.get('tip')?.valueChanges.pipe(
            startWith(this.vacationForm.get('tip')?.value)
        );


        combineLatest([bastarihChanges$, bittarihChanges$, bassaatChanges$, bitsaatChanges$, typeChanges$])
            .pipe(
                debounceTime(300), // Kullanıcı hızlı yazıyorsa istek sayısını azaltmak için
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(([bastarih, bittarih, bassaat, bitsaat, tip]: any) => {
                // Form değerlerini doğrudan parametrelerden al
                const formValue = {
                    ...this.vacationForm.value,
                    bastarih,
                    bittarih,
                    bassaat,
                    bitsaat,
                    tip,
                    siciller: this.currentSicilId
                };

                if (!formValue.tip) {
                    this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!';
                } else if (formValue.gunluksaatlik == 'saatlik' && (!bassaat || !bitsaat)) {
                    this.calcTimeDesc = 'Saat Bilgisi Girimelisiniz!';
                } else {
                    this.calcTimeDesc = '';
                }
            });
    }


    calculateVacationTime(form: any) {
        this.loadingStates.calculate = true;
        this.profileService.calculateVacationTime(form)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(error => {
                    console.error('API hatası:', error);
                    this.calcTimeDesc = 'Hesaplama sırasında bir hata oluştu';
                    return of(null);
                })
            )
            .subscribe((response: any) => {
                if (!response) return;

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
                this.loadingStates.calculate = false;
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

        sp.push({
            mkodu: 'yek107',
            sicilid: this.currentUserValue?.xSicilID.toString(),
            izintip: '3'
        })


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
            this.izinKalan = data[0].Kalan;
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

    postVacationForm(vacationFormValues: any) { // API'ye İzin Talebini Göndermek İçin Fonksiyon
        let employees: any[] = [];
        employees.push(this.currentUserValue?.xSicilID.toString());

        this.profileService.postRequestForm('izin', vacationFormValues, employees).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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
                    spMessage?.usermessage,
                    this.translateService.instant('Hata')
                );
                this.prevStep();
                return;
            }

            if (this.fileTypes.length == 0) {
                this.closedFormDialog();
            }
        })
    }

    postVacationFile(file: any, formId: any, kaynak: any, fileType: any) { // API'ye, Oluşturulan İzin Talebi İçin Yüklenen Dosyaları İleten Kısım 
        this.profileService.postFileForDemand(file, formId, kaynak, fileType)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {

                console.log("İzin için dosya gönderildi : ", response);

                this.closedFormDialog();

            });
    }

    getFileTypeForDemandType(typeId: any, kaynak: any) { // API'ye, Seçilen İzin Tipine Ait Zorunlu Belgeleri Alması İçin İstek Atılıyor 
        this.fileTypes = [];
        this.profileService
            .getFileTypeForDemandType(typeId, kaynak)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    this.toastrService.error(
                        this.translateService.instant('Zorunlu_Belgeler_Getirilirken_Hata_Oluştu'),
                        this.translateService.instant('Hata')
                    );
                    return;
                } else if (message.islemsonuc == 9) {
                    return;
                }

                this.toastrService.warning(
                    this.translateService.instant('Bu İzin Tipi İçin Zorunlu Belge Bulunmaktadır!'),
                    this.translateService.instant('Uyarı')
                );

                console.log("Zorunlu belgeler geldi", data);
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

    matchRegistry(items: { Id: number }[], separator: string): string {
        return items.map(item => item.Id).join(separator);
    }



    onUploaded(event: any) {
        console.log("(YENİ) Dosya Yüklendi... ", event);
        this.closedFormDialog();
    }

    ngOnDestroy(): void {
        this.closedFormDialog();
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();

        document.body.style.backgroundImage = 'none';
    }
}