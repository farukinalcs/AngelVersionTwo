import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { CurrencySymbolPipe } from 'src/app/_helpers/pipes/currency-symbol.pipe';
import { ButtonModule } from 'primeng/button';
import { MyFilesDetailComponent } from 'src/app/_angel/new-profile/widgets/my-files/my-files-detail/my-files-detail.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

@Component({
    selector: 'app-expense-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        CustomPipeModule,
        CurrencySymbolPipe,
        ButtonModule,
        MyFilesDetailComponent,
        DialogModule,
        TranslateModule,
        ConfirmPopupModule,
        DataNotFoundComponent
    ],
    providers: [ConfirmationService, MessageService],
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

    constructor(
        private profileService: ProfileService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
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
                mkodu: 'yek367',
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
                durum: item.durum == 0 ? null : 1
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
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Onaylandı', life: 3000 });       
            this.fetchData();
        });
    }

    reject(event: Event, expense: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Reddetmek istediğinize emin misiniz?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Hayır',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Evet, reddet'
            },
            accept: () => {
                this.sendReject(expense);
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }


    sendReject(expense: any) {
        var sp: any[] = [
            {
                mkodu: 'yek369',
                id: expense.id.toString()
            }
        ];
        
        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Reddedildi :", data);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Reddedildi', life: 3000 });               
            this.fetchData();
        });        
    }
    
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}


