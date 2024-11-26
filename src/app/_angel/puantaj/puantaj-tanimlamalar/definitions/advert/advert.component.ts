import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  username: any = "";
  password: any = "";
  isPasswordVisible: boolean = false;

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getParameters();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getParameters() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'ilan',
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
            if (itemx.ad == "ReportStoreLogin") {
              this.username = itemx.deger;
            } else if (itemx.ad == "ReportStorePass") {
              this.password = itemx.deger;
            }
          });
      
        });
        
        console.log("data :", data);
        console.log("username :", this.username);
        console.log("pass :", this.password);

        
      });
  }
  

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek130',
        ilankullaniciadi: this.username,
        ilanparola: this.password
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("İlan Güncellend: ", data);

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          // item.x.forEach((itemx:any) => {
          //   if (itemx.ad == "arasurenm") {
          //     this.regularWorking = itemx.deger == 1 ? true : false;
          //   } else if (itemx.ad == "arasurefm") {
          //     this.overtime = itemx.deger == 1 ? true : false;
          //   }
          // });
      
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
