import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { SignalrPatrolService } from '../signalr-patrol.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { Subject, takeUntil } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';



export const MY_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'yyyy-MM-dd' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override  parse(value: any): Date | null {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = +parts[0];
      const month = +parts[1] - 1;
      const year = +parts[2];
      return new Date(year, month, day);
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${this._to2digit(day)}/${this._to2digit(month)}/${year}`;
  }

  private _to2digit(n: number) {
    return ('0' + n).slice(-2);
  }
}


@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})

export class ToursComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  formattedDate: string = '';
  selectedDate: Date = new Date();
  dateControl = new FormControl();
  activeWidget: number = 0;
  tour_s: any[] = [];
  tour_sd: any[] = [];

  dailyGuardTour: any[] = [];
  dailyGuardTour2: any[] = [];
  atilan: any[] = [];
  atilmayan: any[] = [];
  atilacak: any[] = [];
  widgets: any;
  alarmlar: any[] = [];
  olaylar: any[] = [];

  widgetTitle: string = "";
  widgetData: any[] = [];
  widgetDetailModal: boolean = false;
  selectLocationId: number;


  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private signalRService: SignalrPatrolService,
    private helperService: HelperService

  ) { }

  ngOnInit(): void {

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    });
    this.dailyGuardTourCheck(this.formattedDate);
    this.dailyGuardTourDetail(this.formattedDate, this.selectLocationId);
  }

  updateWidgets() {
    this.widgets = [
      { title: 'Planlanan Turlar', value: this.dailyGuardTour?.length, index: 0,  icon: 'fa-solid fa-calendar'},
      { title: 'Atılan Turlar', value: this.atilan?.length, index: 1,  icon: 'fa-solid fa-route'},
      { title: 'Atılmayan Turlar', value: this.atilmayan?.length, index: 2,  icon: 'fa-solid fa-user-xmark'},
      { title: 'Atılacak Turlar', value: this.atilacak?.length, index: 3,  icon: 'fa-solid fa-person-walking-arrow-right'},
      { title: 'Alarmlar', value: this.alarmlar?.length, index: 4,  icon: 'fa-solid fa-volume-high'},
      { title: 'Olaylar', value: this.olaylar?.length, index: 5,  icon: 'fa-solid fa-bell'},
    ];
  }

  openWidget(widget: any) {

    switch (widget.index) {
      case 0: this.widgetData = this.dailyGuardTour; break; // Planlanan Turlar
      case 1: this.widgetData = this.atilan; break; // Atılan Turlar
      case 2: this.widgetData = this.atilmayan; break; // Atılmayan Turlar
      case 3: this.widgetData = this.atilacak; break; // Atılacak Turlar
      case 4: this.widgetData = this.alarmlar; break; // Alarmlar
      case 5: this.widgetData = this.olaylar; break; // Olaylar
      default: this.widgetData = [];
    }
    console.log("openWidget", widget);
    this.widgetTitle = widget.title;
    this.widgetDetailModal = true;
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
  
  dailyGuardTourCheck(date: any) {
    this.patrol.dailyGuardTourCheck(date).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.dailyGuardTour = response[0]?.x;

      this.atilmayan = (this.dailyGuardTour ?? []).filter((item: any) => item.durum === 0)
      this.atilan = (this.dailyGuardTour ?? []).filter((item: any) => item.durum === 1)
      this.atilacak = (this.dailyGuardTour ?? []).filter((item: any) => item.durum === 2)

      this.updateWidgets();
      this.ref.detectChanges();
    })

  }

    dailyGuardTourDetail(date: any, locationid: number) {
      this.patrol.tour_s(date, locationid)?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.tour_s = response[0]?.x;
        console.log("this.tour_s", this.tour_s);
      })
      this.patrol.tour_sd(date, locationid)?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.tour_sd = response[0]?.x;
        console.log("this.tour_sd........sd", this.tour_sd);
      })
    }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

