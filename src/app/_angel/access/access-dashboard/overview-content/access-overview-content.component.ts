import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CardMenuComponent } from 'src/app/_angel/shared/dashboard-card/card-menu/card-menu.component';
import { AccessEventsComponent } from './access-events/access-events.component';
import { AccessTransitsComponent } from './access-transits/access-transits.component';

@Component({
    selector: 'app-access-overview-content',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardMenuComponent,
        AccessEventsComponent,
        AccessTransitsComponent
    ],
    templateUrl: './access-overview-content.component.html',
    styleUrl: './access-overview-content.component.scss'
})
export class AccessOverviewContentComponent implements OnInit, OnDestroy, OnChanges {
    @Input() editMode: boolean = false;
    private ngUnsubscribe = new Subject();

    charts = [
        {
            Id: 1,
            Ad: 'Olaylar',
            component: 'accessEvents',
            collapsed: false,
            visible: false
        },
        {
            Id: 2,
            Ad: 'Geçişler',
            component: 'accessTransits',
            collapsed: false,
            visible: false
        }
    ];

    constructor(
        private profileService: ProfileService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['editMode']) {
            this.charts.forEach(chart => {
                chart.collapsed = this.editMode;
            });
        }
    }

    ngOnInit(): void {
        this.getMenuVisible();
    }

    componentMap: { [key: string]: any } = {
        accessEvents: AccessEventsComponent,
        accessTransits: AccessTransitsComponent 
    };

    toggleCollapse(index: number) {
        this.charts[index].collapsed = !this.charts[index].collapsed;
    }

    hideChart(index: number) {
        this.charts[index].visible = false;

        this.onChangeVisible(this.charts[index]);
    }

    onChangeVisible(item: any) {
        console.log('Change Visible: ', item);

        const visibleIds = this.charts.filter(item => item.visible).map(item => item.Id);
        this.setMenuVisible(JSON.stringify(visibleIds));
    }

    setMenuVisible(value: any) {
        var sp: any[] = [
            {
                mkodu: 'yek104',
                ad: 'access_dashboard_content_visible',
                deger: value,
            }
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
                ad: 'access_dashboard_content_visible',
            },
        ];

        this.profileService.requestMethod(sp, { 'noloading': 'true' }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            console.log('Menü ayarları geldi: ', data);
            if (message.islemsonuc == -1) {
                return;
            } else if (message.islemsonuc == 9) {
                this.charts.map(item => {
                    item.visible = true;
                    return item;
                });
                console.log("Varsayılan olarak tüm grafikler görünür yapıldı.", this.charts);

                this.addDashboardOptions();

                const visibleIds = this.charts.filter(item => item.visible).map(item => item.Id);
                this.setMenuVisible(JSON.stringify(visibleIds));
                return;
            }

            this.charts = this.charts.map((item) => {
                const menuItem = JSON.parse(data[0].deger).find((menu: any) => menu == item.Id);
                return { ...item, visible: menuItem ? true : false };
            });

            this.addDashboardOptions();
        });
    }

    addDashboardOptions() {
        // this.visitTypes.forEach((item) => {
        //   const existingOption = this.dashboardOptions.find((option) => option.id === item.ID);

        //   if (item.visible && !existingOption) {
        //     // Eğer item görünürse ve dashboardOptions içinde yoksa ekle
        //     this.dashboardOptions.push({
        //       id: item.ID,
        //       label: item.Ad,
        //       menu: 'visitor',
        //       items: [],
        //       value: '0',
        //       icon: item?.Simge,
        //       visible: true
        //     });  

        //     this.getValues('s', item.ID.toString());
        //   }
        // });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
