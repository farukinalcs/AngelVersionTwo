import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget2004',
  templateUrl: './widget2004.component.html',
  styleUrls: ['./widget2004.component.scss']
})
export class Widget2004Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent: EventEmitter<GridsterItem>;

  resizeSub: Subscription;

  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns : string[] = ['kapiAdi', 'durum','islemZamani', 'btn1', 'btn2', 'btn3', 'btn4']; 
  dataSource :MatTableDataSource<any>;

  kapiIslemleri : any[] = [
    {'KapiAdi' : '1. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '09-08-2021 09:50:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},
    {'KapiAdi' : '2. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '30-08-2021 09:50:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},
    {'KapiAdi' : '3. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '25-08-2021 09:50:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},
    {'KapiAdi' : '4. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '01-08-2021 09:50:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},
    {'KapiAdi' : '5. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '12-08-2021 09:50:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},
    {'KapiAdi' : '6. Kat Çıkış', 'durum' : 'Kapalı', 'IslemZamani' : '12-08-2021 18:54:50', 'btn1' : 'Açık', 'btn2' : 'Kart Okutma', 'btn3' : 'Kilitli', 'btn4' : 'Geçiş'},

  ];
  
  constructor() { }

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe(widget => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        
      }

    });

    this.dataSource = new MatTableDataSource(this.kapiIslemleri);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }


}
