import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MyPermissions } from 'src/app/_angel/profile/models/myPermissions';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.scss'
})
export class LeavesComponent implements OnInit, OnDestroy {
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
  
  years: number[] = []; // Gerektiğinde yılları güncelleyin
  selectedMonth: string;
  selectedYear: number;
  
  month: string;
  year: number;
  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isSelected: boolean = false;
  dialogRef: any;


  displayedColumns : string[] = ['aciklama', 'baslangic', 'bitis', 'saatlikGunluk', 'gunSayisi'];

  myPermissions : any[] = [];
  constructor(
    private profilService : ProfileService,
    private translateService : TranslateService,
    private dialog : MatDialog,
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
    this.getMyPermissions(this.getMonthIndex(this.month) + 1, this.year);

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

    this.getMyPermissions(this.getMonthIndex(this.month) + 1, this.year);
  }

  goToNext() {
    // Ayı bir sonraki aya güncelle
    const sonrakiAy = new Date(this.year, this.getMonthIndex(this.month) + 1, 1);
    this.month = this.getMonthName(sonrakiAy.getMonth());
    this.year = sonrakiAy.getFullYear();
    
    this.getMyPermissions(this.getMonthIndex(this.month) + 1, this.year);
  }

  getMonthIndex(month: string): number {
    // Ay ismini kullanarak ayın indeksini döndür
    return this.months.indexOf(month);
  }

  getMyPermissions(month : any, year : any) {
    let yearMonth = year + "-" + month.toString().padStart(2, '0');
    console.log(yearMonth);
    
    this.myPermissions = [];
    this.isSelected = false;

    this.profilService.getMyPermissions(yearMonth).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyPermissions, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      console.log("İzinlerim : ", data);
      this.myPermissions = data;  
      
      this.isLoading.next(false);
      

      this.ref.detectChanges();
    })
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
    this.getMyPermissions(monthIndex + 1, this.selectedYear);

    this.dialogRef.close();
    this.ref.detectChanges();
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}