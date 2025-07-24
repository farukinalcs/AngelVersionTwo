import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { MyDemands } from 'src/app/_angel/profile/models/myDemands';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { LayoutService } from 'src/app/_metronic/layout';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { RequestsService } from '../../../requests.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { UploadedFilesComponent } from 'src/app/_angel/new-profile/requests/pending-requests/uploaded-files/uploaded-files.component';
import { RequestProcessComponent } from 'src/app/_angel/shared/request-process/request-process.component';

@Component({
    selector: 'app-shared-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TooltipModule,
        MatExpansionModule,
        CustomPipeModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        DataNotFoundComponent,
        InputTextModule,
        DialogModule,
        UploadedFilesComponent,
        RequestProcessComponent

    ],
    templateUrl: './shared-requests.component.html',
    styleUrl: './shared-requests.component.scss'
})
export class SharedRequestsComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject()

    checkGrid: boolean = true;
    filterText: string = "";
    imageUrl: any;

    selectedTab: any;
    requests: any[] = [];
    displayDemandProcess: boolean = false;
    demandIdForProcess: any;
    demandTypeNameForProcess: any;
    selectedDemand: any;
    displayUploadedFiles: boolean;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';
    displayPosition: boolean;
    descriptionText: string;

    constructor(
        public layoutService: LayoutService,
        private profileService: ProfileService,
        private reqService: RequestsService,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.selectedTab = this.reqService.selectedTab;

        this.fetchMyDemands();
    }

    fetchMyDemands() {
        console.log("KAYNAK :", this.selectedTab);

        this.profileService.getMyDemands(this.selectedTab.key).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<MyDemands, ResponseDetailZ>[]) => {
            const data = response[0].x;
            const message = response[0].z;


            console.log("My Requests: ", data);
            this.requests = (data || []).filter(item => item.durum == 0);

            if (message.islemsonuc == -1) {
                return;
            }

            let emptyDocumentCount = 0;

            this.requests?.forEach((request: any) => {
                request.completed = false;

                if (request.atananlar) {
                    request.atananlar = JSON.parse(request?.atananlar);

                    request?.atananlar.forEach((document: any) => {
                        if (document.link === 'empty') {
                            emptyDocumentCount++;
                        }
                    });

                    request.emptyDocumentCount = emptyDocumentCount;
                    emptyDocumentCount = 0;
                }
            });

        });
    }

    showDemandProcessDialog(demandId: any, demandTypeName: any) {
        this.displayDemandProcess = true;
        this.demandIdForProcess = demandId;
        this.demandTypeNameForProcess = demandTypeName;
    }


    showPositionDialog(position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright', demand: any) {
        this.position = position;
        this.displayPosition = true;

        this.selectedDemand = demand;
    }

    isCardOpen(item: any) {
        item.panelOpenState = true;
        console.log("Kard Açıldı : ");
    }

    showUploadedFiles(selectedDemand: any) {
        this.displayUploadedFiles = true;
        this.selectedDemand = selectedDemand;
    }

    getTooltipScript(item: any[]): string {
        const bosBelgeler = this.getBosBelgeler(item);
        const bosBelgeSayisi = bosBelgeler.length;
        const belgeAdlari = bosBelgeler
            .map((belge, index) => `${index + 1}) ${belge}`)
            .join('\r\n');

        return `Yüklenmesi Gereken ${bosBelgeSayisi} Adet Dosya Eksik.\r\n${belgeAdlari}`;
    }

    getBosBelgeler(item: any[]): string[] {
        return item
            .filter((belge) => belge.link === 'boş')
            .map((belge) => belge.BelgeAdi);
    }


    cancelMyDemands(formid: any, kaynak: any, aciklama: any, aktifMenu: any) {
        if (kaynak == 'İzin') {
            kaynak = 'izin';
        } else if (kaynak == 'Fazla Mesai') {
            kaynak = 'fm'
        }



        this.profileService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            if (response[0].x[0].islemsonuc) {
                this.toastrService.success(
                    this.translateService.instant("Talep_İptal_Edildi"),
                    this.translateService.instant("Başarılı")
                );

                this.fetchMyDemands();
            }
            console.log("Talep İptal :", response);

        });


        this.descriptionText = '';
        this.displayPosition = false;

    }

    setSelectedDemandEmptyFile(selectedNavItem: any) {
        this.fetchMyDemands();
    }

    onHideUploadedFiles() {
        this.displayUploadedFiles = false;
        this.selectedDemand = undefined;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
