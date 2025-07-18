import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardMenuComponent } from '../../shared/dashboard-card/card-menu/card-menu.component';
import { OverviewContentComponent } from './overview-content/overview-content.component';
import { DashboardCardComponent } from '../../shared/dashboard-card/dashboard-card.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardMenuComponent,
    OverviewContentComponent,
    DashboardCardComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  date = new Date();
  dashboardOptions: any[] = [
    {
      id: -5,
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
      id: -1,
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
    this.getValues('all', '0');
    this.getValues('gecicikart', '0');
    this.getValues('ck', '0');
  }

  getVisitTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek292',
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
      console.log('Ziyaret Nedenleri Geldi :', this.visitTypes);
      this.getMenuVisible();
    });
  }

  getValues(type: string, id: string) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında tarih alıyoruz

    var sp: any[] = [
      {
        mkodu: 'yek289',
        tarih: today,
        tarihbit: today,
        tip: type,
        ziyaretnedeniid: id
      }
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
    if (!data || data.length === 0) {
      return;
    }
  
    data.forEach((item) => {
      switch (item.type?.toString()) {
        case "-2": // Geçici Kart
          const tempCard = this.dashboardOptions.find(option => option.id == -5);
          if (tempCard) {
            tempCard.value = Number(tempCard.value || 0) + 1;
            tempCard.items = tempCard.items || [];
            tempCard.items.push(item);
          }
          break;
  
        case "-1": // Çıkış Yapmayan Ziyaretçiler
          const exitVisitor = this.dashboardOptions.find(option => option.id == -1);
          if (exitVisitor) {
            exitVisitor.value = Number(exitVisitor.value || 0) + 1;
            exitVisitor.items = exitVisitor.items || [];
            exitVisitor.items.push(item);
          }
          break;
  
        case "1": // Ziyaret Nedenleri
          const visitType = this.visitTypes.find(type => type.ID == item.ZiyaretNedeniId);
          const dashboardOption = this.dashboardOptions.find(option => option.id == visitType?.ID);
          if (dashboardOption) {
            dashboardOption.value = Number(dashboardOption.value || 0) + 1;
            dashboardOption.items = dashboardOption.items || [];
            dashboardOption.items.push(item);
          }
          break;
  
        case "0": // Toplam Ziyaretçi
          const totalVisitor = this.dashboardOptions.find(option => option.id == -6);
          if (totalVisitor) {
            totalVisitor.value = Number(totalVisitor.value || 0) + 1;
            totalVisitor.items = totalVisitor.items || [];
            totalVisitor.items.push(item);
          }
          break;
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
          label: item.Ad,
          menu: 'visitor',
          items: [],
          value: '0',
          icon: item?.Simge,
          visible: true
        });  

        this.getValues('s', item.ID.toString());
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