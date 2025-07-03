import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
    selector: 'app-attendance-shift-control',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './attendance-shift-control.component.html',
    styleUrl: './attendance-shift-control.component.scss'
})
export class AttendanceShiftControlComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    shifts: any[] = [];
    imageUrl: string;

    constructor(
        private profileService: ProfileService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData() {
        var sp: any[] = [
            {
                mkodu: 'yek357',
            }
        ];

        console.log("Vardiya Kontrol Parametreleri (Puantaj) :", sp);


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data: any[] = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) return;

            this.shifts = [...data];
            console.log("Vardiya Kontroller Geldi  (Puantaj):", this.shifts);
        });
    }

    trackByTransit(index: number, item: any): any {
        return item.Id || index;
    }




    // shifts = [
    //     {
    //         name: 'Sabah Vardiyası',
    //         time: '08:00 - 16:00',
    //         required: 12,
    //         present: 10,
    //         absent: 2,
    //         status: 'active',
    //     },
    //     {
    //         name: 'Öğle Vardiyası',
    //         time: '16:00 - 00:00',
    //         required: 8,
    //         present: 8,
    //         absent: 0,
    //         status: 'upcoming',
    //     },
    //     {
    //         name: 'Gece Vardiyası',
    //         time: '00:00 - 08:00',
    //         required: 6,
    //         present: 5,
    //         absent: 1,
    //         status: 'completed',
    //     },
    // ];

    getAttendanceRate(present: number, required: number): number {
        return Math.round((present / required) * 100);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'active':
                return 'bg-success text-white';
            case 'upcoming':
                return 'bg-primary text-white';
            case 'completed':
                return 'bg-secondary text-dark';
            default:
                return 'bg-secondary text-dark';
        }
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'active':
                return 'Aktif';
            case 'upcoming':
                return 'Bekliyor';
            case 'completed':
                return 'Tamamlandı';
            default:
                return 'Bilinmiyor';
        }
    }

    get totalRequired(): number {
        return this.shifts.reduce((sum, s) => sum + s.olmasi, 0);
    }

    get totalPresent(): number {
        return this.shifts.reduce((sum, s) => sum + s.gelen, 0);
    }

    get totalAbsent(): number {
        return this.shifts.reduce((sum, s) => sum + s.gelmeyen, 0);
    }



    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
