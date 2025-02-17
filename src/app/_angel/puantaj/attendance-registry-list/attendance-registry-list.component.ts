import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, IRowNode, IsRowSelectable, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { AttendanceService } from '../attendance.service';
import { ToastrService } from 'ngx-toastr';

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
  requestTime: any;
  refreshEvent: boolean = false;
  displayAssignPeriod: boolean= false;
  periods: any[]= [];
  selectedPeriod: any;
  periodStartDate: any;
  displayOvertimeForm: boolean = false;
  selectedRegistry: any[] = [];
  displayVacationForm: boolean = false;
  filterEvent: boolean = false;
  bulkChangeEvent: boolean = false;
  loadingProgress: number = 0;
  completedRequests: number = 0;
  totalRequests: number = 0;
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private attendanceService: AttendanceService,
    private toastrService : ToastrService

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

  closeRegistryCard(event:any) {
    this.displayRegistryCard = event;
  }

  getRequestTime(event: any) {
    this.requestTime = event;
  }

  refreshList() {
    this.refreshEvent = !this.refreshEvent;
  }

  getSelectedRows() {
    this.attendanceService.getSelectedItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      console.log("Sicil Listesinde Siciller Geldi : ", items);
      
      if (items.length == 0) {
        this.toastrService.warning(
          this.translateService.instant("Sicil_Veya_Siciller_Seçiniz"),
          this.translateService.instant("Uyarı")
        )
        this.closeAssignPeriod();
        return;
      }

      this.selectedRegistry = [...items];
    });

  }

  openAssignPeriod() {
    this.displayAssignPeriod = true;
    this.getSelectedRows();
    this.getPeriods();
  }

  closeAssignPeriod() {
    this.displayAssignPeriod = false;
  }

  sendRequest() {
    // Toplam istek sayısını belirle
    this.totalRequests = this.selectedRegistry.length;
    this.completedRequests = 0;
    this.loadingProgress = 0;

    this.selectedRegistry.forEach((registery:any) => {
      this.assignPeriod(registery);
    });
  }
  
  assignPeriod(registry:any) {
    var sp: any[] = [
      {
        mkodu: 'yek251',
        Tarih: this.periodStartDate,
        PeriyodID: this.selectedPeriod.ID.toString(),
        SicilID: registry.Id.toString(),
        baslangicgunu: '1'
      }
    ];

    console.log("Periyot Ata Param: ", sp);
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.periods = [...data];
      console.log("Mesai Periyodu Atandı :", data);

      // Tamamlanan istek sayısını artır
      this.completedRequests++;

      // Yüzde hesapla
      this.loadingProgress = Math.round((this.completedRequests / this.totalRequests) * 100);
    
      console.log(`Yükleme Durumu: ${this.loadingProgress}%`);
    });
  }

  getPeriods() {
    var sp: any[] = [
      { mkodu: 'yek041', kaynak: 'cbo_mesaiperiyodlari', id: '0' }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.periods = [...data];
      console.log("Mesai Periyotları Geldi :", data);
      
    });
  }

  openOvertimeForm() {
    this.displayOvertimeForm = true;
  }

  onHideOvertimeForm() {
    this.displayOvertimeForm = false;
  }

  openVacationForm() {
    this.displayVacationForm = true;
  }

  onHideVacationForm() {
    this.displayVacationForm = false;
  }

  onFilter() {
    this.filterEvent = !this.filterEvent;
  }

  onClickBulkChange() {
    this.bulkChangeEvent = !this.bulkChangeEvent;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.attendanceService.setSelectedItems([]);
  }
}
