import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { Durations } from '../../models/durations';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-surelerim',
  templateUrl: './surelerim.component.html',
  styleUrls: ['./surelerim.component.scss']
})
export class SurelerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns : string[] = ['tarih', 'girisCikis', 'normalSure', 'araSure', 'izinSure', 'fazlaSure', 'eksikSure']; 
  dataSource :MatTableDataSource<any>;
  
  durations : any[] = [];
  constructor(
    private profilService : ProfileService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDurations('1');

  }

  getDurations(event : any) {
    let zamanAralik : any = '1';

    if (event.tab) {
      if (event.tab.textLabel == 'Bugün') {
        zamanAralik = '1';
      } else if (event.tab.textLabel == 'Hafta') {
        zamanAralik = '7';
      } else if (event.tab.textLabel == 'Ay') {
        zamanAralik = '30';
      }
    }

    this.profilService.getDurations(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<Durations, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      console.log("SÜRELERİM :", data);
      this.durations = data;

      this.dataSource = new MatTableDataSource(this.durations);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;  
      
      this.ref.detectChanges();
    });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}
