import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  onlineVisitor: boolean;
  exitTurnstile: boolean;
  webcam1: boolean;
  webcam2: boolean;
  visitorFullNameCheck: boolean;
  visitorAccessGroup: boolean;
  vacationRights: boolean;
  visitorOSHA: boolean;
  confidentialityDate: boolean;
  formPrint: boolean;
  visitorMail: boolean;
  
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
        kaynak: 'ziyaretci',
      }
    ];

    // onlineziyaretci x
    // cikisturnikeden
    // ziyaretcikamera1
    // ziyaretcikamera2
    // ziyaretciadsoyadkontrol
    // ziyaretcigecisgrubu
    // ziyaretciisg
    // ziyaretcigiz
    // ziyaretciformprint

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
            if (itemx?.ad == "onlineziyaretci") {
              this.onlineVisitor = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "cikisturnikeden") {
              this.exitTurnstile = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikamera1") {
              this.webcam1 = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikamera2") {
              this.webcam2 = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciadsoyadkontrol") {
              this.visitorFullNameCheck = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcigecisgrubu") {
              this.visitorAccessGroup = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciisg") {
              this.visitorOSHA = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcigiz") {
              this.confidentialityDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciformprint") {
              this.formPrint = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretmail") {
              this.visitorMail = itemx?.deger == "1" ? true : false;
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
        kaynak: "ziyaretci"
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
            if (itemx?.ad == "onlineziyaretci") {
              this.onlineVisitor = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "cikisturnikeden") {
              this.exitTurnstile = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikamera1") {
              this.webcam1 = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikamera2") {
              this.webcam2 = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciadsoyadkontrol") {
              this.visitorFullNameCheck = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcigecisgrubu") {
              this.visitorAccessGroup = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciisg") {
              this.visitorOSHA = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcigiz") {
              this.confidentialityDate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciformprint") {
              this.formPrint = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretmail") {
              this.visitorMail = itemx?.deger == "1" ? true : false;
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