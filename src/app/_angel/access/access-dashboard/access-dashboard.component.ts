import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-access-dashboard',
  templateUrl: './access-dashboard.component.html',
  styleUrls: ['./access-dashboard.component.scss']
})
export class AccessDashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  date = new Date();
  dashboardOptions: any[] = [
    {
      id: 1,
      label: this.translateService.instant('İçerideki_Personel_Sayısı'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-users',
    },
    {
      id: 2,
      label: this.translateService.instant('İçerideki_Ziyaretçi_Sayısı'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-person-walking-arrow-right',
    },
    {
      id: 3,
      label: this.translateService.instant('Cihazlara_Gönderilen_Son_100_İşlem'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-chart-simple',
    },
    {
      id: 4,
      label: this.translateService.instant('İletişimi_Kesik_Cihaz_Sayısı'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-ear-listen',
    },
    {
      id: 5,
      label: this.translateService.instant('Alarm_Sayısı'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-bullhorn',
    },
    {
      id: 6,
      label: this.translateService.instant('Mesaisi_Bitip_Çıkmayan_Personel_Sayısı'),
      menu: 'access',
	    items: [],
      value: '0',
      icon: 'fa-solid fa-hourglass-half',
    },
  ];

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  getValues() {
    const today = "";

    var sp: any[] = [
      {
        mkodu: 'yek202',
        tarih: today,
        tarihbit: today,
        ad: 'undefined',
        soyad: 'undefined',
        sicilno: 'undefined',
        firma: '0',
        bolum: '0',
        pozisyon: '0',
        gorev: '0',
        altfirma: '0',
        yaka: '0',
      },
    ];

    console.log('Params :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Data Geldi :', data);
        this.matchValues(data);
      });
  }

  matchValues(data: any[]) {
	const result = data.reduce(
	  (acc, item) => {
		const amount = Number(item.fazlamesai || item.OnaylananFazlaMesai || item.eksikmesai || 0);
  
		switch (item.type) {
		  case "1": // Fazla mesai
			acc.overtimeTotal += amount;
			acc.approvodOvertimeTotal += Number(item.OnaylananFazlaMesai || 0);
			acc.overtime.push(item);
			break;
		  case "2": // Eksik mesai
			acc.missingWorkTotal += amount;
			acc.missingWork.push(item);
			break;
		  case "4": // Geç gelenler
			acc.latePeople.push(item);
			break;
		  case "5": // Erken çıkanlar
			acc.earlyExits.push(item);
			break;
		  case "6": // İzinliler
			acc.peopleAllowed.push(item);
			break;
		}
  
		return acc;
	  },
	  {
		earlyExits: [],
		latePeople: [],
		peopleAllowed: [],
		overtime: [],
		missingWork: [],
		overtimeTotal: 0,
		approvodOvertimeTotal: 0,
		missingWorkTotal: 0,
	  }
	);
  
	const formatTime = (totalMinutes: number) => {
	  const hours = Math.floor(totalMinutes / 60);
	  const minutes = totalMinutes % 60;
	  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	};
  

	this.dashboardOptions = this.dashboardOptions.map((option, index) => {
		switch (index) {
		  case 0:
			return { ...option, value: result.earlyExits.length, items: result.earlyExits };
		  case 1:
			return { ...option, value: result.latePeople.length, items: result.latePeople };
		  case 2:
			return { ...option, value: result.peopleAllowed.length, items: result.peopleAllowed };
		  case 3:
			return { ...option, value: formatTime(result.overtimeTotal), items: result.overtime };
		  case 4:
			return { ...option, value: formatTime(result.approvodOvertimeTotal), items: result.overtime };
		  case 5:
			return { ...option, value: formatTime(result.missingWorkTotal), items: result.missingWork };
		  default:
			return option;
		}
	  });
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
