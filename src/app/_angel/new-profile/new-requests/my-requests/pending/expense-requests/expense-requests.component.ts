import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { CurrencySymbolPipe } from 'src/app/_helpers/pipes/currency-symbol.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-expense-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        CustomPipeModule,
        CurrencySymbolPipe,
        ButtonModule
    ],
    templateUrl: './expense-requests.component.html',
    styleUrl: './expense-requests.component.scss'
})
export class ExpenseRequestsComponent implements OnInit, OnDestroy, OnChanges {
    @Input() menu: any;
    @Input() process: any;
    data = {
        "aciklama": "Genel Açıklama",
        "iban": "TR123123123123123123123123",
        "masraflar": [
            {
                "id": 1,
                "parabirimi": "TRY       ",
                "tutar": "1000",
                "vergiorani": 18,
                "masrafaciklama": "Yakıt",
                "masraftarih": "2025-07-22T00:00:00",
                "masraftipi": 5,
                "masraftipiad": "ARAÇ YAKIT GİDERLERİ"
            },
            {
                "id": 2,
                "parabirimi": "TRY       ",
                "tutar": "500",
                "vergiorani": 18,
                "masrafaciklama": "Yemek",
                "masraftarih": "2025-07-22T00:00:00",
                "masraftipi": 4,
                "masraftipiad": "YEMEK GİDERİ"
            }
        ]
    }
    private ngUnsubscribe = new Subject();
    imageUrl: string;
    requests: any[] = [];

    constructor(
        private profileService: ProfileService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['process']) {
            this.fetchData();
        }
    }

    ngOnInit(): void {
        console.log("menü :", this.menu);
    }

    fetchData() {
        var sp: any[] = [
            {
                mkodu: 'yek367',
                durum: this.process == 'ongoing' ? '0' : this.process == 'denied' ? '-1' : '2'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x.map((item:any) => {
                const parsed = JSON.parse(item.talepdetaylar);
                return { ...item, talepdetaylar: parsed }
            });
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Masraf Talepleri Geldi: ", data);
            this.requests = [...data];
        });
    }

    getTotal(item: any) {
        return item.talepdetaylar.reduce((sum: number, item: any) => sum + Number(item.tutar), 0);
    }




    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}


