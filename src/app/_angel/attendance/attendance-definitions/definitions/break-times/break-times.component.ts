import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-break-times',
  templateUrl: './break-times.component.html',
  styleUrls: ['./break-times.component.scss']
})
export class BreakTimesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  regularWorking: any = false;
  overtime: any = false;
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getParameters();
  }

  getParameters() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'arasure',
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
            if (itemx.ad == "arasurenm") {
              this.regularWorking = itemx.deger == 1 ? true : false;
            } else if (itemx.ad == "arasurefm") {
              this.overtime = itemx.deger == 1 ? true : false;
            }
          });
      
        });
        
        console.log("data :", data);
        console.log("nm :", this.regularWorking);
        console.log("fm :", this.overtime);

        
      });
  }
  

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek128',
        fm: this.overtime ? '1' : '0',
        nm: this.regularWorking ? '1' : '0'
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("fm-nm Güncellend: ", data);

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx.ad == "arasurenm") {
              this.regularWorking = itemx.deger == 1 ? true : false;
            } else if (itemx.ad == "arasurefm") {
              this.overtime = itemx.deger == 1 ? true : false;
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
