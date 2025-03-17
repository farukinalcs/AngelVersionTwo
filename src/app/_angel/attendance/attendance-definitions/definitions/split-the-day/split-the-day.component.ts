import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-split-the-day',
  templateUrl: './split-the-day.component.html',
  styleUrls: ['./split-the-day.component.scss']
})
export class SplitTheDayComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()


  form: FormGroup;
  // Eşleme nesnesi
  private formMapping: { [key: string]: string } = {
    gunbolmenm: 'regularWorking',
    gunbolmefm: 'overtime',
    gunbolmert: 'publicHoliday',
    gunbolmertsr: 'publicHolidayTime',
    gunbolmegz: 'nightRaise',
    gunbolmegv: 'nightShiftTime',
    gunbolmefmform: 'overtimeForm',
    gunbolmehtform: 'weekBreakForm',
    gunbolmertform: 'publicHolidayForm',
    gunbolmeizinlerformdan: 'permissionForm',
    gunbolmezamani: 'daySplitTime'
  };
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getParameters();
  }

  createForm() {
    this.form = this.formBuilder.group({
      regularWorking: [''],
      overtime: [''],
      publicHoliday: [''],
      publicHolidayTime: [''],
      nightRaise: [''],
      nightShiftTime: [''],
      overtimeForm: [''],
      weekBreakForm: [''],
      publicHolidayForm: [''],
      permissionForm: [''],
      daySplitTime: ['']
    });
  }

  getParameters() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'gunbolme',
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
        
          item.x.forEach((itemx: any) => {
            const formControlName = this.formMapping[itemx.ad];
            if (formControlName && formControlName != "daySplitTime") {
              this.form.get(formControlName)?.setValue(itemx.deger == 1);
            } else if (formControlName == "daySplitTime") {
              this.form.get(formControlName)?.setValue(itemx.deger);
            }
          });
      
        });
        
        console.log("data :", data);
        console.log("form value :", this.form.value);

        
      });
  }
  

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek129',
        nm: this.form.get('regularWorking')?.value ? '1' : '0',
        fm: this.form.get('overtime')?.value ? '1' : '0',
        rt: this.form.get('publicHoliday')?.value ? '1' : '0',
        rtsr: this.form.get('publicHolidayTime')?.value ? '1' : '0',
        gz: this.form.get('nightRaise')?.value ? '1' : '0',
        gv: this.form.get('nightShiftTime')?.value ? '1' : '0',
        fmform: this.form.get('overtimeForm')?.value ? '1' : '0',
        htform: this.form.get('weekBreakForm')?.value ? '1' : '0',
        rtform: this.form.get('publicHolidayForm')?.value ? '1' : '0',
        rtv1: '0',
        izinlerformdan: this.form.get('permissionForm')?.value ? '1' : '0',
        gunbolmezamani: this.form.get('daySplitTime')?.value
      }
    ];

    console.log("Gün Bölme Parametreleri : ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        console.log("gün bölme Güncellendi: ", data);

        data.forEach((item:any) => {
          if (item.z.islemsonuc != 1) {
            return;
          }
          
          item.x.forEach((itemx: any) => {
            const formControlName = this.formMapping[itemx.ad];
            if (formControlName && formControlName != "daySplitTime") {
              this.form.get(formControlName)?.setValue(itemx.deger == 1);
            } else if (formControlName == "daySplitTime") {
              this.form.get(formControlName)?.setValue(itemx.deger);
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
