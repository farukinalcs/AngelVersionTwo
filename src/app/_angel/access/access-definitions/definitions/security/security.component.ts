import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  minPassLength: number;
  usePassDifference: number;
  includeNumber: boolean;
  capitalization: boolean;
  specialCharacter: boolean;
  loginMessage: boolean;
  mobileSpecificLocation: boolean;
  timeRange: number;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSecurityInfo();
    this.getTimeRange();
  }

  getSecurityInfo() {
    var sp: any[] = [
      {
        mkodu: "yek169"
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
            if (itemx?.Ad == "sifreuzunluk") {
              this.minPassLength = itemx?.Deger;
            } else if (itemx?.Ad == "sifreson10") {
              this.usePassDifference = itemx?.Deger;
            } else if (itemx?.Ad == "sifrerakam") {
              this.includeNumber = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "sifrebuyukkucuk") {
              this.capitalization = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "sifreozelkarakter") {
              this.specialCharacter = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "loginmesajlari") {
              this.loginMessage = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "Mobilde Tanımlı Lokasyona Zorla") {
              this.mobileSpecificLocation = itemx?.Deger == "1" ? true : false;
            }    
          });
        });

        
      });
  }

  getTimeRange() {
    var sp: any[] = [
      {
        mkodu: "yek170"
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
            if (itemx?.name == "SifreDegistirmeZamani") {
              this.timeRange = itemx?.value;
            }    
          });
        });

        
      });
  }

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek173',
        loginmesajlari: this.loginMessage ? "1" : "0",
        sonon: this.usePassDifference.toString(),
        ozelkarakter: this.specialCharacter ? "1" : "0",
        buyukkucuk: this.capitalization ? "1" : "0",
        rakam: this.includeNumber ? "1" : "0",
        dgs: this.timeRange.toString(),
        uzunluk: this.minPassLength.toString(),
        mobillokasyon: this.mobileSpecificLocation ? "1" : "0" 

      }
    ];

    console.log("Şifre Param: ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("Şifre Güncellendi: ", data);
        

        data.forEach((item:any) => {
          if (item.z.islemsonuc == -1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx?.Ad == "sifreuzunluk") {
              this.minPassLength = itemx?.Deger;
            } else if (itemx?.Ad == "sifreson10") {
              this.usePassDifference = itemx?.Deger;
            } else if (itemx?.Ad == "sifrerakam") {
              this.includeNumber = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "sifrebuyukkucuk") {
              this.capitalization = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "sifreozelkarakter") {
              this.specialCharacter = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "loginmesajlari") {
              this.loginMessage = itemx?.Deger == "1" ? true : false;
            } else if (itemx?.Ad == "Mobilde Tanımlı Lokasyona Zorla") {
              this.mobileSpecificLocation = itemx?.Deger == "1" ? true : false;
            }
          });
      
          this.toastrService.success(
            this.translateService.instant('Tanımlama_Ayarları_Güncellendi'),
            this.translateService.instant('Başarılı')
          );
        });

        
      });
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
