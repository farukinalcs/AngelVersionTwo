import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

interface CalendarDay {
  tid: number;
  RAciklama: string;
  ggiris: string | null;
  gcikis: string | null;
  haftagunu: string;
  Gosterge: string;
  Goster: string;
  sira: number;
  Gun: string;
  RTarih: string;
  Tarih: string;
  Mesaibirimi: string;
  mAciklama: string;
  iAciklama: string;
  Renk: string;
  ay: number;
  iceridestr: string;
  disaridastr: string;
}

interface MonthlyCalendar {
  monthName: string;
  days: CalendarDay[];
}

@Component({
  selector: 'app-annual-calendar',
  templateUrl: './annual-calendar.component.html',
  styleUrls: ['./annual-calendar.component.scss']
})
export class AnnualCalendarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() displayAnnualCalendar: boolean;
  @Input() personInfo: any;
  @Output() annualCalendarHideEvent: EventEmitter<void> = new EventEmitter<void>();
  calendar: { [key: number]: MonthlyCalendar } = {};
  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  vacationRight: any;

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log("Kişi Bilgisi Geldi : ", this.personInfo);
    this.getAnnualCalendarData();
    this.getVacationRight();
  }

  hideAnnualCalendar() {
    this.annualCalendarHideEvent.emit();
  }

  getAnnualCalendarData() {
    var sp: any[] = [{
      mkodu: 'yek106',
      id: this.personInfo.data.sicilid.toString(),
      yil: this.personInfo.value.split('-')[0]
    }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        this.calendar = this.groupByMonth(data);
        console.log('Annual Calendar Data: ', this.calendar);
        this.ref.detectChanges();

        this.isLoading.next(false);
      });
  }

  groupByMonth(data: CalendarDay[]): { [key: number]: MonthlyCalendar } {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const groupedData: { [key: number]: MonthlyCalendar } = {};

    data.forEach(day => {
      const month = day.ay;
      if (!groupedData[month]) {
        groupedData[month] = {
          monthName: monthNames[month - 1],
          days: []
        };
      }
      groupedData[month].days.push(day);
    });

    return groupedData;
  }

  objectValues(obj: any): any[] {
    return Object.values(obj);
  }

  getVacationRight() {
    var sp: any[] = [{
      mkodu: 'yek107',
      sicilid: this.personInfo.data.sicilid.toString(),
      izintip: '3'
    }];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log('Vacation Right: ', data);
      this.vacationRight = data[0];

      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
