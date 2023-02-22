import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterPush, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-access-data-widget',
  templateUrl: './access-data-widget.component.html',
  styleUrls: ['./access-data-widget.component.scss']
})
export class AccessDataWidgetComponent implements OnInit {
  @ViewChild("fullScreen") divRef : any;

  options1: GridsterConfig;
  dashboard1: GridsterItem[];

  options2: GridsterConfig;
  dashboard2: GridsterItem[];

  itemToPush: GridsterItemComponent;
  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  removeItems1 : any[] = [];
  removeItems2 : any[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.dashboardHeaderOptions();
    this.dashboardBodyOptions();
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

    this.dashboard1 = [
      { cols: 26, rows: 5, y: 0, x: 0 ,type: 'İçerideki Personel Sayısı' },
      { cols: 26, rows: 5, y: 0, x: 26 ,type: 'İçerideki Ziyaretçi Sayısı' },
      { cols: 26, rows: 5, y: 0, x: 52 ,type:  'İçerideki Cihazlara Gönderilen Son 100 İşlem' },
      { cols: 26, rows: 5, y: 6, x: 0 ,type: 'İletişimi Kesik Cihaz Sayısı' },
      { cols: 26, rows: 5, y: 6, x: 27 ,type: 'Alarm Sayısı' }, 
      { cols: 26, rows: 5, y: 6, x: 53 ,type: 'Mesaisi Bitip Çıkmayan Personel Sayısı'},
    ];
  }

  dashboardBodyOptions() {
    this.options2 = {
      displayGrid: DisplayGrid.OnDragAndResize,
      gridType: GridType.Fixed,
      addEmptyRowsCount: 50,
      minCols : 1,
      maxCols : 200,
      minRows : 1,
      maxRows : 200,
      maxItemCols: 260,
      minItemCols: 2,
      maxItemRows: 250,
      minItemRows: 2,
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
      { cols: 50, rows: 15, y: 0, x: 28 ,type: 'Geçişler' },
      { cols: 28, rows: 15, y: 0, x: 0 ,type:  'İçerideki Kişi Sayısı' },
      { cols: 78, rows: 14, y: 12, x: 28 ,type: 'Kapı İşlemleri' },
      { cols: 52, rows: 15, y: 29, x: 15 ,type: 'Olaylar' },
    ];
  }
  
  removeItem1($event : any, item : any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard1.splice(this.dashboard1.indexOf(item), 1);

    this.removeItems1.push(item)
  }

  removeItem2($event : any, item : any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard2.splice(this.dashboard2.indexOf(item), 1);

    this.removeItems2.push(item);
    //
    //
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

}
