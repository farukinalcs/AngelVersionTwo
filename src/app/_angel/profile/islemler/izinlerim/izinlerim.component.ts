import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { MyPermissions } from '../../models/myPermissions';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-izinlerim',
  templateUrl: './izinlerim.component.html',
  styleUrls: ['./izinlerim.component.scss']
})
export class IzinlerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  displayedColumns : string[] = ['aciklama', 'baslangic', 'bitis', 'saatlikGunluk', 'gunSayisi'];
  dataSource : MatTableDataSource<any>;

  myPermissions : any[] = [];
  constructor(
    private profilService : ProfileService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.getMyPermissions('1');
  }

  getMyPermissions(event : any) {
    let zamanAralik : any = '1';

    if (event.tab) {
      if (event.tab.textLabel == 'Günlük' || event.tab.textLabel == 'Daily') {
        zamanAralik = '1';
      } else if (event.tab.textLabel == 'Haftalık' || event.tab.textLabel == 'Weekly') {
        zamanAralik = '7';
      } else if (event.tab.textLabel == 'Aylık' || event.tab.textLabel == 'Monthly') {
        zamanAralik = '30';
      }
    }

    this.profilService.getMyPermissions(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyPermissions, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      console.log("İZİNLERİM : ", data);
      this.myPermissions = data;  

      this.dataSource = new MatTableDataSource(this.myPermissions);
      

      this.ref.detectChanges();
    })
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
