import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-ftp-info',
  templateUrl: './ftp-info.component.html',
  styleUrls: ['./ftp-info.component.scss']
})
export class FtpInfoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  ftpServer: string = "";
  loginName: string = "";
  password: string = "";
  isPasswordVisible: boolean = false;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getInfo();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getInfo() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'ftp',
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx?.ad == "ftpkullanici") {
              this.loginName = itemx?.deger;
            } else if (itemx?.ad == "ftpsifre") {
              this.password = itemx?.deger;
            } else if (itemx?.ad == "ftpsunucu") {
              this.ftpServer = itemx?.deger;
            }
          });
        });

        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  save() {
    var sp: any[] = [
      {
        mkodu: "yek167",
        ftpsunucu: this.ftpServer,
        ftpkullaniciadi: this.loginName, 
        ftpparola: this.password 
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("parmak izi sayısı Güncellendi: ", data);
        

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx?.ad == "ftpkullanici") {
              this.loginName = itemx?.deger;
            } else if (itemx?.ad == "ftpsifre") {
              this.password = itemx?.deger;
            } else if (itemx?.ad == "ftpsunucu") {
              this.ftpServer = itemx?.deger;
            }
          });
      
        });

        this.toastrService.success(
          this.translateService.instant('Tanımlama_Ayarları_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
