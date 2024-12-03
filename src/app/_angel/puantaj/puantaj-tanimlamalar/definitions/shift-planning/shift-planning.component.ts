import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-shift-planning',
  templateUrl: './shift-planning.component.html',
  styleUrls: ['./shift-planning.component.scss']
})
export class ShiftPlanningComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  warning: any = false;
  force: any = false;
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
        kaynak: 'vardiyauyari',
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
            if (itemx.ad == "vardiyauyari") {
              this.warning = itemx.deger == 1 ? true : false;
            } else if (itemx.ad == "vardiyazorlama") {
              this.force = itemx.deger == 1 ? true : false;
            }
          });
      
        });
        
        console.log("data :", data);
        console.log("uyarı :", this.warning);
        console.log("zorlama :", this.force);

        
      });
  }
  

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek127',
        deger: this.warning ? '1' : '0',
        type: 'vardiyauyari'
      },
      {
        mkodu: 'yek127',
        deger: this.force ? '1' : '0',
        type: 'vardiyazorlama'
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("vardiyauyari-vardiyazorlama Güncellend: ", data);
        

        this.getParameters();

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