import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { Durations } from '../../models/durations';
import { DurationsMobileModel } from '../../models/durationsMobile';
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
  displayedColumns : string[] = ['tarih', 'giris', 'cikis', 'normalSure', 'araSure', 'izinSure', 'fazlaSure', 'eksikSure']; 
  dataSource :MatTableDataSource<any>;
  
  durations : any[] = [];

  month: string;
  year: number;
  isLoading: boolean = false;
  durationsMobile: DurationsMobileModel[] = [];
  constructor(
    private profilService : ProfileService,
    private tranlateService : TranslateService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.getDurations('1');

    // İlk olarak mevcut ay ve yıl değerlerini ata
    const bugun = new Date();
    this.month = this.getMonthName(bugun.getMonth());
    this.year = bugun.getFullYear();
    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  getMonthName(ayIndex: number): string {
    const aylar = [
      this.tranlateService.instant("PUBLIC.AYLAR.OCAK"),
      this.tranlateService.instant("PUBLIC.AYLAR.SUBAT"),
      this.tranlateService.instant("PUBLIC.AYLAR.MART"),
      this.tranlateService.instant("PUBLIC.AYLAR.NISAN"),
      this.tranlateService.instant("PUBLIC.AYLAR.MAYIS"),
      this.tranlateService.instant("PUBLIC.AYLAR.HAZIRAN"),
      this.tranlateService.instant("PUBLIC.AYLAR.TEMMUZ"),
      this.tranlateService.instant("PUBLIC.AYLAR.AGUSTOS"),
      this.tranlateService.instant("PUBLIC.AYLAR.EYLUL"),
      this.tranlateService.instant("PUBLIC.AYLAR.EKIM"),
      this.tranlateService.instant("PUBLIC.AYLAR.KASIM"),
      this.tranlateService.instant("PUBLIC.AYLAR.ARALIK")
    ];

    // Ay ismini döndür
    return aylar[ayIndex];
  }// "2023-06" istek atma

  goToBack() {
    // Ayı bir önceki aya güncelle

    this.isLoading = true;
    
    const oncekiAy = new Date(this.year, this.getMonthIndex(this.month) - 1, 1);
    this.month = this.getMonthName(oncekiAy.getMonth());
    this.year = oncekiAy.getFullYear();

    setTimeout(() => {
      this.isLoading = false; // Loading durumunu devre dışı bırak
    }, 200);

    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  goToNext() {
    // Ayı bir sonraki aya güncelle

    this.isLoading = true;
    
    const sonrakiAy = new Date(this.year, this.getMonthIndex(this.month) + 1, 1);
    this.month = this.getMonthName(sonrakiAy.getMonth());
    this.year = sonrakiAy.getFullYear();

    setTimeout(() => {
      this.isLoading = false; // Loading durumunu devre dışı bırak
    }, 200);
    
    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  getMonthIndex(month: string): number {
    // Ay ismini kullanarak ayın indeksini döndür
    const aylar = [
      this.tranlateService.instant("PUBLIC.AYLAR.OCAK"),
      this.tranlateService.instant("PUBLIC.AYLAR.SUBAT"),
      this.tranlateService.instant("PUBLIC.AYLAR.MART"),
      this.tranlateService.instant("PUBLIC.AYLAR.NISAN"),
      this.tranlateService.instant("PUBLIC.AYLAR.MAYIS"),
      this.tranlateService.instant("PUBLIC.AYLAR.HAZIRAN"),
      this.tranlateService.instant("PUBLIC.AYLAR.TEMMUZ"),
      this.tranlateService.instant("PUBLIC.AYLAR.AGUSTOS"),
      this.tranlateService.instant("PUBLIC.AYLAR.EYLUL"),
      this.tranlateService.instant("PUBLIC.AYLAR.EKIM"),
      this.tranlateService.instant("PUBLIC.AYLAR.KASIM"),
      this.tranlateService.instant("PUBLIC.AYLAR.ARALIK")
    ];
    
    return aylar.indexOf(month);
  }

  getDurations(event : any) {
    let zamanAralik : any = '30';

    if (event.tab) {
      if (event.tab.textLabel == 'Günlük' || event.tab.textLabel == 'Daily') {
        zamanAralik = '1';
      } else if (event.tab.textLabel == 'Haftalık' || event.tab.textLabel == 'Weekly') {
        zamanAralik = '7';
      } else if (event.tab.textLabel == 'Aylık' || event.tab.textLabel == 'Monthly') {
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

  getDurationsMobile(month : any, year : any) {
    let yearMonth = year + "-" + month.toString().padStart(2, '0');
    console.log(yearMonth);
    
    this.durationsMobile = [];

    this.profilService.getDurationsMobile(yearMonth).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<DurationsMobileModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      
      this.durationsMobile = data;
      console.log("Sürelerim Mobil Puantaj :", this.durationsMobile);

      this.ref.detectChanges();
    });
    
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}
