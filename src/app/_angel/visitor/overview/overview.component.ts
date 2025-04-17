import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CardMenuComponent } from '../../shared/dashboard-card/card-menu/card-menu.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    CardMenuComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  date = new Date();
  dashboardOptions: any[] = [
    {
      id: -1,
      label: this.translateService.instant('Geçici Kart'),
      menu: 'visitor',
      items: [],
      value: '0',
      icon: 'fa-solid fa-address-card', // Geçici Kart
      visible: true
    },
    // {
    //   id: 2,
    //   label: this.translateService.instant('Misafir'),
    //   menu: 'visitor',
    //   items: [],
    //   value: '0',
    //   icon: 'fa-solid fa-handshake', // Misafir (alternatif: fa-user, fa-user-tie)
    //   visible: true
    // },
    // {
    //   id: 3,
    //   label: this.translateService.instant('Etkinlik'),
    //   menu: 'visitor',
    //   items: [],
    //   value: '0',
    //   icon: 'fa-solid fa-cake-candles', // Etkinlik
    //   visible: true
    // },
    // {
    //   id: 4,
    //   label: this.translateService.instant('Alt Yüklenici'),
    //   menu: 'visitor',
    //   items: [],
    //   value: '0',
    //   icon: 'fa-solid fa-people-carry-box', // Alt Yüklenici
    //   visible: true
    // },
    {
      id: -5,
      label: this.translateService.instant('Çıkış Yapmayan Ziyaretçiler'),
      menu: 'visitor',
      items: [],
      value: '0',
      icon: 'fa-solid fa-door-closed', // Çıkış yapmayanlar
      visible: true
    },
    {
      id: -6,
      label: this.translateService.instant('Toplam Ziyaretçi'),
      menu: 'visitor',
      items: [],
      value: '0',
      icon: 'fa-solid fa-users-viewfinder', // Toplam ziyaretçi
      visible: true
    },
  ];
  visitTypes: any[] = [];
  editMode: boolean = false;
  

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getVisitTypes();

  }

  getVisitTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'cbo_ziyaretnedeni',
        id: '0',
      }
    ];

    console.log('Ziyaretçi Türleri :', sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      
      this.visitTypes = data.map((item: any) => ({ ...item, visible: false }));
      this.visitTypes.shift(); // İlk elemanı çıkarıyoruz (ID: 0 olanı)
      console.log('Ziyaretçi Türleri Geldi :', this.visitTypes);
      this.getMenuVisible();
    });
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
  

  setMenuVisible(value:any) {
    var sp: any[] = [
      {
        mkodu: 'yek104',
        ad: 'visitor_dashboard_visible',
        deger: value,
      },
    ];
    console.log("Menü Visible Param: ", sp);
    
    this.profileService.requestMethod(sp, { 'noloading': 'true' }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {

      console.log('Menü ayarları kaydedildi: ', response);
      this.getMenuVisible();
    });
  }


  getMenuVisible() {
    var sp: any[] = [
      {
        mkodu: 'yek105',
        ad: 'visitor_dashboard_visible',
      },
    ];

    this.profileService.requestMethod(sp, { 'noloading': 'true' }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;
      
      console.log('Menü ayarları geldi: ', data);
      if (message.islemsonuc == -1) {
        return;
      } else if (message.islemsonuc == 9) {
        this.visitTypes[1].visible = true;
        this.visitTypes[2].visible = true;
        this.visitTypes[3].visible = true;

        this.addDashboardOptions();
        
        const visibleIds = this.visitTypes.filter(item => item.visible).map(item => item.ID);
        this.setMenuVisible(JSON.stringify(visibleIds));
        return;
      }

      this.visitTypes = this.visitTypes.map((item) => {
        const menuItem = JSON.parse(data[0].deger).find((menu: any) => menu === item.ID);
        return { ...item, visible: menuItem ? true : false };
      });  

      this.addDashboardOptions();
    });
  }

  addDashboardOptions() {
    this.visitTypes.forEach((item) => {
      const existingOption = this.dashboardOptions.find((option) => option.id === item.ID);
      
      if (item.visible && !existingOption) {
        // Eğer item görünürse ve dashboardOptions içinde yoksa ekle
        this.dashboardOptions.push({
          id: item.ID,
          label: item.ad,
          menu: 'visitor',
          items: [],
          value: '0',
          icon: item?.icon,
          visible: true
        });  
      }
    });
  }

  onChangeVisible(item: any) {
    console.log('Change Visible: ', item);
    
    // this.dashboardOptions.push({
    //   id: item.ID,
    //   label: item.ad,
    //   menu: 'visitor',
    //   items: [],
    //   value: '0',
    //   icon: item?.icon,
    //   visible: true
    // })

    const visibleIds = this.visitTypes.filter(item => item.visible).map(item => item.ID);
    this.setMenuVisible(JSON.stringify(visibleIds));
  }

  removeCard(item:any) {
    this.visitTypes.find((x) => x.ID == item.id).visible = false;
    
    const visibleIds = this.visitTypes.filter(item => item.visible).map(item => item.ID);
    this.setMenuVisible(JSON.stringify(visibleIds));
  }

  editModeToggle() {
    this.editMode = !this.editMode;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}