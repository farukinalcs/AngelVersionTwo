import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TransitionsModel } from 'src/app/_angel/profile/models/transations';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

// PrimeNG 18 Modules
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-passages',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        TabViewModule,
        TimelineModule,
        BadgeModule,
        ButtonModule,
    ],
    templateUrl: './passages.component.html',
    styleUrl: './passages.component.scss'
})
export class PassagesComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    transitions: any[] = [];

    constructor(
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.getTransitions('0');
    }

    getTransitions(event: any) {
        var zamanAralik: any = '1';

        if (event == 0) {
            zamanAralik = '1';
        } else if (event == 1) {
            zamanAralik = '7';
        } else if (event == 2) {
            zamanAralik = '30';
        }


        var sp: any[] = [{
            mkodu: 'yek033',
            zamanaralik: zamanAralik,
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<TransitionsModel, ResponseDetailZ>[]) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.transitions = [...data];
            console.log("Geçişler Geldi :", this.transitions);
        });
    }






    movements: any[] = [
        {
            id: '1',
            type: 'entry',
            timestamp: '2024-01-15T08:30:00',
            device: 'desktop',
            deviceName: 'Ana Giriş Terminali',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '2',
            type: 'exit',
            timestamp: '2024-01-15T12:15:00',
            device: 'mobile',
            deviceName: 'Mobil Uygulama',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '3',
            type: 'entry',
            timestamp: '2024-01-15T13:00:00',
            device: 'tablet',
            deviceName: 'Yemekhane Tablet',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '4',
            type: 'exit',
            timestamp: '2024-01-15T17:45:00',
            device: 'desktop',
            deviceName: 'Ana Giriş Terminali',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '5',
            type: 'entry',
            timestamp: '2024-01-16T08:45:00',
            device: 'mobile',
            deviceName: 'Mobil Uygulama',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '6',
            type: 'exit',
            timestamp: '2024-01-16T11:30:00',
            device: 'desktop',
            deviceName: 'Ana Giriş Terminali',
            employeeName: 'Ahmet Yılmaz',
        },
        {
            id: '7',
            type: 'exit',
            timestamp: '2024-01-16T11:35:00',
            device: 'mobile',
            deviceName: 'Mobil Uygulama',
            employeeName: 'Ahmet Yılmaz',
        },
    ]

    getDeviceIcon(device: string): string {
        switch (device) {
            case 'desktop':
                return 'fa-solid fa-desktop'
            case 'mobile':
                return 'fa-solid fa-mobile-alt'
            case 'tablet':
                return 'fa-solid fa-tablet-alt'
            default:
                return 'fa-solid fa-desktop'
        }
    }




    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
