import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authority-roles',
  templateUrl: './authority-roles.component.html',
  styleUrls: ['./authority-roles.component.scss']
})
export class AuthorityRolesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  filterText: string = "";
  selectedIndex: 0;
  roles: any[] = [];
  selectedRole: any;
  keys: any[] = ["Pdks", "Access", "Ziyaretci", "Yemekhane", "Kantin", "Otopark"];
  checkboxValues: any[] = [];
  checkboxData: any = {};
  menuAuthorizations: any[] = [];
  shiftAuthorizations: any[]= [];
  reportAuthorizations: any[]= [];
  vacationAuthorizations: any[]= [];
  roleName: string = "";
  display: boolean = false;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getRoles();
    
  }
  changeTabMenu(event: any) {
    if (event.tab) {
      if (event.index == 0) {
        this.selectedIndex = event.index;
        // this.getShifts();
      } else if (event.index == 1) {
        this.selectedIndex = event.index;
      } else if (event.index == 2) {
        this.selectedIndex = event.index;
      } else if (event.index == 3) {
        this.selectedIndex = event.index;
      }
    }
  }

  getRoles() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: "yek041",
        kaynak: "yetkisablon",
        id: "0"
      }
    ];
    console.log("Rolleri Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.roles = [...data];
        console.log("Roller Geldi : ", this.roles);
        this.selectRole(this.roles[0]);
        
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  selectRole(role: any) {
    this.selectedRole = role;
    this.getRoleDetail(role);
    this.getMenuAuth(role);
    this.getShiftAuth(role);
    this.getVacationAuth(role);
    this.getReportAuth(role);
  }
  
  getRoleDetail(role: any) {
    var sp: any[] = [
      {
        mkodu: "yek178",
        rolid: role.ID.toString()
      }
    ];
    console.log("Rol Detay Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.checkboxValues = [...data];
        console.log("Rol Detay Geldi : ", data);
        this.keys.forEach(key => {
          this.checkboxData[key] = Array.from(this.checkboxValues[0][key]).map(val => val === "1");
        });

        console.log("TESTO :", this.checkboxData);
        console.log("TESTO :", this.checkboxData['Access'][0]);
        console.log("TESTO :", this.checkboxData['Access'][1]);
        console.log("TESTO :", this.checkboxData['Access'][2]);
        
      });
  }


  onCheckboxChange() {
    const result = this.keys.reduce((acc, key) => {
      acc[key] = this.checkboxData[key].map((val:any) => (val ? "1" : "0")).join('');
      return acc;
    }, {});

    console.log("API'ye gönderilecek veri:", result);
  }


  getMenuAuth(role: any) {
    var sp: any[] = [
      {
        mkodu: "yek179",
        rolid: role.ID.toString()
      }
    ];
    console.log("Menü yetkilendirme Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.menuAuthorizations = [...data];
        console.log("Menü yetkilendirme Geldi : ", data);
      });
  }

  getShiftAuth(role: any) {
    var sp: any[] = [
      {
        mkodu: "yek180",
        rolid: role.ID.toString()
      }
    ];
    console.log("Vardiya yetkilendirme Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.shiftAuthorizations = [...data];
        console.log("Vardiya yetkilendirme Geldi : ", data);
      });
  }

  getVacationAuth(role: any) {
    var sp: any[] = [
      {
        mkodu: "yek181",
        rolid: role.ID.toString()
      }
    ];
    console.log("İzin yetkilendirme Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.vacationAuthorizations = [...data];
        console.log("İzin yetkilendirme Geldi : ", data);
      });
  }

  getReportAuth(role: any) {
    var sp: any[] = [
      {
        mkodu: "yek182",
        rolid: role.ID.toString()
      }
    ];
    console.log("Rapor yetkilendirme Getir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.reportAuthorizations = [...data];
        console.log("Rapor yetkilendirme Geldi : ", data);
      });
  }

  onChangeShiftAuth(item:any, event: any){
    var sp: any[] = [
      {
        mkodu: "yek186",
        rolid: this.selectedRole.ID.toString(),
        mesaiid: item.MesaiID.toString(),
        goruntulenme: event ? "1" : "0"
      }
    ];
    console.log("Mesai yetkilendirme Değiştir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        console.log("Mesai yetkilendirme değişti : ", data);

        this.toastrService.success(
          this.translateService.instant('Görüntüleme_Yetkisi_Değiştirildi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  onChangeReportAuth(item:any, event: any){
    var sp: any[] = [
      {
        mkodu: "yek185",
        rolid: this.selectedRole.ID.toString(),
        rapor: item.RaporId.toString(),
        goruntulenme: event ? "1" : "0"
      }
    ];
    console.log("Rapor yetkilendirme Değiştir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        console.log("Rapor yetkilendirme değişti : ", data);

        this.toastrService.success(
          this.translateService.instant('Görüntüleme_Yetkisi_Değiştirildi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  onChangeMenuAuth(item:any, event: any){
    var sp: any[] = [
      {
        mkodu: "yek184",
        rolid: this.selectedRole.ID.toString(),
        menu: item.Menu,
        goruntulenme: event ? "1" : "0"
      }
    ];
    console.log("Menü yetkilendirme Değiştir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        console.log("Menü yetkilendirme değişti : ", data);

        this.toastrService.success(
          this.translateService.instant('Görüntüleme_Yetkisi_Değiştirildi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  onChangeVacationAuth(item:any, event: any){
    var sp: any[] = [
      {
        mkodu: "yek183",
        rolid: this.selectedRole.ID.toString(),
        izinid: item.IzinID.toString(),
        goruntulenme: event ? "1" : "0"
      }
    ];
    console.log("İzin yetkilendirme Değiştir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        console.log("İzin yetkilendirme değişti : ", data);

        this.toastrService.success(
          this.translateService.instant('Görüntüleme_Yetkisi_Değiştirildi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  addRole() {
    var sp: any[] = [
      {
        mkodu: "yek187",
        ad: this.roleName
      }
    ];
    console.log("Yeni Rol Ekle Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        

        console.log("Yeni Rol Eklendi : ", data);

        this.roles = [...data];
        this.toastrService.success(
          this.translateService.instant('Yeni_Rol_Eklendi'),
          this.translateService.instant('Başarılı')
        );

        this.closeAction();
      });
  }

  openDialog() {
    this.display = true;
  }

  closeAction() {
    this.display = false;
  }

  deleteRole() {
    Swal.fire({
      title: `Seçilen rol "${this.selectedRole.Ad}" kaldırılsın mı? `,
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
    }).then((result) => {
      if (result.isConfirmed) {
        var sp: any[] = [
          {
            mkodu: "yek188",
            id: this.selectedRole.ID.toString()
          }
        ];
        console.log("Rol Sil Param : ", sp);
    
        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;
    
            if (message.islemsonuc == -1) {
              return;
            }
            
    
            console.log("Rol Silindi: ", data);
    
            // this.toastrService.success(
            //   this.translateService.instant('Rol_Silindi'),
            //   this.translateService.instant('Başarılı')
            // );
    
            Swal.fire({
              title: `Rol Kaldırıldı`,
              icon: 'success',
              iconColor: '#ed1b24',
              confirmButtonColor: '#ed1b24',
              confirmButtonText: 'Kapat',
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

            this.closeAction();
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
        });
      } else if (result.isDenied) {
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

