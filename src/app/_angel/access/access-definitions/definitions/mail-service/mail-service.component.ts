import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-mail-service',
  templateUrl: './mail-service.component.html',
  styleUrls: ['./mail-service.component.scss']
})
export class MailServiceComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  active: boolean = false;
  smptMailServer: string = "";
  smptPort: number = 0;
  popMailServer: string = "";
  popPort: number = 0;
  domain: string = "";
  sslUse: boolean = false;
  fromMailAddress: string = "";
  loginName: string = "";
  password: string = "";
  isPasswordVisible: boolean = false;
  mailHistories: any[] = [];
  displayHistory: boolean = false;
  displaySendMail: boolean = false;
  mail: string = "";
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
        kaynak: 'mailservis',
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
            if (itemx?.ad == "Mail") {
              this.active = itemx?.deger == 1 ? true : false;
            } else if (itemx?.ad == "MailSunucu") {
              this.smptMailServer = itemx?.deger;
            } else if (itemx?.ad == "MailPort") {
              this.smptPort = itemx?.deger;
            } else if (itemx?.ad == "GelenMailSunucu") {
              this.popMailServer = itemx?.deger;
            } else if (itemx?.ad == "GelenMailPort") {
              this.popPort = itemx?.deger;
            } else if (itemx?.ad == "MailDomain") {
              this.domain = itemx?.deger;
            } else if (itemx?.ad == "MailSSL") {
              this.sslUse = itemx?.deger == 1 ? true : false;
            } else if (itemx?.ad == "MailKullanici") {
              this.loginName = itemx?.deger;
            } else if (itemx?.ad == "MailSifre") {
              this.password = itemx?.deger;
            } else if (itemx?.ad == "MailFrom") {
              this.fromMailAddress = itemx?.deger;
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
        mail: this.active ? "1" : "0",
        mailsunucu: this.smptMailServer,
        mailport: this.smptPort,
        mailkullaniciadi: this.loginName,
        mailparola: this.password,
        mailfrom: this.fromMailAddress,
        type: this.active ? "1" : "0",
        mailssl: this.sslUse ? "1" : "0",
        maildomain: this.domain,
        gelenmailsunucu: this.popMailServer, 
        gelenmailport: this.popPort,   
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
            if (itemx?.ad == "Mail") {
              this.active = itemx?.deger == 1 ? true : false;
            } else if (itemx?.ad == "MailSunucu") {
              this.smptMailServer = itemx?.deger;
            } else if (itemx?.ad == "MailPort") {
              this.smptPort = itemx?.deger;
            } else if (itemx?.ad == "GelenMailSunucu") {
              this.popMailServer = itemx?.deger;
            } else if (itemx?.ad == "GelenMailPort") {
              this.popPort = itemx?.deger;
            } else if (itemx?.ad == "MailDomain") {
              this.domain = itemx?.deger;
            } else if (itemx?.ad == "MailSSL") {
              this.sslUse = itemx?.deger == 1 ? true : false;
            } else if (itemx?.ad == "MailKullanici") {
              this.loginName = itemx?.deger;
            } else if (itemx?.ad == "MailSifre") {
              this.password = itemx?.deger;
            } else if (itemx?.ad == "MailFrom") {
              this.fromMailAddress = itemx?.deger;
            }
          });
      
        });

        this.toastrService.success(
          this.translateService.instant('Tanımlama_Ayarları_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }
  
  getMailHistory() {
    var sp: any[] = [
      {
        mkodu: "yek171",
        servisid: "0"
      },
    ];

    console.log('Mail Geçmiş Paramatreleri :', sp);

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
          console.log('Mail Geçmiş Geldi: ', data);

          this.mailHistories = [...data];
          
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  showHistory() {
    this.displayHistory = true;
    this.getMailHistory();
  }
  
  showSendMail() {
    this.displaySendMail = true;
  }

  closeAction() {
    this.displayHistory = false;
    this.displaySendMail = false;
  }

  sendMail() {
    var sp: any[] = [
      {
        mkodu: "yek172",
        email: this.mail
      },
    ];

    console.log('Mail Gönder Paramatreleri :', sp);

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
          console.log('Mail Gönderildi: ', data);

          this.toastrService.success(
            this.translateService.instant('Mail_Gönderildi'),
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