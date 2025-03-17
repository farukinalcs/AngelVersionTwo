import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';



@Component({
  selector: 'app-shift-groups',
  templateUrl: './shift-groups.component.html',
  styleUrls: ['./shift-groups.component.scss']
})
export class ShiftGroupsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()
  shiftGroups: any[] = [];
  loading: boolean = false;
  selectedShiftGroup: any;
  filterText: string = "";
  relations: any[];
  displayAddModal: boolean = false;
  newShiftGroupName: string = "";
  displayUpdateModal: boolean = false;
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getShiftGroups();
  }

  getShiftGroups() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'mesaigruplari',
        id: '0'
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
        console.log('tip_s mesaigruplari: ', data);

        this.shiftGroups = [...data];        
        this.selectShiftGroup(this.shiftGroups[0]);        

        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();              
        }, 1000);  
        
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  selectShiftGroup(sg:any) {
    this.selectedShiftGroup = sg;
    this.getRelations(sg);
  }

  getRelations(sg:any) {
    var sp: any[] = [
      {
        mkodu: 'yek155',
        kaynakid: '0',
        hedefid: sg.ID.toString(),
        hedeftablo: 'mesaigruplari',
        
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
        console.log('relations : ', data);

        this.relations = [...data];
                
      });
  }
  
  relationStateChange(item:any, process:any) {
    var mkodu;
    if (process == "i") {
      mkodu = "yek156"
    } else if (process == "d") {
      mkodu = "yek157"
    }

    var sp: any[] = [
      {
        mkodu: mkodu,
        kaynakid: item.kaynakId.toString(),
        hedefid: item.hedefId.toString(),
        hedeftablo: 'mesaigruplari',
        extra: ""
        
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
        console.log('relations durum değişti: ', data);

        this.relations = [...data];        
                
      });
  }

  openAddModal() {
    this.displayAddModal = true;
  }

  closeAddModal() {
    this.displayAddModal = false;
    this.newShiftGroupName = ""
  }

  openUpdateModal() {
    this.displayUpdateModal = true;
    this.newShiftGroupName = this.selectedShiftGroup.ad;
  }

  closeUpdateModal() {
    this.displayUpdateModal = false;
    this.newShiftGroupName = ""
  }
  
  checkAddShiftGroupRequest() {
    Swal.fire({
      title: `"${this.newShiftGroupName}" mesai grubu tanımı olarak eklensin mi? `,
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
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.addShiftGroup();

        Swal.fire({
          title: `Tanım Eklendi`,
          icon: 'success',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
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
          heightAuto: false
        });
      } else if (result.isDenied) {
      }
    });
  }
  
  addShiftGroup() {
    var sp: any[] = [
      {
        mkodu: 'yek123',
        kaynak: 'mesaigruplari',
        id: '0',
        ad: this.newShiftGroupName,
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc != 1) {
            return;
          }

          console.log('Mesai Grubu Eklendi : ', data);
          this.toastrService.success(
            this.translateService.instant('Yeni_Tanım_Eklendi'),
            this.translateService.instant('Başarılı')
          );

          this.getShiftGroups();
          this.closeAddModal();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  updateShiftGroup() {
    Swal.fire({
      title: `Seçilen mesai grubu adı "${this.selectedShiftGroup.ad}" "${this.newShiftGroupName}" olarak değiştirilsin mi? `,
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
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        var sp: any[] = [
          {
            mkodu: 'yek124',
            kaynak: 'mesaigruplari',
            id: this.selectedShiftGroup.ID.toString(),
            ad: this.newShiftGroupName,
          },
        ];
    
        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (response: any) => {
              const data = response[0].x;
              const message = response[0].z;
    
              if (message.islemsonuc != 1) {
                return;
              }
    
              console.log('Mesai Grubu Güncellendi : ', data);
              this.toastrService.success(
                this.translateService.instant('Tanım_Güncellendi'),
                this.translateService.instant('Başarılı')
              );
    
              this.getShiftGroups();
              this.closeUpdateModal();
            },
            (err) => {
              this.toastrService.error(
                this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                this.translateService.instant('Hata')
              );
            }
          );

        Swal.fire({
          title: `Tanım Güncellendi`,
          icon: 'success',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
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
          heightAuto: false
        });
      } else if (result.isDenied) {
      }
    });


    
  }

  deleteShiftGroup() {
    var sp: any[] = [
      {
        mkodu: 'yek125',
        kaynak: 'mesaigruplari',
        id: this.selectedShiftGroup.ID.toString()
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc != 1) {
            return;
          }

          console.log(this.selectedShiftGroup, ' Kaldırıldı : ', data);
          this.toastrService.success(
            this.translateService.instant('Tanım_Kaldırıldı'),
            this.translateService.instant('Başarılı')
          );

          this.getShiftGroups();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  changePriority(item:any) {
    var sp: any[] = [
      {
        mkodu: 'yek158',
	      mesai: item.kaynakId.toString(),
	      grup: this.selectedShiftGroup.ID.toString(),
	      tip: item.extra3 == '1' ? 'y' : 'v'
      },
    ];

    console.log("Öncelik Parametre : ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc != 1) {
            return;
          }

          this.relations = [...data];
          console.log("öncelik değişti", this.relations);
          
          this.toastrService.success(
            this.translateService.instant('Öncelik_Değiştirildi'),
            this.translateService.instant('Başarılı')
          );

          
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
