import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AddTempCardComponent } from '../../visitor/visitors/temp-card/add-temp-card/add-temp-card.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { TempCardComponent } from '../../visitor/visitors/temp-card/temp-card.component';

@Component({
    selector: 'app-access-temp-card',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TooltipModule,
        TempCardComponent,
        AddTempCardComponent,
    ],
    templateUrl: './access-temp-card.component.html',
    styleUrl: './access-temp-card.component.scss'
})
export class AccessTempCardComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    selectedTab: any = {};
    loading: boolean = false;
    tabList = [
        { name: this.translateService.instant('Geçici_Kart_Listesi'), type: '3' }
    ];
    selectedBanned: any;
    refresh: boolean = false;
    displayAddCard: boolean = false;
    selectedVisitor: any;

    constructor(
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.selectedTab = this.tabList[0];

    }


    changeTab(menu: any) {
        this.selectedTab = menu;
    }



    getSelectedBanned(event: any) {
        this.selectedBanned = event;
    }

    refreshToggle() {
        this.refresh = !this.refresh;
    }


    visibleAddCard() {
        this.displayAddCard = !this.displayAddCard;

    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case 'F8':
                this.visibleAddCard();
                break;
        }
    }

    getSelectedVisitor(event: any) {
        this.selectedVisitor = event;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}