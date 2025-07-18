import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';

@Component({
    selector: 'app-working-periods',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DropdownModule,
        ReactiveFormsModule,
        DatePickerModule,
        DataNotFoundComponent
    ],
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
    ) { }

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
            { mkodu: "yek041", id: "0", kaynak: "sys_AyrilisNedeni" }
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
