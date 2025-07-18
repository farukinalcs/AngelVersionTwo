import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { PersonalInfoComponent } from '../registry-card/personal-info/personal-info.component';

@Component({
    selector: 'app-registry-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        InlineSVGModule,
        PersonalInfoComponent
    ],
    templateUrl: './registry-detail.component.html',
    styleUrl: './registry-detail.component.scss'
})
export class RegistryDetailComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    imageUrl: string;
    timestamp = new Date().getTime();
    selectedRegisterId: any;
    registerDetail: any[] = [];
    vacationDetail: any[] = [];
    operationType: string;
    selectedTab: string = 'Kişisel Bilgiler'; // Varsayılan aktif tab
    tabList = [
      { label: 'Kişisel Bilgiler' },
      { label: 'Organizasyon Bilgileri' },
      { label: 'Özel Bilgiler' },
      { label: 'Mesai Bilgileri' },
      { label: 'Kart RF Parmak Yüz Bilgileri', badge: 5 },
      { label: 'Geçiş Grupları' },
      { label: 'Program Kullanımı' },
      { label: 'Sicil Geçmiş' },
      { label: 'Çalışma Dönemleri' },
      { label: 'Belgeler' },
      { label: 'Splitler' },
      { label: 'Zimmet' }
    ];
    constructor(
        private route: ActivatedRoute,
        private profileService: ProfileService,
        private translateService : TranslateService,
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            const operation = params.get('operation');
            if (id) {
                this.selectedRegisterId = id;
                console.log('Selected Register Id:', this.selectedRegisterId);
            }
            
            if (operation) {
                this.operationType = operation;
                console.log('Operation Type:', this.operationType);
            }
        });

        this.getRegisterDetail();
        this.getVacationDetail();
    }

    selectTab(tab: string) {
        this.selectedTab = tab;
        console.log('Seçilen tab:', tab);
    }

    formEvent(event: any) {
        this.registerDetail[0].ad = event?.name || this.translateService.instant("Ad");
        this.registerDetail[0].soyad = event?.surname || this.translateService.instant("Soyad");
    }

    getRegisterDetail() {
        var sp: any[] = [
            {
                mkodu: 'yek209',
                id: this.selectedRegisterId.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Sicil Detay Geldi : ", data);

            this.registerDetail = [...data];
        });
    }

    getVacationDetail() {
        var sp: any[] = [
          {
            mkodu: 'yek107',
            sicilid: this.selectedRegisterId.toString(),
            izintip: '3'
          }
        ];
    
        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
          const data = response[0].x;
          const message = response[0].z;
    
          if (message.islemsonuc == -1) {
            return;
          }
    
          console.log("Sicil İzin Detay Geldi : ", data);
    
          this.vacationDetail = [...data];
        });
      }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
