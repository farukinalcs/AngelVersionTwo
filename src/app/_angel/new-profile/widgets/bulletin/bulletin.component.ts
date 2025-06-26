import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { BulletinComponent as Form } from '../../request-forms/bulletin/bulletin.component';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { SharedModule } from 'src/app/_angel/shared/shared.module';

@Component({
    selector: 'app-bulletin',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        CarouselModule,
        TranslateModule,
        Form,
        TooltipModule,
        ButtonModule,
        CustomPipeModule,
        SharedModule
    ],
    templateUrl: './bulletin.component.html',
    styleUrl: './bulletin.component.scss'
})
export class BulletinComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject()
    public closedBulletinForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    items: any[] = [
        { tarih: '04 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/6.svg', aciklama: "28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler.", baslik: 'Test Geliştirme' },
        { tarih: '05 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/1.svg', aciklama: 'Araç Talep Modülü Yayınlanmıştır.', baslik: 'Yazılım Geliştirme' },
        { tarih: '06 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/2.svg', aciklama: 'Araç Talep Modülü Yayınlanmıştır.', baslik: 'Mobil Geliştirme' },
        { tarih: '06 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/3.svg', aciklama: 'Araç Talep Modülü Yayınlanmıştır.', baslik: 'Mobil Geliştirme' },
    ];

    displayAllNews: boolean;
    currentItem: any = this.items[0];
    displayBulletinForm: boolean = false;
    
    constructor(
        private profileService: ProfileService
    ) { }


    ngOnInit(): void {
        this.fetchData("1");
    }

    fetchData(type: any) {
        var sp: any[] = [
            {
                mkodu: "yek058",
                tip: type
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.items = [...data];
            console.log("Bültenler Geldi :", this.items);
        });
    }

    showAllNews() {
        this.fetchData("2");
        this.displayAllNews = true;
    }

    closeAllBulletin() {
        this.displayAllNews = false;
        this.fetchData("1");
    }

    displayBulletin() {
        this.displayBulletinForm = !this.displayBulletinForm;
    }
    /* --------------------------------- */


    showFile(item: any) {
        this.profileService
            .getFileForDemand(item.UniqueId, item.DosyaTipi, 'bulten')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const base64Data = response[0].x; // Base64 string
                const contentType = item.ContentType; // Örn: 'application/pdf', 'image/png'

                console.log('Base64 Geldi :', base64Data);

                // Base64'ü Blob'a dönüştür
                const byteCharacters = atob(base64Data.base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: contentType });

                // Blob'dan bir URL oluştur
                const blobUrl = URL.createObjectURL(blob);

                // Yeni sekmede aç
                window.open(blobUrl);

                console.log('Dosya görüntüleniyor:', blobUrl);
            });
    }

    deleteBulletin(item: any) {
        var sp: any[] = [
            {
                mkodu: "yek344",
                id: item.Id.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Bültenler Silindi :", data);
            this.fetchData("2");
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
