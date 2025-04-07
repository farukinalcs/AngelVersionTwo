import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './form-fields.component.html',
  styleUrl: './form-fields.component.scss'
})
export class FormFieldsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  credential: boolean;
  name: boolean;
  surname: boolean;
  explanation: boolean;
  company: boolean;
  registry: boolean;
  card: boolean;
  plate: boolean;
  
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
        kaynak: 'ziyaretciform',
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
            if (itemx?.ad == "ziyaretciad") {
              this.name = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcisoyad") {
              this.surname = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikimlikbilgisi") {
              this.credential = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciaciklama") {
              this.explanation = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcifirma") {
              this.company = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciplaka") {
              this.plate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikimegeldi") {
              this.registry = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikartlari") {
              this.card = itemx?.deger == "1" ? true : false;
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
        kaynak: "ziyaretciform"
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
            if (itemx?.ad == "ziyaretciad") {
              this.name = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcisoyad") {
              this.surname = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikimlikbilgisi") {
              this.credential = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciaciklama") {
              this.explanation = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcifirma") {
              this.company = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretciplaka") {
              this.plate = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikimegeldi") {
              this.registry = itemx?.deger == "1" ? true : false;
            } else if (itemx?.ad == "ziyaretcikartlari") {
              this.card = itemx?.deger == "1" ? true : false;
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