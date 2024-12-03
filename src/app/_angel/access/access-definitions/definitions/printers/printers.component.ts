import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  filterText: string = "";
  printers: any[] = [];
  myExPrinter: any[] = [];

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPrinters();
  }


  getPrinters() {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek199'
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

        this.printers = [...data];
        console.log("Yazıcılar Geldi : ", data);
        this.getMyExPrinter();

        
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  getMyExPrinter() {
    var sp: any[] = [
      {
        mkodu: 'yek201'
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

        this.myExPrinter = [...data];
        console.log("Ex Yazıcı Geldi : ", data);
                
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  selectPrinter(item: any) {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek104',
        ad: 'printer_Settings',
        deger: item.ad
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

        console.log("Yazıcı Seçildi : ", data);
                
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  printerTest(item: any) {
    this.loading = false;
    var sp: any[] = [
      {
        mkodu: 'yek200',
        printer: item.ad
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

        console.log("Printer Test : ", data);
                
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