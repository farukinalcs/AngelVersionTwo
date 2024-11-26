import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-excuse-card-permission-assignment',
  templateUrl: './excuse-card-permission-assignment.component.html',
  styleUrls: ['./excuse-card-permission-assignment.component.scss']
})
export class ExcuseCardPermissionAssignmentComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  state: any = false;
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
        kaynak: 'mazeretkartiizin',
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
            if (itemx.ad == "mazeretkartizinatama") {
              this.state = itemx.deger == 1 ? true : false;
            }
          });
      
        });
        
      });
  }
  

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek127',
        deger: this.state ? '1' : '0',
        type: 'mazeret'
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("mazeretkartizinatama Güncellend: ", data);
        

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx:any) => {
            if (itemx.ad == "mazeretkartizinatama") {
              this.state = itemx.deger == 1 ? true : false;
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
