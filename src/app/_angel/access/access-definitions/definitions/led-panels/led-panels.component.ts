import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-led-panels',
  templateUrl: './led-panels.component.html',
  styleUrls: ['./led-panels.component.scss']
})
export class LedPanelsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  filterText: string = "";
  ledPanels: any[] = [];

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getLedPanels();
  }

  getLedPanels() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek196'
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].m
        
        if (message.islemsonuc == -1) {
          return;
        }

        this.ledPanels = [...data];
        console.log("Led Paneller Geldi : ", data);
                
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  findLedPanel() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek197'
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].m
        
        if (message.islemsonuc == -1) {
          return;
        }

        console.log("Led Panel Ara Geldi : ", data);
                
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  ledPanelTest(item: any) {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek198',
        led: item.ad
      }
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].m
        
        if (message.islemsonuc == -1) {
          return;
        }

        console.log("Led Panel Test : ", data);
                
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
