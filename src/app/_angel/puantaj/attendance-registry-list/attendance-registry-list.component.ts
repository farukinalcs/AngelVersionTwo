import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, IRowNode, IsRowSelectable, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-attendance-registry-list',
  templateUrl: './attendance-registry-list.component.html',
  styleUrls: ['./attendance-registry-list.component.scss']
})
export class AttendanceRegistryListComponent implements OnInit, OnDestroy {
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
  }

  clearFilters() {
    this.clear = !this.clear;
  }

  showRegistryCard() {
    this.displayRegistryCard = true;                    
  }

  closeRegistryCard(event:any) {
    this.displayRegistryCard = event;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
