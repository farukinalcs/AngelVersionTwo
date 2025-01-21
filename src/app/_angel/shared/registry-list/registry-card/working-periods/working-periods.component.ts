import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-working-periods',
  templateUrl: './working-periods.component.html',
  styleUrls: ['./working-periods.component.scss']
})
export class WorkingPeriodsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() selectedRegister: any;
  @Input() operationType: any;
  form: FormGroup;
  reasons: any[] = [];
  periods: any[] = [];
  isFlipped: boolean = false;
  
  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getReasons();
    this.getPeriods();
  }

  createForm() {
    this.form = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: ["", Validators.required]
    })
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  getReasons() {
    let sp: any[] = [
      { mkodu: "yek041", id: "0", kaynak: "sys_AyrilisNedeni"}
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geldi :", data);
      this.reasons = data;
    });
  }

  getPeriods() {
    let sp: any[] = [
      { mkodu: "yek219", sicilid: this.selectedRegister.Id.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geldii :", data);
      this.periods = data;
    });
  }

  removePeriod(item: any) {
    let sp: any[] = [
      { mkodu: "yek220", kayitid: item.KayitID.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Kaldırıldı :", data);

      this.getPeriods();
    });
  }

  addPeriod() {
    const checkValid = this.checkValid();
    if (!checkValid) {
      this.toastrService.warning(
        this.translateService.instant('Tüm_Alanlar_Doldurulmalı!'),
        this.translateService.instant('HATA')
      );
    }

    let sp: any[] = [
      { 
        mkodu: "yek221",
        sicilid: this.selectedRegister.Id.toString(),
        giristarih: this.form.get("startDate")?.value,
        cikistarih: this.form.get("endDate")?.value,
        nedenid: this.form.get("reason")?.value.ID.toString()
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Eklendi :", data);
      this.getPeriods();
    });
  }

  checkValid() {
    return this.form.valid;
  }


  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
