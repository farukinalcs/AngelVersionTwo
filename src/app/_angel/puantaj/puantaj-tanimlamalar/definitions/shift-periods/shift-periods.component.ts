import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shift-periods',
  templateUrl: './shift-periods.component.html',
  styleUrls: ['./shift-periods.component.scss']
})
export class ShiftPeriodsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()
  loading: boolean = false;
  filterText: string = "";
  shiftPeriods: any[] = [];
  selectedShiftPeriod: any;
  shiftGroups: any[];
  relations: any[];
  startPeriodDate: any;
  startPeriodTime: any;
  shiftCorrection: boolean;
  addDisplay: boolean = false;
  updateDisplay: boolean = false;
  shiftPeriodInput: string = "";
  deviceGroups: any[] = [];
  selectedDeviceGroup: any;
  
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getShiftPeriods();
  }

  getShiftPeriods() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'mesaiperiyodlari',
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

        this.shiftPeriods = [...data];        
        this.selectShiftPeriod(this.shiftPeriods[0]);
                

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

  selectShiftPeriod(sp:any) {
    this.selectedShiftPeriod = sp;
    this.matchForm(sp);
    this.getShiftGroups();
    this.getRelations(sp);
  }

  matchForm(sp: any) {
    this.startPeriodTime = sp.extra.split("#")[0];
    let date = sp.extra.split("#")[1];
    let year = date.split(".")[2];
    let month = date.split(".")[1];
    let day = date.split(".")[0];

    this.startPeriodDate = `${year}-${month}-${day}`;

    if (date !== "01.01.2000") {
      this.shiftCorrection = true;
    } else {
      this.shiftCorrection = false;
    }
  }

  getShiftGroups() {
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
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  getRelations(sg:any) {
    var sp: any[] = [
      {
        mkodu: 'yek155',
        kaynakid: '0',
        hedefid: sg.ID.toString(),
        hedeftablo: 'mesaiperiyodlari',
        
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
        kaynakid: process == "i" ? item.ID.toString() : item.Id.toString(),
        hedefid: this.selectedShiftPeriod.ID.toString(),
        hedeftablo: 'mesaiperiyodlari',
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

  openAddForm() {
    this.addDisplay = true;
    this.getDeviceGroup();
  }

  openUpdateForm() {
    this.updateDisplay = true;
    this.getDeviceGroup();
  }
  
  addShiftPeriod() {
    Swal.fire({
      title: `Girilen mesai periyodu "${this.shiftPeriodInput}" eklensin mi? `,
      // text: "You won't be able to revert this!",
      customClass: {
        container: 'my-swal'
      },
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
            mkodu: 'yek159',
            id: '0',
            ad: this.shiftPeriodInput,
            pntgroup: this.selectedDeviceGroup
          },
        ];

        console.log("Mesai Periyodu ekle parametreleri :", sp);
        
    
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
                
              this.shiftPeriods = [...data];
              this.selectShiftPeriod(this.shiftPeriods[0]);
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

  updateShiftPeriod() {
    Swal.fire({
      title: `Seçilen mesai periyodu adı "${this.selectedShiftPeriod.ad}" "${this.shiftPeriodInput}" olarak değiştirilsin mi? `,
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
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        var sp: any[] = [
          {
            mkodu: 'yek160',
            id: this.selectedShiftPeriod.ID.toString(),
            ad: this.shiftPeriodInput,
            pntgroup: this.selectedDeviceGroup
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
                
              this.shiftPeriods = [...data];
              this.selectShiftPeriod(this.shiftPeriods[0]);
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

  deleteShiftPeriod() {
    Swal.fire({
      title: `Seçilen mesai peryodu "${this.selectedShiftPeriod.ad}" silinsin mi? `,
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
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        var sp: any[] = [
          {
            mkodu: 'yek125',
            kaynak: 'mesaiperiyodlari',
            id: this.selectedShiftPeriod.ID.toString()
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
    
              console.log(this.selectedShiftPeriod, ' Kaldırıldı : ', data);
              this.toastrService.success(
                this.translateService.instant('Tanım_Kaldırıldı'),
                this.translateService.instant('Başarılı')
              );
    
              this.shiftPeriods = [...data];
              this.selectShiftPeriod(this.shiftPeriods[0]);
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

  changePriority(item:any) {
    var sp: any[] = [
      {
        mkodu: 'yek161',
        id: item.ID.toString(),
	      tip: item.varsayilan == '1' ? 'y' : 'v'
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

          if (message.islemsonuc == -1) {
            return;
          }

          console.log("öncelik değişti", data);
          
          this.getShiftPeriods();
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

  closeAction() {
    this.addDisplay = false;
    this.updateDisplay = false;
    this.shiftPeriodInput = "";
  }

  getDeviceGroup() {
    var sp: any[] = [
      {
        mkodu: 'yek162'
      },
    ];

    console.log("pnt grup Parametre : ", sp);
    
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

          console.log("pnt gruplar ", data);
          this.deviceGroups = [...data];
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
