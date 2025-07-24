import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { LayoutService } from 'src/app/_metronic/layout';
import { ExpenseRequestsComponent } from '../../../new-requests/my-requests/pending/expense-requests/expense-requests.component';

@Component({
    selector: 'app-ongoing-requests',
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
        ExpenseRequestsComponent

    ],
    templateUrl: './ongoing-requests.component.html',
    styleUrl: './ongoing-requests.component.scss'
})
export class OngoingRequestsComponent implements OnInit, OnDestroy {
    @Input() ongoingRequests: any;
    @Input() selectedNavItem: any;
    @Input() menuItems: any;
    @Output() getMyDemandsEvent = new EventEmitter<any>();
    @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
    @Output() showDemandProcessDialogEvent = new EventEmitter<{ demandId: any, demandTypeName: any }>();
    @Output() showPositionDialogEvent = new EventEmitter<{ position: any, demand: any }>();
    @Output() showUploadedFilesEvent = new EventEmitter<any>();

    private ngUnsubscribe = new Subject()

    checkGrid: boolean = true;
    filterText: string = "";
    imageUrl: any;
    otherComponent: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private profileService: ProfileService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
    }

    getMyDemands(menuItemKey: any) {
        this.getMyDemandsEvent.emit(menuItemKey);
    }

    showDetailSearchDialog() {
        this.showDetailSearchDialogEvent.emit(this.selectedNavItem);
    }

    showDemandProcessDialog(demandId: any, demandTypeName: any) {
        this.showDemandProcessDialogEvent.emit({ demandId, demandTypeName });
    }

    showPositionDialog(position: any, demand: any) {
        this.showPositionDialogEvent.emit({ position, demand });
    }


    isCardOpen(item: any) {
        item.panelOpenState = true;
        console.log("Kard Açıldı : ");
    }

    showUploadedFiles(selectedDemand: any) {
        this.showUploadedFilesEvent.emit(selectedDemand);
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


    onTabChange(tab: any) {
        console.log("x :", this.selectedNavItem);
        
        if (tab.key == 'expense') {
            this.selectedNavItem = tab.key;
            this.otherComponent = true;
        } else {
            this.otherComponent = false;
            this.getMyDemands(tab.key);
        }

    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
