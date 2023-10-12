import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { DialogLokasyonDetayComponent } from './dialog-lokasyon-detay/dialog-lokasyon-detay.component';

@Component({
  selector: 'app-mobillokasyon',
  templateUrl: './mobillokasyon.component.html',
  styleUrls: ['./mobillokasyon.component.scss'],
})
export class MobillokasyonComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns : string[] = ['id', 'harita', 'yerAd', 'adSoyad', 'eventTime', 'IO', 'adres']; 
  dataSource :MatTableDataSource<any>;
  locations : any[] = [];
  

  constructor(
    private dialog : MatDialog,
    private profileService : ProfileService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.getLocation();
    this.dataSource = new MatTableDataSource(this.locations);
    this.dataSource.paginator = this.paginator;
  }

  getLocation() {
    this.profileService.getLocations().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      console.log("Mobil Lokasyon :", response);
      
      
      this.ref.detectChanges();
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogLokasyonDetayComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  



  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
