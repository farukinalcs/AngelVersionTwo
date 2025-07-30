import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { CurrencySymbolPipe } from 'src/app/_helpers/pipes/currency-symbol.pipe';
import { ButtonModule } from 'primeng/button';
import { MyFilesDetailComponent } from 'src/app/_angel/new-profile/widgets/my-files/my-files-detail/my-files-detail.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { ToastrService } from 'ngx-toastr';
import { RequestProcessComponent } from 'src/app/_angel/shared/request-process/request-process.component';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
    selector: 'app-expense-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        TooltipModule,
        CustomPipeModule,
        CurrencySymbolPipe,
        ButtonModule,
        MyFilesDetailComponent,
        DialogModule,
        TranslateModule,
        ConfirmPopupModule,
        DataNotFoundComponent,
        RequestProcessComponent,
        SelectModule,
        DatePickerModule
    ],
    providers: [ConfirmationService],
    templateUrl: './expense-requests.component.html',
    styleUrl: './expense-requests.component.scss'
})
export class ExpenseRequestsComponent implements OnInit, OnDestroy, OnChanges {
    @Input() menu: any;
    @Input() process: any;

    private ngUnsubscribe = new Subject();
    imageUrl: string;
    requests: any[] = [];
    displayFiles: boolean = false;
    selectedExpense: any;
    blockedPanel: boolean = false;
    displayRejectDialog: boolean = false;
    rejectReason: string = '';
    currentRejectExpense: any = null;
    displayDemandProcess: boolean = false;
    demandTypeNameForProcess: any;
    demandIdForProcess: any;
    displayEdit: boolean = false;
    expenseForm: FormGroup;
    expenseTypes: any[] = [];

    constructor(
        private profileService: ProfileService,
        private confirmationService: ConfirmationService,
        private toastrService: ToastrService,
        private fb: FormBuilder
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['process']) {
            this.fetchData();
        }
    }

    ngOnInit(): void {
        console.log("menü :", this.menu);
    }

    fetchData() {
        var sp: any[] = [
            {
                mkodu: this.menu == 'requests' ? 'yek367' : 'yek371',
                durum: this.process == 'ongoing' ? '0' : this.process == 'denied' ? '-1' : '2'
            }
        ];

        console.log("Masraf parametreleri : ", sp);


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x.map((item: any) => {
                const parsed = JSON.parse(item.talepdetaylar);
                return { ...item, talepdetaylar: parsed }
            });
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Masraf Talepleri Geldi: ", data);
            this.requests = [...data];
        });
    }

    getTotal(item: any) {
        return item.talepdetaylar.reduce((sum: number, item: any) => sum + Number(item.tutar), 0);
    }


    showFiles(expense: any) {
        this.selectedExpense = [expense].map((item: any) => {
            return {
                id: item.id,
                belgetipiad: item.masraftipiad,
                belgetipiid: item.id,
                UniqueId: item.belgeid,
                ContentType: item.ContentType || '',
                DosyaTipi: item.DosyaTipi || '',
                durum: item.belgedurum == 0 ? null : 1
            }
        });

        console.log("Formatlanmış :", this.selectedExpense);
        this.displayFiles = true;

    }

    closeFiles() {
        this.displayFiles = false;
    }

    onUploaded(event: any) {
        console.log("(YENİ) Dosya Yüklendi... ", event);
        this.displayFiles = false;
        this.fetchData();
    }

    confirm(event: Event, expense: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Onaylamak istediğinize emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Hayır',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Evet, onayla'
            },
            accept: () => {
                this.sendConfirm(expense);
            },
            reject: () => {
                this.toastrService.info("Bilgi", "Onaylama iptal edildi");
            }
        });
    }

    sendConfirm(expense: any) {
        var sp: any[] = [
            {
                mkodu: 'yek368',
                id: expense.id.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Onaylandı :", data);
            this.toastrService.success("Başarılı", "Masraf Onaylandı");
            this.fetchData();
        });
    }



    reject(event: Event, expense: any) {
        this.currentRejectExpense = expense;
        this.rejectReason = '';
        this.displayRejectDialog = true;
    }

    cancelReject() {
        this.displayRejectDialog = false;
        this.toastrService.info("Bilgi", "Reddetme iptal edildi");
    }

    confirmReject() {
        this.displayRejectDialog = false;

        const payload = {
            expense: this.currentRejectExpense,
            reason: this.rejectReason
        };

        // API'ye gönderilecek şekilde
        this.sendReject(payload);
    }

    sendReject(payload: { expense: any, reason: string }) {
        console.log('Reddedilen masraf:', payload.expense);
        console.log('Sebep:', payload.reason);


        var sp: any[] = [
            {
                mkodu: 'yek369',
                id: payload.expense.id.toString(),
                aciklama: payload.reason
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Reddedildi :", data);
            this.toastrService.success("Başarılı", "Masraf Reddedildi");
            this.fetchData();
        });
    }

    showDemandProcessDialog(demandId: any, demandTypeName: any) {
        this.displayDemandProcess = true;
        this.demandIdForProcess = demandId;
        this.demandTypeNameForProcess = demandTypeName;
    }

    onEdit(expense?: any) {
        this.displayEdit = !this.displayEdit;

        if (this.displayEdit) {
            this.createEditForm();
            this.fetchExpenseTypes(expense);
        }
    }

    createEditForm() {
        this.expenseForm = this.fb.group({
            amount: [null, [Validators.required, Validators.min(0.01)]],
            taxRate: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
            currency: ['TRY', Validators.required],
            description: ['', Validators.required],
            date: [null, Validators.required],
            type: [null, Validators.required]
        });
    }

    get item(): FormGroup {
        return this.expenseForm as FormGroup;
    }


    fetchExpenseTypes(expense: any) {
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

            this.item.get('amount')?.setValue(expense.tutar);
            this.item.get('taxRate')?.setValue(expense.vergiorani);
            this.item.get('currency')?.setValue(expense.parabirimi);
            this.item.get('description')?.setValue(expense.masrafaciklama);
            this.item.get('date')?.setValue(expense.masraftarih.split('T')[0]);
            this.item.get('type')?.setValue(this.expenseTypes.find(item => item.id == expense.masraftipi));

            console.log("Form value :", this.item.value);
            
        });
    }

    saveEdit() {
        var sp: any[] = [
            {
                mkodu: 'yek372',
                tutar: '',
                parabirimi: '',
                aciklama: '',
                vergiorani: '',
                masraftarih: '',
                masraftipi: ''
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}


