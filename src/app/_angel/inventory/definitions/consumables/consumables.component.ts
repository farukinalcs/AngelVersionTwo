import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consumables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TranslateModule,
    CustomPipeModule,
    TooltipModule,
    InputIconModule,
    IconField,
    FloatLabelModule,
    InputTextModule,
  ],
  templateUrl: './consumables.component.html',
  styleUrl: './consumables.component.scss',
})
export class ConsumablesComponent {
  private ngUnsubscribe = new Subject();
  cardTitle: any;
  display: boolean = false;
  originalItem: any;
  inventoryItemName: string = '';
  inventoryId: any;
  header: any;
  crud: any;
  generalInventoryList: any[] = [];
  type: any;
  filterText: string = '';
  loading: boolean = true;
  tabList = [
    {
      id: 1,
      label: this.translateService.instant('Sarf_Malzeme'),
      source: 'cbo_sarfmalzeme',
    },
  ];
  constructor(
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private profileService: ProfileService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.crud = this.tabList[0];

    if (this.crud) {
      this.cardTitle =
        this.crud.label + ' ' + this.translateService.instant('Tanımları');
      console.log('CRUD: ', this.crud);
      this.getConsumablesList();
    } else {
      console.warn('CRUD verisi bulunamadı.');
    }
  }
  openDialog(type: any, item?: any) {
    this.type = type;
    if (type == 'i') {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Ekle');
    } else {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Güncelle');
      this.inventoryItemName = item.ad;
      this.inventoryId = item.id;
      this.originalItem = { ...item };
    }

    this.display = true;
  }
  closeAction() {
    this.display = false;
    this.inventoryItemName = '';
  }

  getConsumablesList() {
    var sp: any[] = [
      {
        mkodu: 'yek385',
        id: '0',
        tip: '2',
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

          this.generalInventoryList = [...data];
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  add() {
    let sp: any[] = [];

    sp.push({
      mkodu: 'yek384',
      ad: this.inventoryItemName,
      tip: '2',
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

          this.getConsumablesList();
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
    this.confirmationService
      .confirmAction(`"${this.inventoryItemName}" olarak güncellensin mi?`)
      .then((result: any) => {
        if (result.isConfirmed) {
          let sp: any[] = [];
          sp.push({
            mkodu: 'yek386',
            ad: this.inventoryItemName,
            id: this.inventoryId.toString(),
          });

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

                console.log('Güncellendi :', data);
                this.toastrService.success(
                  this.crud.label +
                    ' ' +
                    this.translateService.instant('Güncellendi'),
                  this.translateService.instant('Başarılı')
                );

                this.getConsumablesList();
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
      });
  }

  delete(item: any) {
    this.confirmationService.confirmDelete(item.ad).then((result: any) => {
      if (result.isConfirmed) {
        const sp: any[] = [{ mkodu: 'yek387', id: item.id.toString() }];

        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const message = response[0].z;

            if (message.islemsonuc == -1) return;

            this.confirmationService.success('Ekipman Kaldırıldı');
            this.getConsumablesList();
            this.closeAction();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.confirmationService.error('İşlem Yapmaktan Vazgeçildi!');
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
