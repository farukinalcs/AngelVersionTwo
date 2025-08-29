import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { DemandProcessModel } from '../../profile/models/demandProcess';
import { ProfileService } from '../../profile/profile.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';

@Component({
    selector: 'app-request-process',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        TimelineModule,
        TranslateModule
    ],
    templateUrl: './request-process.component.html',
    styleUrls: ['./request-process.component.scss']
})
export class RequestProcessComponent implements OnInit, OnDestroy {
    @Input() demandId: any;
    @Input() demandTypeName: any;
    @Input() displayRequestProcess: boolean;
    @Output() displayRequestProcessEvent: EventEmitter<void> = new EventEmitter<void>();

    private ngUnsubscribe = new Subject();

    requestProcess: any[] = [];

    constructor(
        private profileService: ProfileService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getDemandProcess(this.demandId, this.demandTypeName);
    }

    getDemandProcess(formId: any, formTip: any) {
        console.log(formId,formTip);
        
        if (formTip == 'İzin') {
            formTip = 'izin';
        } else if (formTip == 'Fazla Mesai') {
            formTip = 'fazlamesai'
        }
        this.profileService.getDemandProcess(formId, formTip).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<DemandProcessModel, ResponseDetailZ>[]) => {
            let data = response[0].x;
            let message = response[0].z;

            console.log("Talep Süreci : ", data);
            if (message.islemsonuc == 1) {
                this.requestProcess = data;

            } else {
                this.toastrService.warning(
                    this.translateService.instant("Gösterilecek_Süreç_Bulunamadı"),
                    this.translateService.instant("Uyarı")
                );
            }
            this.ref.detectChanges();
        })
    }

    hideRequestProcess() {
        this.displayRequestProcessEvent.emit();
    }


    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleString('tr-TR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Eklendi':
                return 'bg-primary';
            case 'Reddedildi':
                return 'bg-danger';
            case 'Onay Bekleniyor':
                return 'bg-warning';
            case 'Onaylandı':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'Eklendi':
                return 'bi bi-plus';
            case 'Reddedildi':
                return 'bi bi-x';
            case 'Onay Bekleniyor':
                return 'bi bi-clock';
            case 'Onaylandı':
                return 'bi bi-check';
            default:
                return 'bi bi-info-circle';
        }
    }

    getBadgeVariant(status: string): string {
        switch (status) {
            case 'Eklendi':
                return 'primary';
            case 'Reddedildi':
                return 'danger';
            case 'Onay Bekleniyor':
                return 'warning';
            case 'Onaylandı':
                return 'success';
            default:
                return 'secondary';
        }
    }

    ngOnDestroy(): void {
        this.displayRequestProcessEvent.emit();
    }
}
