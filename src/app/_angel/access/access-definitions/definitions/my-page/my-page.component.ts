import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.scss']
})
export class MyPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  entryDate: boolean;
  seniorityDate: boolean;
  seniority: boolean;
  vacationRights: boolean;
  used: boolean;
  transfer: boolean;
  left: boolean;
  
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'ben',
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
            if (itemx?.ad == "bengiristarihi") {
              this.entryDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkidemtarihi") {
              this.seniorityDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkidem") {
              this.seniority = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benizinhakki") {
              this.vacationRights = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkullanilan") {
              this.used = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "bendevir") {
              this.transfer = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkalan") {
              this.left = itemx?.deger == "1" ? true : false;
            }
          });
        });

      });
  }

  save(key: any, value:any) {
    var sp: any[] = [
      {
        mkodu: "yek174",
        deger: value ? "1" : "0",
        param: key,
        kaynak: "ben"
      }
    ];

    console.log("SP: ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log(`${key} değeri "${value}" ile değiştirildi : ${data}`);
        

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx?.ad == "bengiristarihi") {
              this.entryDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkidemtarihi") {
              this.seniorityDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkidem") {
              this.seniority = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benizinhakki") {
              this.vacationRights = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkullanilan") {
              this.used = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "bendevir") {
              this.transfer = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "benkalan") {
              this.left = itemx?.deger == "1" ? true : false;
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
