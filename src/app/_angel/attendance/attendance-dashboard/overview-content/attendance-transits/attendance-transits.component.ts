import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

interface PersonnelTransit {
    Id: number;
    sicilid: number;
    ad: string;
    soyad: string;
    adsoyad: string;
    userid: string;
    terminal: string;
    aciklama: string;
    zaman: Date; // "2025-03-05T08:54:59"
    type: string;
}

@Component({
    selector: 'app-attendance-transits',
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        DataNotFoundComponent
    ],
    templateUrl: './attendance-transits.component.html',
    styleUrl: './attendance-transits.component.scss'
})
export class AttendanceTransitsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    transits: PersonnelTransit[] = [];
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
                mkodu: 'yek356',
                terminalgroup: terminalgroup.id.toString(),
            }
        ];

        console.log("Geçişler İstek Parametreleri (Puantaj) :", sp);


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data: PersonnelTransit[] = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) return;

            this.transits = [...data];
            console.log("Geçişler Geldi  (Puantaj):", this.transits);
        });
    }

    trackByTransit(index: number, item: any): any {
        return item.Id || index;
    }



    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}

