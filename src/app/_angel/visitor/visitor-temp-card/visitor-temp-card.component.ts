import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { TempCardComponent } from '../visitors/temp-card/temp-card.component';
import { AddTempCardComponent } from '../visitors/temp-card/add-temp-card/add-temp-card.component';

@Component({
    selector: 'app-visitor-temp-card',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TooltipModule,
        TempCardComponent,
        AddTempCardComponent,
    ],
    templateUrl: './visitor-temp-card.component.html',
    styleUrl: './visitor-temp-card.component.scss'
})
export class VisitorTempCardComponent implements OnInit, OnDestroy {
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
