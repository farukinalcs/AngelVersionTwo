import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { TranslationService } from 'src/app/modules/i18n';
import { LayoutService } from 'src/app/_metronic/layout';
import { MyIncompleteTimeModel } from '../../models/myIncompleteTime';
import { ProfileService } from '../../profile.service';


@Component({
  selector: 'app-eksik-surelerim',
  templateUrl: './eksik-surelerim.component.html',
  styleUrls: ['./eksik-surelerim.component.scss']
})
export class EksikSurelerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();


  timeRange : any[] = [
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.BIR_GUN'), value : '1'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.UC_GUN'), value : '3'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.BIR_HAFTA'), value : '7'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.IKI_HAFTA'), value : '14'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.BIR_AY'), value : '30'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.IKI_AY'), value : '60'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.ALTI_AY'), value : '180'},
    {text : this.translateService.instant('EKSIK_SURE.ZAMAN_ARALIK.BIR_YIL'), value : '365'}
  ]

  incompleteTimes : any[] = [];
  selectedTime : any;


  displayedColumns : string[] = ['aciklama', 'eksiksure', 'mesaitarih', 'ggiris', 'gcikis'];
  dataSource : MatTableDataSource<any>;

  filterText : string = '';
  constructor(
    private profileService : ProfileService,
    private translationService : TranslationService,
    private translateService : TranslateService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) {}


  ngOnInit(): void {    
    this.getIncompleteTimes('1');
  }

  timeRangeChangeLang() {
    this.translationService.langObs.subscribe((item) => {
      if (item == 'en') {
        this.timeRange[0].text = '1 Day';
        this.timeRange[1].text = '3 Day';
        this.timeRange[2].text = '1 Week';
        this.timeRange[3].text = '2 Week';
        this.timeRange[4].text = '1 Month';
        this.timeRange[5].text = '2 Month';
        this.timeRange[6].text = '6 Month';
        this.timeRange[7].text = '1 Year';
      }
    });
  }

  onDropdownChange(event : any) {
    const selectedValue = event.value;
    console.log(selectedValue);
    this.getIncompleteTimes(selectedValue.value);
  }

  getIncompleteTimes(zamanAralik : string) {
    this.profileService.getIncompleteTimes(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<MyIncompleteTimeModel, ResponseDetailZ>[]) => {
      const data : MyIncompleteTimeModel[] = response[0].x;
      this.incompleteTimes = data;
      this.dataSource = new MatTableDataSource(this.incompleteTimes);
      console.log("Eksik Sürelerim :", data);

      this.ref.detectChanges();
    });
  }

  applyFilter(event : Event){
    const filterValue  = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
