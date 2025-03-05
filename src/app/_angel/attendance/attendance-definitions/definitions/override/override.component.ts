import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-override',
  templateUrl: './override.component.html',
  styleUrls: ['./override.component.scss']
})
export class OverrideComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()
  collars: any[] = [];
  permitTypes: any[] = [];
  override: any[] = [];
  loading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  selectedPermitType : any;
  selectedCollar  : any;
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCollar();
    this.getPermitTypes();
    this.getOverride();
  }

  goToFirstPage() {
    this.pageNumber = 1;
  }

  goToLastPage() {
    this.pageNumber = this.totalPages;
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  getCollar() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'cbo_yaka',
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
        console.log('cbo_yaka: ', data);

        this.collars = [...data];        

      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  getPermitTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek131'
      }
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
        console.log('izin tipleri: ', data);
        this.permitTypes = [...data];
      });
  }

  getOverride() {
    var sp: any[] = [
      {
        mkodu: 'yek152'
      }
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
        console.log('izin ezme: ', data);
        this.override = [...data];
        this.totalPages = Math.ceil(this.override.length / this.pageSize);
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  


  updateOverride(override: any, day:any) {
    var sp: any[] = [
      {
        mkodu: 'yek153',
        izintip: override.TipID.toString(),
        yaka: override.YakaID.toString(),
        ieid: override.Id.toString(),
        gun: day 
      }
    ];
    console.log("Update : ", sp);
    

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }

        this.override = this.override.map((item: any) => {
          if (item.Id === data[0].Id) {
            return { ...item, ...data[0] };
          }
          return item;
        });
      });
  }

  filterOverride() {
    var sp: any[] = [
      {
        mkodu: 'yek154',
        izintip: this.selectedPermitType?.id.toString() || '-1',
        yaka: this.selectedCollar?.ID.toString() || '-1'
      }
    ];

    console.log("Filtre : ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('izin ezme filtrelendi: ', data);
        this.override = [...data];
        this.totalPages = Math.ceil(this.override.length / this.pageSize);
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
