import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
    TooltipModule,
    InputIconModule,
    IconFieldModule,
    FloatLabelModule,
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
  icon: any;
  iconList: any[] = [
    { id: 1, icon: 'fa-solid fa-image' },
    { id: 2, icon: 'fa-solid fa-calendar'},
    { id: 3, icon: 'fa-solid fa-truck'},  
    { id: 4, icon: 'fa-solid fa-bell'},
    { id: 5, icon: 'fa-solid fa-envelope'},
    { id: 6, icon: 'fa-solid fa-user'},
    { id: 7, icon: 'fa-solid fa-people-carry-box'},  
    { id: 8, icon: 'fa-solid fa-clipboard-check'},
    { id: 9, icon: 'fa-solid fa-users'},  
    { id: 10, icon: 'fa-solid fa-user-tie'},
    { id: 11, icon: 'fa-solid fa-handshake'},
    { id: 12, icon: 'fa-solid fa-cake-candles'},
    { id: 13, icon: 'fa-solid fa-address-card'},
    { id: 14, icon: 'fa-solid fa-car'},
    { id: 15, icon: 'fa-solid fa-tag'},
    { id: 16, icon: 'fa-solid fa-book'},
    { id: 17, icon: 'fa-solid fa-barcode'},
    { id: 18, icon: 'fa-solid fa-inbox'},
    { id: 19, icon: 'fa-solid fa-film'},
    { id: 20, icon: 'fa-solid fa-gift'},
    { id: 21, icon: 'fa-solid fa-trailer'},
    { id: 22, icon: 'fa-solid fa-stethoscope'},
    { id: 23, icon: 'fa-solid fa-brush'},
    { id: 24, icon: 'fa-solid fa-spray-can'},
    { id: 25, icon: 'fa-solid fa-hammer'}
  ];

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
        mkodu: 'yek292',
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
      this.header = this.crud.label + ' ' + this.translateService.instant('Güncelle');
      this.organizationName = item.Ad;
      this.selectedItem = item;
      this.icon = item.Simge;
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
      mkodu: 'yek290',
      simge: this.icon,
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
      mkodu: 'yek291',
      ad: this.organizationName,
      id: this.selectedItem.ID.toString(),
      simge: this.icon,
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