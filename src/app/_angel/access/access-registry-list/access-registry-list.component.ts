import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { CommonModule } from '@angular/common';
import { RegistryCardComponent } from '../../shared/registry-list/registry-card/registry-card.component';
import { RegistryListComponent } from '../../shared/registry-list/registry-list.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-access-registry-list',
    standalone: true,
    imports: [
        CommonModule,
        RegistryCardComponent,
        RegistryListComponent,
        TranslateModule,
        TooltipModule
    ],
    templateUrl: './access-registry-list.component.html',
    styleUrls: ['./access-registry-list.component.scss']
})
export class AccessRegistryListComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();


    loading: boolean = false;
    tabList = [
        { name: this.translateService.instant('Aktifler'), type: '1' },
        { name: this.translateService.instant('İşten_Çıkanlar'), type: '2' },
        { name: this.translateService.instant('Yasaklılar'), type: '3' },
        { name: this.translateService.instant('Program_Kullanıcıları'), type: '4' },
        { name: this.translateService.instant('Hepsi'), type: '0' },
    ];
    selectedTab: any;
    clear: boolean = false;
    displayRegistryCard: boolean = false;
    filterEvent: boolean = false;
    requestTime: any;
    refreshEvent: boolean = false;
    detail: boolean = false;
    bulkChangeEvent: boolean = false;

    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef
    ) {
        this.selectedTab = this.tabList[0];
    }

    ngOnInit(): void {
    }

    changeTabMenu(menu: any) {
        this.selectedTab = menu;
    }

    loadingEvent(event: any) {
        console.log("Event Geldi : ", event);
        this.loading = event;
        this.ref.detectChanges();
    }

    clearFilters() {
        this.clear = !this.clear;
    }

    showRegistryCard() {
        this.displayRegistryCard = true;
    }

    closeRegistryCard(event: any) {
        this.displayRegistryCard = event;
    }

    onFilter() {
        this.filterEvent = !this.filterEvent;
    }

    getRequestTime(event: any) {
        this.requestTime = event;
    }

    refreshList() {
        this.refreshEvent = !this.refreshEvent;
    }

    onRegistry(event: any) {
        this.detail = !this.detail;
    }

    onClickBulkChange() {
        this.bulkChangeEvent = !this.bulkChangeEvent;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
