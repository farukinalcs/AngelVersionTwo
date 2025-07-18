import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { PatrolService } from '../patrol.service';
import { Subject, takeUntil } from 'rxjs';
import { ColDef, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { FirstDataRenderedEvent } from 'ag-grid-community';
import { ProfileService } from '../../profile/profile.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistryCardComponent } from '../../shared/registry-list/registry-card/registry-card.component';
import { RegistryListComponent } from '../../shared/registry-list/registry-list.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-security-guards',
    standalone: true,
    imports: [
        CommonModule,
        RegistryCardComponent,
        RegistryListComponent,
        TranslateModule,
        TooltipModule
    ],
    templateUrl: './security-guards.component.html',
    styleUrls: ['./security-guards.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})

export class SecurityGuardsComponent implements OnInit {
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
    userdef: string = "9";
    constructor(
        private patrol: PatrolService,
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

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}

