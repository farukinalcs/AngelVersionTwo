import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FileUploadComponent } from 'src/app/_angel/shared/file-upload/file-upload.component';
import { FormStepperComponent } from 'src/app/_angel/shared/form-stepper/form-stepper.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { CurrencySymbolPipe } from 'src/app/_helpers/pipes/currency-symbol.pipe';
import { AuthService } from 'src/app/modules/auth';

@Component({
    selector: 'app-expense',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        InlineSVGModule,
        Dialog,
        FormStepperComponent,
        FileUploadComponent,
        CurrencySymbolPipe,
        DropdownModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        CustomPipeModule,
        TooltipModule
    ],
    templateUrl: './expense.component.html',
    styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() display: boolean;
    @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

    stepperFields: any[] = [
        { class: 'stepper-item current', number: 1, title: this.translateService.instant('IBAN'), desc: this.translateService.instant('IBAN_Bilgileri') },
        { class: 'stepper-item', number: 2, title: this.translateService.instant('Masraflar'), desc: 'Masrafları Ekle' },
        { class: 'stepper-item', number: 3, title: this.translateService.instant('Tamamlandı'), desc: this.translateService.instant('Özet_Bilgiler') },
        { id: '0', class: 'stepper-item', number: 4, title: this.translateService.instant('Dosya_Yükleme'), desc: this.translateService.instant('Gerekli_Belgeler') },
    ];

    formsCount: any = 5;
    currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
    currentItem: any = this.stepperFields[0];
    formValues: any;
    stepperOrientation: Observable<StepperOrientation>;
    advanceForm: FormGroup;
    currentDate = new Date(Date.now());
    selectedAdvance: any;
    formId: any;
    fileTypes: any[] = [];
    ibanList: any[] = [];
    currencyOptions = [
        { label: 'TRY', value: 'TRY' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'RUB', value: 'RUB' },
        { label: 'INR', value: 'INR' },
    ];
    addedExpenses: any[] = [];
    expenseTypes: any[] = [];

    constructor(
        private profileService: ProfileService,
        private formBuilder: FormBuilder,
        private toastrService: ToastrService,
        public authService: AuthService,
        private breakpointObserver: BreakpointObserver,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.setResponsiveForm();
        this.createFormGroup();
        this.getIbanList();
        this.listenIbanValue();
        this.listenSelectedIban();
        this.fetchExpenseTypes();
    }

    getIbanList() {
        this.profileService.getIbanList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            let data = response[0].x;
            const message = response[0].z;

            data.forEach((value: any) => {
                value.iban = value.iban.replace(/\s/g, '').match(/.{1,4}/g).join(' ');
                value.maskIban = this.maskIban(value.iban);
            });
            this.ibanList = data;
            console.log("İban Listesi Geldi : ", data);

        });
    }

    maskIban(iban: string) {
        const ibanParts = iban.split(' ');

        const firstFour = ibanParts[0];
        const lastTwo = ibanParts[ibanParts.length - 1];

        const maskedMiddle = ibanParts.slice(1, ibanParts.length - 1).map(part => {
            return part.replace(/[0-9]/g, '*');
        });

        const maskedIban = [firstFour, ...maskedMiddle, lastTwo].join(' ');

        return maskedIban;
    }

    canProceedToNextStep(): boolean {
        this.formValues = Object.assign({}, this.advanceForm.value, { expenses: this.addedExpenses });

        this.formValues.ibanSave ? this.formValues.ibanSave = 1 : this.formValues.ibanSave = 0;
        console.log("Masraf Talep Form :", this.formValues);

        if (this.currentStep$.value === 2) {
            // expenseItems alanını geçici olarak kaldırarak kontrol et
            const clonedForm = this.formBuilder.group({ ...this.advanceForm.controls });
            clonedForm.removeControl('expenseItems');
            return clonedForm.valid && this.addedExpenses.length > 0;

        } else if (this.currentStep$.value === 3) {
            this.postForm(this.formValues);
            return true;
        }

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

    createFormGroup() {
        this.advanceForm = this.formBuilder.group({
            explanation: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
            iban: ['TR', [Validators.required, Validators.pattern(/^TR\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{2}$/)]],
            ibanSave: [false],
            savedIbans: [''],
            expenseItems: this.formBuilder.array([this.createExpenseItem()])
        });
    }

    listenIbanValue() {
        this.advanceForm.get('iban')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            if (!value?.startsWith("TR")) {
                this.advanceForm.get('iban')?.setValue("TR" + value);
            }

            const formattedIBAN = value && value.startsWith('TR') ? value
                .replace(/\s/g, '') // Boşlukları kaldır
                .match(/.{1,4}/g) // Her 4 karakterde bir grupla
                .join(' ') // Her grubun arasına boşluk ekleyerek birleştir
                : 'TR' + value
            this.advanceForm.get('iban')?.setValue(formattedIBAN, { emitEvent: false });
            this.advanceForm.get('savedIbans')?.setValue(null);
        });
    }

    listenSelectedIban() {
        this.advanceForm.get('savedIbans')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: string) => {
            value ? this.advanceForm.get('iban')?.setValue(value) : '';
        });
    }

    // Stepper'ı yataydan dikeye çevir
    setResponsiveForm() {
        this.stepperOrientation = this.breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    closedFormDialog() {
        this.advanceForm.reset();
        this.selectedAdvance = '';
        this.resetStepperFieldsClass();
        this.currentStep$.next(1);
        this.currentItem = this.stepperFields[0];
        this.onHide.emit();
    }

    resetStepperFieldsClass() {
        this.stepperFields.forEach((item, index) => {
            item.class = index === 0 ? "stepper-item current" : "stepper-item";
        });
    }


    onUploaded(event: any) {
        console.log("(YENİ) Dosya Yüklendi... ", event);
        this.closedFormDialog();
    }

    get expenseItems(): FormArray {
        return this.advanceForm.get('expenseItems') as FormArray;
    }

    createExpenseItem(): FormGroup {
        return this.formBuilder.group({
            description: ['', [Validators.required, Validators.maxLength(250)]],
            type: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0)]],
            taxRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            currency: ['TRY', Validators.required],
            date: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required]
        });
    }

    addExpenseItem(): void {
        if (this.addedExpenses.length >= 10) {
            this.toastrService.warning('Maksimum 10 masraf kalemi ekleyebilirsiniz');
            return;
        }

        const item = this.expenseItems.at(0); // Sadece 0. indexte form var çünkü
        if (item.invalid) {
            this.toastrService.warning(
                this.translateService.instant('Lütfen_geçerli_masraf_bilgileri_girin'),
                this.translateService.instant('Uyarı')
            );
            return;
        }
        item.get('taxRate')?.enable();

        const newItem = item.value;
        this.addedExpenses.push(newItem);

        // Formu temizlemek içn
        item.reset({
            description: '',
            type: '',
            amount: '',
            taxRate: '',
            currency: 'TRY'
        });



        console.log("Masraf Kalemi: ", this.addedExpenses);
    }

    removeAddedExpense(index: number): void {
        this.addedExpenses.splice(index, 1);
    }

    getTotalAmount(): number {
        return this.addedExpenses.reduce((total, masraf) => {
            const amount = parseFloat(masraf.amount) || 0;
            const taxRate = parseFloat(masraf.taxRate) || 0;
            // return total + amount * (1 + taxRate / 100);
            return total + amount;
        }, 0);
    }

    fetchExpenseTypes() {
        var sp: any[] = [
            {
                mkodu: 'yek363',
                id: '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.expenseTypes = [...data];
            console.log("Masraf Tipleri Geldi :", this.expenseTypes);

            this.onChangeExpenseType();
        });
    }

    onChangeExpenseType() {
        const item = this.expenseItems.at(0);

        item.get('type')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
            const taxRate = value?.kdvoran;
            item.get('taxRate')?.patchValue(value?.kdvoran);

            if (value?.sabitoran) {
                item.get('taxRate')?.disable();
            }
        });
    }

    postForm(formValues: any) {
        const random = this.generateRandomKey();

        var sp: any[] = [];

        formValues.expenses.forEach((item: any) => {
            sp.push({
                mkodu: 'yek361',
                uniqueid: random,
                parabirimi: item.currency,
                aciklama: formValues.explanation,
                masrafaciklama: item.description,
                masraftarih: item.date,
                masraftipi: item.type.id.toString(),
                vergiorani: item.taxRate.toString(),
                tutar: item.amount.toString(),
                iban: formValues.iban,
                ibansave: formValues.ibanSave.toString()
            });
        });

        console.log("Masraf Talep sp :", sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            console.log("Masraf talebi gönderildi :", response);
            




            this.fetchExpenseByUniqueId(random);
        });
    }


    generateRandomKey(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';

        for (let i = 0; i < 8; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const now = new Date();

        const year = now.getFullYear().toString(); // 4 hane
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 01-12
        const day = now.getDate().toString().padStart(2, '0'); // 01-31
        const hour = now.getHours().toString().padStart(2, '0'); // 00-23
        const minute = now.getMinutes().toString().padStart(2, '0'); // 00-59
        const second = now.getSeconds().toString().padStart(2, '0'); // 00-59
        const millisecond = now.getMilliseconds().toString().padStart(3, '0'); // 000-999

        const timestamp = year + month + day + hour + minute + second + millisecond;

        return key + timestamp;
    }

    fetchExpenseByUniqueId(uniqueId: any) {
        var sp: any[] = [
            {
                mkodu: 'yek366',
                uniqueid: uniqueId
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            let file = data.map((item: any) => {
                return {
                    id: item.id,
                    BelgeId: item.id,
                    ad: item.masrafaciklama
                }
            });

            this.fileTypes = [...file];
            console.log("Dosya Yükelemeye Gönderilecek Değişken :", file);
        });

    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
