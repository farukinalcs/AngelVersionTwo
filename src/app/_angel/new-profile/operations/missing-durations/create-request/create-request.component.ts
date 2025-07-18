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
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { OKodFieldsModel } from 'src/app/_angel/profile/models/oKodFields';
import { UserInformation } from 'src/app/_angel/profile/models/user-information';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FileUploadComponent } from 'src/app/_angel/shared/file-upload/file-upload.component';
import { FormStepperComponent } from 'src/app/_angel/shared/form-stepper/form-stepper.component';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
    selector: 'app-create-request',
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
        FormStepperComponent,
        DialogModule
    ],
    templateUrl: './create-request.component.html',
    styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() displayVacationForm: boolean;
    @Input() record: any;
    @Output() onHideVacationForm: EventEmitter<void> = new EventEmitter<void>();
    stepperFields: any[] = [
        { class: 'stepper-item current', number: 1, title: this.translateService.instant('Tip'), desc: '' },
        { class: 'stepper-item', number: 2, title: this.translateService.instant('Zaman'), desc: this.translateService.instant('İzinli_Süreler') },
        { class: 'stepper-item', number: 3, title: this.translateService.instant('Kişisel_Bilgiler'), desc: '' },
        { class: 'stepper-item', number: 4, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
        { id: '0', class: 'stepper-item', number: 5, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
    ];
    formsCount: any = 6;
    currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
    currentItem: any = this.stepperFields[0];
    vacationFormValues: any;
    // Stepper responsive 
    stepperOrientation: Observable<StepperOrientation>;
    vacationForm: FormGroup;
    uploadedFile: any;
    currentDate = new Date();
    calcTimeDesc: any;
    calcTimeValue: any;
    izinKalan: number = 0;
    userInformation: UserInformation;
    vacationReasons: any[] = [];
    formId: any;
    fileTypes: any[] = [];
    currentUserValue: UserType;
    vacationRightState: boolean;
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
    ) { }

    ngOnInit(): void {
        this.currentUserValue = this.authService.currentUserValue;
        console.log("currentUserValue izin talep :", this.currentUserValue);


        this.setResponsiveForm();
        this.createFormGroup();
        this.getVacationReason();
        this.dateChanges();
        this.typeChanges();
        this.getUserInformation();
    }

    canProceedToNextStep(): boolean { // Sonraki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
        let vacationFormValues = Object.assign({}, this.vacationForm.value);

        this.vacationFormValues = vacationFormValues;
        console.log("Form Values : ", this.vacationFormValues);

        if (this.currentStep$.value === 1) {
            return this.vacationForm.controls['vacationType'].valid;

        } else if (this.currentStep$.value === 3) {
            return this.vacationForm.valid;

        } else if (this.currentStep$.value === 4) {
            this.postVacationForm(vacationFormValues);
            return true;
        } else if (this.currentStep$.value === 5) {

        }

        return true;
    }

    canProceedToPrevStep(): boolean { // Önceki Adıma Geçmeden Durum Kontrolü Yapılan Kısım
        if (this.currentStep$.value === 1) {
            return this.vacationForm.controls['vacationType'].valid;
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
            vacationType: ['', [Validators.required]],
            startDate: [this.record.giris.split('T')[0], [Validators.required]],
            startTime: [this.record.giris.split('T')[1], [Validators.required]],
            endDate: [this.record.cikis.split('T')[0], [Validators.required]],
            endTime: [this.record.cikis.split('T')[1], [Validators.required]],
            explanation: ['', [Validators.required]],
            address: ['', [Validators.required]],
        });
    }

    setResponsiveForm() { // Stepper'ı Yataydan Dikeye Çevir
        this.stepperOrientation = this.breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }


    closedFormDialog() { // Dialog Penceresi Kapatıldığında İlgili Yerleri Sıfırlamak İçin
        this.vacationForm?.reset();
        this.uploadedFile = '';
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

    dateChanges() {
        const typeChanges$ = this.vacationForm.get('vacationType')?.valueChanges.pipe(
            startWith(this.vacationForm.get('vacationType')?.value)
        );


        combineLatest([typeChanges$])
            .pipe(
                debounceTime(300), // Kullanıcı hızlı yazıyorsa istek sayısını azaltmak için
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(([vacationType]: any) => {
                // Form değerlerini doğrudan parametrelerden al
                const formValue = {
                    ...this.vacationForm.value,
                    vacationType,
                    siciller: this.currentUserValue?.xSicilID.toString()
                };

                if (!formValue.vacationType) {
                    this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!';
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

        var sp: any[] = [
            {
                mkodu: 'yek049',
                    kaynak: 'izin',
                    tip: vacationFormValues.vacationType.ID.toString(),
                    bastarih: vacationFormValues?.startTime ? `${vacationFormValues.startDate} ${vacationFormValues.startTime}` : vacationFormValues.startDate,
                    bittarih: vacationFormValues?.endTime ? `${vacationFormValues.endDate} ${vacationFormValues.endTime}` : vacationFormValues.endDate,
                    izinadresi: vacationFormValues.address,
                    ulasim: '',
                    yemek: '',
                    aciklama: vacationFormValues.explanation,
                    siciller: this.currentUserValue?.xSicilID.toString(),
            }
        ];

        

        console.log("İzin talebi param : ", sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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
        this.vacationForm.controls['vacationType'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
            item ? this.getFileTypeForDemandType(item.ID, 'izin') : '';

            if (item?.ID == 3 && !this.vacationRightState) {
                this.getVacationRight();

                this.vacationRightState = true;
            }
        });
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
