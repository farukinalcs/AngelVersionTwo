import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { CommonModule, NgClass } from '@angular/common';
import { CustomPipeModule } from '../../../../_helpers/custom-pipe.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-food-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    Dialog,
    DropdownModule,
    FloatLabel,
    Select,
    IconField,
    InputIcon,
    NgClass,
    CustomPipeModule,
    ToolbarModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './food-location.component.html',
  styleUrl: './food-location.component.scss',
})
export class FoodLocationComponent {
  @ViewChild('deviceUpdateForm') deviceUpdateForm: NgForm;
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  filterText: string = '';
  deviceGroups: any[] = [];
  selectedDeviceGroup: any;
  relations: any[] = [];
  purposes: any[];
  selectedPurpose: any;
  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  filterTextDevice: string = '';

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTerminalGroupPurpose();
  }

  getDeviceGroups(item?: any) {
    // this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek190',
        amac: '3',
        id: '0',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.deviceGroups = [...data];
        console.log(this.deviceGroups);
        
        this.selectDeviceGroup(item || this.deviceGroups[0]);

        // setTimeout(() => {
        //   this.loading = true;
        //   this.ref.detectChanges();
        // }, 1000);
      });
  }

  trackById(index: number, item: { id: number | string }) {
  // id yoksa index'e düşer, güvenli
  return item?.id ?? index;
}
  selectDeviceGroup(item: any) {
    this.selectedDeviceGroup = item;

    this.getRelation();
    this.matchPurpose();
  }

  getRelation() {
    var sp: any[] = [
      {
        mkodu: 'yek155',
        kaynakid: '0',
        hedefid: this.selectedDeviceGroup.id.toString(),
        hedeftablo: 'terminalgroup',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.relations = [...data];
        console.log(this.relations);
        
      });
  }

  getTerminalGroupPurpose() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'sys_amaclar',
        id: '3',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.purposes = [...data]
        this.getDeviceGroups();
      });
  }

  matchPurpose() {
    this.purposes?.forEach((item: any) => {
      if (item.ID == this.selectedDeviceGroup.amac) {
        this.selectedPurpose = item;
        return;
      }
    });
  }

  onChangePurpose() {
    var sp: any[] = [
      {
        mkodu: 'yek191',
        id: this.selectedDeviceGroup.id.toString(),
        kaynak: 'terminalgroup',
        ad: 'ayni',
        amac: this.selectedPurpose.ID.toString(),
      },
    ];


    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }


        const group = this.deviceGroups.find(
          (item: any) => item.id === data[0].id
        );
        if (group) {
          group.amac = data[0].amac;
        }
      });
  }

  relationStateChange(item: any, process: any) {
    var mkodu;
    if (process == 'i') {
      mkodu = 'yek156';
    } else if (process == 'd') {
      mkodu = 'yek157';
    }

    var sp: any[] = [
      {
        mkodu: mkodu,
        kaynakid: item.kaynakId.toString(),
        hedefid: item.hedefId.toString(),
        hedeftablo: 'terminalgroup',
        extra: '0',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        this.getRelation();
      });
  }

  openAddDialog() {
    this.displayAdd = true;
  }

addDeviceGroup(formValue: any) {
  console.log('Form Value Add: ', formValue);
  if (!formValue?.purpose || !formValue?.deviceName?.trim()) {
    this.toastrService.warning(
      this.translateService.instant('Lütfen_tüm_zorunlu_alanları_doldurunuz'),
      this.translateService.instant('Uyarı')
    );
    return;
  }

  var sp: any[] = [
    {
      mkodu: 'yek192',
      id: '0',
      kaynak: 'terminalgroup',
      ad: formValue.deviceName,
      amac: formValue.purpose.ID.toString(),
      deger: '0',
    },
  ];

  console.log('Terminal Grubu Ekle Param : ', sp);

  this.profileService
    .requestMethod(sp)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log('Terminal Grubu Eklendi : ', data);
      this.getTerminalGroupPurpose();
      this.displayAdd = false;

      this.toastrService.success(
        this.translateService.instant('Yeni_Terminal_Grubu_Eklendi'),
        this.translateService.instant('Başarılı')
      );
    });
}


  openUpdateDialog() {
    this.displayUpdate = true;
    this.deviceUpdateForm.controls['deviceName'].setValue(
      this.selectedDeviceGroup.ad
    );
  }

  updateDeviceGroup(formValue: any) {
  if (!formValue?.deviceName?.trim()) {
    this.toastrService.warning(
      this.translateService.instant('Lütfen_tüm_zorunlu_alanları_doldurunuz'),
      this.translateService.instant('Uyarı')
    );
    return;
  }

    var sp: any[] = [
      {
        mkodu: 'yek191',
        id: this.selectedDeviceGroup.id.toString(),
        kaynak: 'terminalgroup',
        ad: formValue.deviceName,
        amac: this.selectedPurpose.ID.toString(),
      },
    ];
    console.log('Terminal Grubu Değiştir Param : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Terminal Grubu Değiştirildi : ', data);

        const group = this.deviceGroups.find(
          (item: any) => item.id === data[0].id
        );
        if (group) {
          group.ad = data[0].ad;
          group.amac = data[0].amac;
          group.id = data[0].id;
        }

        this.displayUpdate = false;
        this.toastrService.success(
          this.translateService.instant('Terminal_Grubu_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  deleteDeviceGroup() {
    Swal.fire({
      title: `Seçilen terminal grubu "${this.selectedDeviceGroup.ad}" kaldırılsın mı? `,
      // text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#ed1b24',
      showCancelButton: true,
      showDenyButton: false,
      denyButtonText: 'İptal',
      denyButtonColor: '#ed1b24',
      confirmButtonColor: '#ed1b24',
      cancelButtonColor: '#ed1b24',
      cancelButtonText: 'Hayır',
      confirmButtonText: `Evet`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        var sp: any[] = [
          {
            mkodu: 'yek125',
            id: this.selectedDeviceGroup.id.toString(),
            kaynak: 'terminalgroup',
          },
        ];
        console.log('Terminal Grup Sil Param : ', sp);

        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
              return;
            }

            console.log('Terminal Grup Silindi: ', data);
            this.getTerminalGroupPurpose();

            Swal.fire({
              title: `Terminal Grup Kaldırıldı`,
              icon: 'success',
              iconColor: '#ed1b24',
              confirmButtonColor: '#ed1b24',
              confirmButtonText: 'Kapat',
              allowOutsideClick: false,
              allowEscapeKey: false,
              heightAuto: false,
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'İşlem Yapmaktan Vazgeçildi!',
          icon: 'error',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false,
        });
      } else if (result.isDenied) {
      }
    });
  }

  closeAction() {
    this.displayUpdate = false;
    this.displayAdd = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
