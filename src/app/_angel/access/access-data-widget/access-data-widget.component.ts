import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterPush, GridType } from 'angular-gridster2';
import { Subject, takeUntil } from 'rxjs';
import { AccessService } from '../access.service';

@Component({
  selector: 'app-access-data-widget',
  templateUrl: './access-data-widget.component.html',
  styleUrls: ['./access-data-widget.component.scss']
})
export class AccessDataWidgetComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  @ViewChild("fullScreen") divRef : any;

  options1: GridsterConfig;
  dashboard1: GridsterItem[];

  options2: GridsterConfig;
  dashboard2: GridsterItem[];

  itemToPush: GridsterItemComponent;
  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  removeItems1 : any[] = [];
  removeItems2 : any[] = [];

  alarmlar: any[] = [];
  sonIslemler: any[] = [];
  mesaiBit: any[] = [];
  kesikCihazlar: any[] = [];
  iceridekiler: any[] = [];
  
  constructor(
    private accessService : AccessService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.dashboardHeaderOptions();
    this.dashboardBodyOptions();
    this.getAccessDashboardHeader();
  }

  dashboardHeaderOptions() {
    this.options1 = {
      displayGrid: DisplayGrid.OnDragAndResize,
      gridType: GridType.Fixed,
      addEmptyRowsCount: 50,
      minCols : 1,
      maxCols : 79,
      minRows : 1,
      maxRows : 10,
      maxItemCols: 26,
      minItemCols: 26,
      maxItemRows: 5,
      minItemRows: 5,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 4,
      setGridSize: false,
      fixedColWidth: 5,
      fixedRowHeight: 15,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: true,
      },
      itemResizeCallback: item => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      }
    };

    this.dashboard1 = [
      { cols: 26, rows: 5, y: 0, x: 0 ,type: 'İçerideki Personel Sayısı', class: 'card-header bg-primary', mkodu: 'yek001' },
      { cols: 26, rows: 5, y: 0, x: 26 ,type: 'İçerideki Ziyaretçi Sayısı', class: 'card-header bg-warning', mkodu: '' },
      { cols: 26, rows: 5, y: 0, x: 52 ,type: 'İçerideki Cihazlara Gönderilen Son 100 İşlem', class: 'card-header bg-info', mkodu: 'yek004' },
      { cols: 26, rows: 5, y: 6, x: 0 ,type: 'İletişimi Kesik Cihaz Sayısı', class: 'card-header bg-success', mkodu: 'yek002' },
      { cols: 26, rows: 5, y: 6, x: 27 ,type: 'Alarm Sayısı', class: 'card-header bg-danger', mkodu: 'yek005' }, 
      { cols: 26, rows: 5, y: 6, x: 53 ,type: 'Mesaisi Bitip Çıkmayan Personel Sayısı', class: 'card-header bg-dark', mkodu: 'yek003'},
    ];
  }

  dashboardBodyOptions() {
    this.options2 = {
      displayGrid: DisplayGrid.OnDragAndResize,
      gridType: GridType.Fixed,
      addEmptyRowsCount: 50,
      minCols : 1,
      maxCols : 1000000000000000000,
      minRows : 1,
      maxRows : 1000000000000000000,
      maxItemCols: 1000000000000000000,
      minItemCols: 2,
      maxItemRows: 1000000000000000000,
      minItemRows: 2,
      maxItemArea: 1000000000000000000,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 4,
      setGridSize: false,
      fixedColWidth: 5,
      fixedRowHeight: 15,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      itemResizeCallback: item => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      }
    };

    this.dashboard2 = [
      { cols: 30, rows: 17, y: 0, x: 0 ,type:  'İçerideki Kişi Sayısı' },
      { cols: 52, rows: 17, y: 0, x: 30 ,type: 'Geçişler' },
      { cols: 78, rows: 14, y: 15, x: 28 ,type: 'Kapı İşlemleri'},
      { cols: 52, rows: 15, y: 31, x: 15 ,type: 'Olaylar' },
    ];
  }
  
  removeItem1(item : any) {
    this.dashboard1.splice(this.dashboard1.indexOf(item), 1);
    this.removeItems1.push(item)
  }

  removeItem2(item : any) {
    this.dashboard2.splice(this.dashboard2.indexOf(item), 1);
    this.removeItems2.push(item);
  }

  addItem1(item : any) {
    this.dashboard1.push(item)
    this.removeItems1.splice(this.removeItems1.indexOf(item), 1)
  }

  addItem2(item : any) {
    this.dashboard2.push(item)
    this.removeItems2.splice(this.removeItems2.indexOf(item), 1)
  }


  initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
    this.itemToPush = itemComponent;
  }

  getAccessDashboardHeader() {
    this.accessService.getAccessDashboardHeader(this.dashboard1).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      console.log("Access Dashboard Header Response : ", response);

      response.forEach((item : any) => {
        if (item.k == 'yek001') {
          this.iceridekiler = item.x;        

        } else if (item.k == 'yek002') {
          this.kesikCihazlar = item.x;        
          
        } else if (item.k == 'yek003') {
          this.mesaiBit = item.x;        

        } else if (item.k == 'yek004') {
          this.sonIslemler = item.x;        

        } else if (item.k == 'yek005') {
          this.alarmlar = item.x;        
        }

      });

      this.ref.detectChanges();
    })
  }


  
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
