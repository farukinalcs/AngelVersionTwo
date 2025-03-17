import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { VisitorGridComponent } from './visitor-grid/visitor-grid.component';
import { BannedVisitorComponent } from './banned-visitor/banned-visitor.component';
import { AddBannedVisitorComponent } from './banned-visitor/add-banned-visitor/add-banned-visitor.component';
import { UpdateBannedVisitorComponent } from './banned-visitor/update-banned-visitor/update-banned-visitor.component';
import { TempCardComponent } from './temp-card/temp-card.component';
import { AddTempCardComponent } from './temp-card/add-temp-card/add-temp-card.component';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TooltipModule,
    VisitorGridComponent,
    BannedVisitorComponent,
    AddBannedVisitorComponent,
    UpdateBannedVisitorComponent,
    TempCardComponent,
    AddTempCardComponent
  ],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.scss'
})
export class VisitorsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  selectedTab: any = {};
  loading: boolean = false;
  tabList = [
    { name: this.translateService.instant('Ziyaretçi_Listesi'), type: '1' },
    { name: this.translateService.instant('Yasak_Ziyaretçi_Listesi'), type: '2' },
    { name: this.translateService.instant('Geçici_Kart_Listesi'), type: '3' }
  ];
  displayAddBanned: boolean = false;
  selectedBanned: any;
  displayUpdateBanned: boolean = false;
  refresh: boolean = false;
  displayAddCard: boolean = false;

  constructor(
    private translateService: TranslateService
  ) {}
  
  ngOnInit(): void {
    this.selectedTab = this.tabList[0];
    
  }


  changeTab(menu: any) {
    this.selectedTab = menu;
  }

  visibleAddBanned() {
    this.displayAddBanned = !this.displayAddBanned;
  }


  visibleUpdateBanned() {
    this.displayUpdateBanned = !this.displayUpdateBanned
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
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
