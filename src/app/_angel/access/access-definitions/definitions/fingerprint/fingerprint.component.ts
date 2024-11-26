import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.scss']
})
export class FingerprintComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  fingerprintCount: any;
  loading: boolean = false;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFingerprintCount();
  }

  getFingerprintCount() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'parmakizi',
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
            if (itemx?.ad == "parmakizi") {
              this.fingerprintCount = itemx?.deger;
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
        mkodu: 'yek166',
        parmakizi: this.fingerprintCount.toString()
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
            if (itemx.ad == "parmakizi") {
              this.fingerprintCount = itemx.deger;
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
