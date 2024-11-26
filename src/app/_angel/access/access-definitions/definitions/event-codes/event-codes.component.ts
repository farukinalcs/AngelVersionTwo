import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-event-codes',
  templateUrl: './event-codes.component.html',
  styleUrls: ['./event-codes.component.scss']
})
export class EventCodesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  eventCodes: any[] = [];
  filterText: string = "";
  display: boolean = false;
  eventCode: string = "";
  eventDescription: string = "";

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEventCodes();
  }

  getEventCodes() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: "yek175"
      }
    ];
    console.log("Event Kodları Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.eventCodes = [...data];
        console.log("Event Kodları Geldi : ", this.eventCodes);
        
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  changeType(type: string, item: any) {
    var sp: any[] = [
      {
        mkodu: "yek176",
        tip: type,
        id: item.id.toString()
      }
    ];
    console.log("Tip Değiştir Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.eventCodes = [...data];
        console.log("Tip Değişti : ", this.eventCodes);

        this.toastrService.success(
          this.translateService.instant('Tanımlama_Ayarları_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
        
      });
  }

  openDialog() {
    this.display = true;
  }

  closeAction() {
    this.display = false;
  }

  add() {
    var sp: any[] = [
      {
        mkodu: "yek177",
        aciklama: this.eventDescription,
        kod: this.eventCode
      }
    ];
    console.log("Event ekle Param : ", sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        console.log("Event Eklendi : ", data);

        this.toastrService.success(
          this.translateService.instant('Eklendi'),
          this.translateService.instant('Başarılı')
        );
        
        this.closeAction();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

