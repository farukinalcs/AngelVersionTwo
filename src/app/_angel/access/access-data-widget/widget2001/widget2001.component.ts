import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget2001',
  templateUrl: './widget2001.component.html',
  styleUrls: ['./widget2001.component.scss']
})
export class Widget2001Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent: EventEmitter<GridsterItem>;

  resizeSub: Subscription;

  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns : string[] = ['fotoimage', 'ad', 'olayzamani', 'cihaz', 'OlayAciklama']; 
  dataSource :MatTableDataSource<any>;
  
  olaylar : any[] = [
    {fotoimage : '1', ad : 'Test1', olayzamani : '58', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '2', ad : 'Test2', olayzamani : '85', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '3', ad : 'Test3', olayzamani : '78', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '4', ad : 'Test4', olayzamani : '57', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '5', ad : 'Test5', olayzamani : '354', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '6', ad : 'Test6', olayzamani : '45', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '7', ad : 'Test7', olayzamani : '545', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '8', ad : 'Test8', olayzamani : '45', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '9', ad : 'Test9', olayzamani : '54', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
    {fotoimage : '10', ad : 'Test10', olayzamani : '55', cihaz : 'TestCihaz', OlayAciklama : 'TestOlayAciklama'},
  ];
  constructor() { }

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe(widget => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        
      }

    });

    this.dataSource = new MatTableDataSource(this.olaylar);
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
