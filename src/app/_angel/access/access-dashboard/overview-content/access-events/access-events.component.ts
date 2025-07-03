import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { HelperService } from 'src/app/_helpers/helper.service';

interface Event {
    Id: number;
    terminal: string;
    aciklama: string;
    zaman: string;
    ad: string;
    soyad: string;
    adsoyad: string;
    type: number;
    userid: string;
}

@Component({
    selector: 'app-access-events',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './access-events.component.html',
    styleUrl: './access-events.component.scss'
})
export class AccessEventsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    events: any[] = [];
    imageUrl: string;

    constructor(
        private profileService: ProfileService,
        private helperService: HelperService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.helperService.currentData$.subscribe(newData => {
            if (newData) this.fetchData(newData);
        });
    }

    fetchData(terminalgroup: any) {
        var sp: any[] = [
            {
                mkodu: 'yek355',
                terminalgroup: terminalgroup.id.toString(),
            }
        ];

        console.log("Olaylar İstek Parametreleri :", sp);


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data: any[] = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) return;

            this.events = [...data];
            console.log("Olaylar Geldi :", this.events);
        });
    }



    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }




    getStatusColor(status: string): string {
        const map: Record<string, string> = {
            'Kapı Açıldı': 'green',
            'Kapı Kapandı': 'blue',
            'Başarısız Geçiş': 'red',
            'Yetkisiz Erişim': 'orange',
            'Sistem Hatası': 'gray',
            'Kart Okunamadı': 'yellow',
            'Başarılı Geçiş': 'emerald',
        };
        return map[status] || 'gray';
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map((w) => w.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
