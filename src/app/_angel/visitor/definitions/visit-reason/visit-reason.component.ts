import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Dialog, DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
  selector: 'app-visit-reason',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TranslateModule,
    CustomPipeModule,
    TooltipModule
  ],
  templateUrl: './visit-reason.component.html',
  styleUrl: './visit-reason.component.scss'
})
export class VisitReasonComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  crud: any;
  cardTitle: any;
  organizationList: any[] = [];
  loading: boolean = true;
  selectedItem: any;
  filterText: string = '';
  display: boolean = false;
  organizationName: string = '';
  header: any;
  type: any;

  tabList = [
    {id: 1, label: this.translateService.instant("Ziyaret_Nedeni"), source: "cbo_ziyaretnedeni"}
  ];
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.crud = this.tabList[0];

    if (this.crud) {
      this.cardTitle = this.crud.label + ' ' + this.translateService.instant('Tanımları');
      console.log('CRUD: ', this.crud);
      this.getOrganizationList();
    } else {
      console.warn("CRUD verisi bulunamadı.");
    }
  }


  getOrganizationList() {
    // this.loading = false;

    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: this.crud.source,
        id: '0',
      },
    ];

    console.log('Organisazyon Göster Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('organizasyon listesi geldi: ', data);

          this.organizationList = [...data];
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  openDialog(type: any, item?: any) {
    this.type = type;
    if (type == 'i') {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Ekle');
    } else {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Güncelle');
      this.organizationName = item.ad;
      this.selectedItem = item;
    }

    this.display = true;
  }

  closeAction() {
    this.display = false;
    this.organizationName = '';
  }

  add() {
    let sp: any[] = [];
  
    sp.push({
      mkodu: 'yek123',
      kaynak: this.crud.source,
      id: '0',
      ad: this.organizationName,
    });
    

    console.log('Organisazyon Ekle Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log('Eklendi :', data);
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Eklendi'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
          this.closeAction();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  update() {
    let sp: any[] = [];
    
    sp.push({
      mkodu: 'yek124',
      kaynak: this.crud.source,
      ad: this.organizationName,
      id: this.selectedItem.ID.toString(),
    });
    

    console.log('Organisazyon Güncelle Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log('Eklendi :', data);
          this.toastrService.success(
            this.crud.label +
              ' ' +
              this.translateService.instant('Güncellendi'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
          this.closeAction();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  delete(item: any) {
    var sp: any[] = [
      {
        mkodu: 'yek125',
        kaynak: this.crud.source,
        id: item.ID.toString(),
      },
    ];

    console.log('Organisazyon Sil Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log(item, ' Kaldırıldı : ', data);
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Kaldırıldı'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}