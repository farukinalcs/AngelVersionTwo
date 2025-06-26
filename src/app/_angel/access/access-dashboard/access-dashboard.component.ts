import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { HelperService } from 'src/app/_helpers/helper.service';

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
            visible: true
        },
        {
            id: 2,
            label: this.translateService.instant('İçerideki_Ziyaretçi_Sayısı'),
            menu: 'access',
            items: [],
            value: '0',
            icon: 'fa-solid fa-person-walking-arrow-right',
            visible: true
        },
        {
            id: 3,
            label: this.translateService.instant('Cihazlara_Gönderilen_Son_100_İşlem'),
            menu: 'access',
            items: [],
            value: '0',
            icon: 'fa-solid fa-chart-simple',
            visible: true
        },
        {
            id: 4,
            label: this.translateService.instant('İletişimi_Kesik_Cihaz_Sayısı'),
            menu: 'access',
            items: [],
            value: '0',
            icon: 'fa-solid fa-ear-listen',
            visible: true
        },
        {
            id: 5,
            label: this.translateService.instant('Alarm_Sayısı'),
            menu: 'access',
            items: [],
            value: '0',
            icon: 'fa-solid fa-bullhorn',
            visible: true
        },
        {
            id: 6,
            label: this.translateService.instant('Mesaisi_Bitip_Çıkmayan_Personel_Sayısı'),
            menu: 'access',
            items: [],
            value: '0',
            icon: 'fa-solid fa-hourglass-half',
            visible: true
        },
    ];
    selectedAreaIndex = 0;
    selectedArea: any = null;
    areas: any[] = [];
    editMode: boolean = false;

    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private helperService: HelperService
    ) { }

    ngOnInit(): void {
        this.getAreaAccess();
    }

    getAreaAccess() {
        var sp: any[] = [
            { mkodu: 'yek309' }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message == -1) {
                return;
            }

            this.areas = [...data];
            console.log('Bölgeler :', this.areas);
            this.updateSelectedArea();
        });
    }

    updateSelectedArea() {
        if (this.areas.length > 0) {
            this.selectedArea = this.areas[this.selectedAreaIndex];
            this.helperService.updateData(this.selectedArea);
        }

        this.getValues();
    }

    getNextAreaLabel(): string {
        if (this.areas.length === 0 || !this.selectedArea) {
            return 'Genel Bakış';
        }
        return `${this.selectedArea.ad} Genel Bakış`;
    }

    goToNextArea() {
        if (this.areas.length === 0) return;

        this.selectedAreaIndex = (this.selectedAreaIndex + 1) % this.areas.length;
        this.updateSelectedArea();
    }

    getValues() {
        this.dashboardOptions.map((option) => {
            option.value = '0';
            option.items = [];
        });

        this.getInsidePersonel();
        this.getLast100Process();
        this.getDisconnectedDevices();
        this.getAlarmCount();
        this.getOvertimePersonel();
    }

    getDisconnectedDevices() {
        var sp: any[] = [
            {
                mkodu: 'yek315',
                terminalgroup: this.selectedArea.id.toString()
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
                const mappingData = data.map((item: any) => {
                    return {
                        ...item,
                        type: '4',
                    };
                });
                this.matchValues(mappingData);
            });
    }

    getAlarmCount() {
        var sp: any[] = [
            {
                mkodu: 'yek316'
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
                const mappingData = data.map((item: any) => {
                    return {
                        ...item,
                        type: '5',
                    };
                });
                this.matchValues(mappingData);
            });
    }

    getOvertimePersonel() {
        var sp: any[] = [
            {
                mkodu: 'yek317'
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
                const mappingData = data.map((item: any) => {
                    return {
                        ...item,
                        type: '6',
                    };
                });
                this.matchValues(mappingData);
            });
    }

    getLast100Process() {
        var sp: any[] = [
            {
                mkodu: 'yek311',
                terminalgroup: this.selectedArea.id.toString()
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
                const mappingData = data.map((item: any) => {
                    return {
                        ...item,
                        type: '3',
                    };
                });
                this.matchValues(mappingData);
            });
    }

    getInsidePersonel() {
        var sp: any[] = [
            {
                mkodu: 'yek310',
                terminalgroup: this.selectedArea.id.toString()
            }
        ];
        console.log('Params :', sp);
        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data: any[] = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                console.log('Data Geldi :', data);
                const mappingData = data.map((item: any) => {
                    const tip = item.tip ? item.tip.toString().toLowerCase().trim() : '';
                    return {
                        ...item,
                        type: tip.includes('personel') ? '1' : '2',
                    };
                });
                this.matchValues(mappingData);
            });
    }

    matchValues(data: any[]) {
        if (!data || data.length === 0) {
            return;
        }

        data.forEach((item) => {
            switch (item.type) {
                case "1": // İçerideki Personel Sayısı
                    const insidePersonel = this.dashboardOptions.find((option) => option.id == 1);
                    if (insidePersonel) {
                        insidePersonel.value = Number(insidePersonel.value || 0) + 1;
                        insidePersonel.items = insidePersonel.items || [];
                        insidePersonel.items.push(item);
                    }
                    break;
                case "2": // İçerideki Ziyaretçi Sayısı
                    const insideVisitor = this.dashboardOptions.find((option) => option.id == 2);
                    if (insideVisitor) {
                        insideVisitor.value = Number(insideVisitor.value || 0) + 1;
                        insideVisitor.items = insideVisitor.items || [];
                        insideVisitor.items.push(item);
                    }
                    break;
                case "3": // Cihazlara Gönderilen Son 100 İşlem
                    const last100Process = this.dashboardOptions.find((option) => option.id == 3);
                    if (last100Process) {
                        last100Process.value = Number(last100Process.value || 0) + 1;
                        last100Process.items = last100Process.items || [];
                        last100Process.items.push(item);
                    }
                    break;
                case "4": // İletişimi Kesik Cihaz Sayısı
                    const disconnectedDevices = this.dashboardOptions.find((option) => option.id == 4);
                    if (disconnectedDevices) {
                        disconnectedDevices.value = Number(disconnectedDevices.value || 0) + 1;
                        disconnectedDevices.items = disconnectedDevices.items || [];
                        disconnectedDevices.items.push(item);
                    }
                    break;
                case "5": // Alarm Sayısı
                    const alarmCount = this.dashboardOptions.find((option) => option.id == 5);
                    if (alarmCount) {
                        alarmCount.value = Number(alarmCount.value || 0) + 1;
                        alarmCount.items = alarmCount.items || [];
                        alarmCount.items.push(item);
                    }
                    break;
                case "6": // Mesaisi Bitip Çıkmayan Personel Sayısı
                    const overtimePersonel = this.dashboardOptions.find((option) => option.id == 6);
                    if (overtimePersonel) {
                        overtimePersonel.value = Number(overtimePersonel.value || 0) + 1;
                        overtimePersonel.items = overtimePersonel.items || [];
                        overtimePersonel.items.push(item);
                    }
                    break;
            }
        });
    }

    editModeToggle() {
        this.editMode = !this.editMode;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
