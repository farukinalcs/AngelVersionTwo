import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    labels: string[];
    legend: ApexLegend;
    subtitle: ApexTitleSubtitle;
};

@Component({
    selector: 'app-attendance-dashboard',
    templateUrl: './attendance-dashboard.component.html',
    styleUrls: ['./attendance-dashboard.component.scss'],
})
export class AttendanceDashboardComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    date = new Date();
    dashboardOptions: any[] = [
        {
            id: 1,
            label: this.translateService.instant('Erken_Çıkan_Kişi_Sayısı'),
            menu: 'attendance',
            items: [],
            value: '0',
            icon: 'fa-solid fa-circle-info',
            visible: true
        },
        {
            id: 2,
            label: this.translateService.instant('Geç_Kalan_Kişi_Sayısı'),
            menu: 'attendance',
            items: [],
            value: '0',
            icon: 'fa-solid fa-triangle-exclamation',
            visible: true
        },
        {
            id: 3,
            label: this.translateService.instant('İzinli_Kişi_Sayısı'),
            menu: 'attendance',
            items: [],
            value: '0',
            icon: 'fa-solid fa-user',
            visible: true
        },
        {
            id: 4,
            label: this.translateService.instant('Fazla_Mesai_Toplamı'),
            menu: 'attendance',
            items: [],
            value: '00:00',
            icon: 'fa-solid fa-clock',
            visible: true
        },
        {
            id: 5,
            label: this.translateService.instant('Onaylanan_Fazla_Mesai_Toplamı'),
            menu: 'attendance',
            items: [],
            value: '00:00',
            icon: 'fa-solid fa-circle-check',
            visible: true
        },
        {
            id: 6,
            label: this.translateService.instant('Eksik_Mesai_Toplamı'),
            menu: 'attendance',
            items: [],
            value: '00:00',
            icon: 'fa-solid fa-calculator',
            visible: true
        },
    ];

    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
    ) { }

    ngOnInit(): void {
        this.getValues();
    }

    getValues() {
        const datePipe = new DatePipe('en-US');
        const today = datePipe.transform(this.date, 'yyyy-MM-dd')!;

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
        const formatTime = (totalMinutes: number) => { // Toplam dakikayı saat:dakika formatına çevirir
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        
        if (!data || data.length === 0) {
            return;
        }

        // Verileri türlerine göre gruplama
        data.forEach((item) => {
            switch (item.type?.toString()) {
                case "1": // Fazla mesai toplamı ve onaylanan fazla mesai toplamı
                    const overtime = this.dashboardOptions.find(option => option.id == 4);
                    const approvodOvertime = this.dashboardOptions.find(option => option.id == 5);
                    if (overtime) {
                        overtime.value = formatTime(Number(item.fazlamesai || 0) + Number(overtime.value || 0));
                        overtime.items = overtime.items || [];
                        overtime.items.push(item);
                    }
                    if (approvodOvertime) {
                        approvodOvertime.value = formatTime(Number(item.OnaylananFazlaMesai || 0) + Number(approvodOvertime.value || 0));
                        approvodOvertime.items = approvodOvertime.items || [];
                        approvodOvertime.items.push(item);
                    }
                    break;
                case "2": // Eksik mesai toplamı
                    const missingWork = this.dashboardOptions.find(option => option.id == 6);
                    if (missingWork) {
                        missingWork.value = formatTime(Number(item.eksikmesai || 0) + Number(missingWork.value || 0));
                        missingWork.items = missingWork.items || [];
                        missingWork.items.push(item);
                    }
                    break;
                case "4": // Geç kalan kişi sayısı
                    const latePeople = this.dashboardOptions.find(option => option.id == 2);
                    if (latePeople) {
                        latePeople.value = Number(latePeople.value || 0) + 1;
                        latePeople.items = latePeople.items || [];
                        latePeople.items.push(item);
                    }
                    break;
                case "5": // Erken çıkan kişi sayısı
                    const earlyExits = this.dashboardOptions.find(option => option.id == 1);
                    if (earlyExits) {
                        earlyExits.value = Number(earlyExits.value || 0) + 1;
                        earlyExits.items = earlyExits.items || [];
                        earlyExits.items.push(item);
                    }
                    break;
                case "6": // İzinli kişi sayısı
                    const peopleAllowed = this.dashboardOptions.find(option => option.id == 3);
                    if (peopleAllowed) {
                        peopleAllowed.value = Number(peopleAllowed.value || 0) + 1;
                        peopleAllowed.items = peopleAllowed.items || [];
                        peopleAllowed.items.push(item);
                    }
                    break;
            }
        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
