import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-overtime-causes',
  templateUrl: './overtime-causes.component.html',
  styleUrls: ['./overtime-causes.component.scss']
})
export class OvertimeCausesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  filterText: string = '';
  overtimeCauses: any[] = [];
  selectedRowId: number | null = null;
  display: boolean = false;
  cause: string = '';
  actionType: any;
  selectedCause: any;

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getOvertimeCauses();
  }

  onRowClick(item: any) {
    this.selectedRowId = item.ID; // Seçilen satırın ID'sini sakla
  }
  

  getOvertimeCauses() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'cbo_FMNedenleri',
        id: '0'
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('FM Nedenleri: ', data);

        this.overtimeCauses = data;        
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  openAction(action: any, item?: any) {
    this.actionType = action;
    this.display = true;
    this.selectedCause = item;

    if (action == 'update') {
      this.cause = item.ad;
    }
  }

  closeAction() {
    this.display = false;
    this.cause = '';
  }

  setCause() {
    var sp: any[] = [];

    if (this.actionType == 'add') {
      sp.push(
        {
          mkodu: 'yek123',
          kaynak: 'cbo_FMNedenleri',
          id: '0',
          ad: this.cause
        }
      )
    } else if (this.actionType == 'update') {
      sp.push(
        {
          mkodu: 'yek124',
          kaynak: 'cbo_FMNedenleri',
          id: this.selectedCause.ID.toString(),
          ad: this.cause
        }
      );
    }

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }

        if (this.actionType == 'add') {
          console.log("Kayıt Eklendi : ", data);
          this.toastrService.success(
            this.translateService.instant('Yeni_Tanım_Eklendi'),
            this.translateService.instant('Başarılı')
          );
        } else if (this.actionType == 'update') {
          console.log("Kayıt Güncellendi : ", data);
          this.toastrService.success(
            this.translateService.instant('Tanım_Güncellendi'),
            this.translateService.instant('Başarılı')
          );
        }

        this.display = false;
        this.getOvertimeCauses();
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  removeCause(item:any) {
    var sp: any[] = [
      {
        mkodu: 'yek125',
        kaynak: 'cbo_FMNedenleri',
        id: item.ID.toString()
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        
        console.log(item, ' Kaldırıldı : ', data);
        this.toastrService.success(
          this.translateService.instant('Tanım_Kaldırıldı'),
          this.translateService.instant('Başarılı')
        );

        this.getOvertimeCauses();
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
