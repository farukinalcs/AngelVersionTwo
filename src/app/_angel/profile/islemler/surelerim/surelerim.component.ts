import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LoaderService } from 'src/app/_helpers/loader.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { DurationsMobileModel } from '../../models/durationsMobile';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-surelerim',
  templateUrl: './surelerim.component.html',
  styleUrls: ['./surelerim.component.scss']
})
export class SurelerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('datepickerDialog') datepickerDialog: TemplateRef<any>;

  months: string[] = [
    this.translateService.instant("Ocak"),
    this.translateService.instant("Şubat"),
    this.translateService.instant("Mart"),
    this.translateService.instant("Nisan"),
    this.translateService.instant("Mayıs"),
    this.translateService.instant("Haziran"),
    this.translateService.instant("Temmuz"),
    this.translateService.instant("Ağustos"),
    this.translateService.instant("Eylül"),
    this.translateService.instant("Ekim"),
    this.translateService.instant("Kasım"),
    this.translateService.instant("Aralık")
  ];
  
  years: number[] = [];
  selectedMonth: string;
  selectedYear: number;
  
  month: string;
  year: number;
  durationsMobile: DurationsMobileModel[] = [];
  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isSelected: boolean = false;
  dialogRef: any;


  constructor(
    private profilService : ProfileService,
    private translateService : TranslateService,
    public loaderService : LoaderService,
    private dialog : MatDialog,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    for (let i = currentYear - 4; i <= currentYear + 1; i++) {
      this.years.push(i);
    }

    // İlk olarak mevcut ay ve yıl değerlerini ata
    const bugun = new Date();
    this.month = this.getMonthName(bugun.getMonth());
    this.year = bugun.getFullYear();
    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  getMonthName(ayIndex: number): string {
    // Ay ismini döndür
    return this.months[ayIndex];
  }// "2023-06" istek atma

  goToBack() {
    // Ayı bir önceki aya güncelle
    const oncekiAy = new Date(this.year, this.getMonthIndex(this.month) - 1, 1);
    this.month = this.getMonthName(oncekiAy.getMonth());
    this.year = oncekiAy.getFullYear();

    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  goToNext() {
    // Ayı bir sonraki aya güncelle
    const sonrakiAy = new Date(this.year, this.getMonthIndex(this.month) + 1, 1);
    this.month = this.getMonthName(sonrakiAy.getMonth());
    this.year = sonrakiAy.getFullYear();
    
    this.getDurationsMobile(this.getMonthIndex(this.month) + 1, this.year);
  }

  getMonthIndex(month: string): number {
    // Ay ismini kullanarak ayın indeksini döndür
    return this.months.indexOf(month);
  }


  getDurationsMobile(month : any, year : any) {
    let yearMonth = year + "-" + month.toString().padStart(2, '0');
    console.log(yearMonth);
    
    this.durationsMobile = [];
    this.isSelected = false;

    this.profilService.getDurationsMobile(yearMonth).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<DurationsMobileModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      
      // this.durationsMobile = data;
      this.sortDataByDate(data);
      console.log("Sürelerim Mobil Puantaj :", this.durationsMobile);

      this.isLoading.next(false);
      this.ref.detectChanges();
    });
    
  }

  sortDataByDate(data: any[]): void {
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    // Verileri tarih sırasına göre sırala
    data.sort((a, b) => {
      const dateA = parseDate(a.tarih).getTime();
      const dateB = parseDate(b.tarih).getTime();
      return dateA - dateB;
    });

    this.durationsMobile = data;
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.datepickerDialog, {
      disableClose: true
    });
  }

  selectMonth(item : any) {
    this.selectedMonth = item;
    this.isSelected = true;
  }

  selectYear(item : any) {
    this.selectedYear = item;
    this.month = this.selectedMonth;
    this.year = this.selectedYear;

    let monthIndex = this.getMonthIndex(this.selectedMonth);
    this.getDurationsMobile(monthIndex + 1, this.selectedYear);

    this.dialogRef.close();
    this.ref.detectChanges();
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}
