import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { MyIncompleteTimeModel } from 'src/app/_angel/profile/models/myIncompleteTime';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { TranslationService } from 'src/app/modules/i18n';

@Component({
    selector: 'app-missing-durations',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        TranslateModule,
        CustomPipeModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        SelectModule,
        DialogModule,
        DataNotFoundComponent
    ],
    templateUrl: './missing-durations.component.html',
    styleUrl: './missing-durations.component.scss'
})
export class MissingDurationsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();


    timeRange: any[] = [
        { text: this.translateService.instant('Bir_Gün'), value: '1' },
        { text: this.translateService.instant('Üç_Gün'), value: '3' },
        { text: this.translateService.instant('Bir_Hafta'), value: '7' },
        { text: this.translateService.instant('İki_Hafta'), value: '14' },
        { text: this.translateService.instant('Bir_Ay'), value: '30' },
        { text: this.translateService.instant('İki_Ay'), value: '60' },
        { text: this.translateService.instant('Altı_Ay'), value: '180' },
        { text: this.translateService.instant('Bir_Yıl'), value: '365' }
    ]

    incompleteTimes: any[] = [];
    selectedTime: any;


    displayedColumns: string[] = ['aciklama', 'eksiksure', 'mesaitarih', 'ggiris', 'gcikis'];
    dataSource: MatTableDataSource<any>;

    filterText: string = '';
    selectedMissing: MyIncompleteTimeModel;
    showForm: boolean = false;
    missingDetails: any[] = [];


    groupedData: { date: string; records: any }[] = []

    constructor(
        private profileService: ProfileService,
        private translationService: TranslationService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef
    ) { }


    ngOnInit(): void {
        this.selectedTime = this.timeRange[0];
        this.getIncompleteTimes('1');
    }

    timeRangeChangeLang() {
        this.translationService.langObs.subscribe((item) => {
            if (item == 'en') {
                this.timeRange[0].text = '1 Day';
                this.timeRange[1].text = '3 Day';
                this.timeRange[2].text = '1 Week';
                this.timeRange[3].text = '2 Week';
                this.timeRange[4].text = '1 Month';
                this.timeRange[5].text = '2 Month';
                this.timeRange[6].text = '6 Month';
                this.timeRange[7].text = '1 Year';
            }
        });
    }

    onDropdownChange(event: any) {
        const selectedValue = event.value;
        console.log(selectedValue);
        this.getIncompleteTimes(selectedValue.value);
    }

    getIncompleteTimes(zamanAralik: string) {
        this.profileService.getIncompleteTimes(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<MyIncompleteTimeModel, ResponseDetailZ>[]) => {
            const data: MyIncompleteTimeModel[] = response[0].x;
            this.incompleteTimes = data;
            this.dataSource = new MatTableDataSource(this.incompleteTimes);
            console.log("Eksik Sürelerim :", data);
        });
    }

    openMissingDurationForm(item: MyIncompleteTimeModel) {
        this.selectedMissing = item;
        this.showForm = true;
        this.getMissingDetail(item);
    }

    onHide() {
        this.showForm = false;
        this.selectedMissing = {} as MyIncompleteTimeModel;
    }

    getMissingDetail(item: MyIncompleteTimeModel) {
        var sp: any[] = [
            {
                mkodu: 'yek353',
                tarih: item.mesaitarih.split('T')[0]
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data: any[] = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) return;

            this.missingDetails = [...data];
            console.log("Missing Detail Data:", this.missingDetails);

            const groups = this.missingDetails.reduce((acc, item) => {
                const date = new Date(item.mesaitarih).toLocaleDateString('tr-TR') // Format tarih 
                if (!acc[date]) acc[date] = [] // Eğer tarih yoksa yeni bir dizi oluştur
                acc[date].push(item) // Tarihe göre gruplama
                return acc // Geri döndür
            }, {} as Record<string, typeof this.missingDetails>) // Gruplama işlemi
    
            this.groupedData = Object.entries(groups).map(([date, records]) => ({ // Her tarih için bir nesne oluştur
                date,
                records,
            }))

            console.log("Grouped Data:", this.groupedData);
            
            
        });
    }


    formatTime(dateString: string): string {
        return new Date(dateString).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    calculateDuration(giris: string, cikis: string): string {
        const start = new Date(giris)
        const end = new Date(cikis)
        const diff = end.getTime() - start.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        return `${hours}s ${minutes}dk`
    }

    getTotalHours(records: typeof this.missingDetails, arakayitValue: number): string {
        const totalMs = records
            .filter((r) => r.arakayit === arakayitValue)
            .reduce((total, record) => {
                const start = new Date(record.giris).getTime()
                const end = new Date(record.cikis).getTime()
                return total + (end - start)
            }, 0)
        return (totalMs / (1000 * 60 * 60)).toFixed(1)
    }

    getTotalMinutes(records: typeof this.missingDetails, arakayitValue: number): string {
        const totalMs = records // Arakayit değerine göre filtreleme
            .filter((r) => r.arakayit === arakayitValue) // Filtreleme işlemi
            .reduce((total, record) => { // Toplam süreyi hesaplama
                const start = new Date(record.giris).getTime() // Giriş zamanını milisaniye cinsine çevirme
                const end = new Date(record.cikis).getTime() // Çıkış zamanını milisaniye cinsine çevirme
                return total + (end - start) // Toplam süreyi hesaplama
            }, 0) // Başlangıçta toplam süreyi 0 olarak ayarlama
        return Math.round(totalMs / (1000 * 60)).toString() // Toplam süreyi dakika cinsine çevirip string olarak döndürme
    }



    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
