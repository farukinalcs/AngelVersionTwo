import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-shift-info',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        DropdownModule,
        ReactiveFormsModule
    ],
    templateUrl: './shift-info.component.html',
    styleUrls: ['./shift-info.component.scss']
})
export class ShiftInfoComponent implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    @Input() operationType: any;
    @Output() formEvent = new EventEmitter<any>();
    @Input() checkFormController: any;
    salaryTypes: any[] = [];
    form: FormGroup;
    registerDetail: any[] = [];

    constructor(
        private profileService: ProfileService,
        private toasterService: ToastrService,
        private translateService: TranslateService,
        private fb: FormBuilder,
        private store: Store<{ form: FormState }>
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getSalaryType();

        if (this.operationType == 'i') {
            this.changedFormValue();
        }

        this.store.select('form').pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
            if (state.shiftInfo) {
                this.form.patchValue(state.shiftInfo, { emitEvent: false });
            }
        });

        this.saveFormToStore();
    }

    ngOnChanges() {
        // if (this.operationType == 'u' && this.registerDetail.length > 0) {
        //   this.setFormValue();
        // }
    }

    getSalaryType() {
        var sp: any[] = [
            { mkodu: 'yek041', kaynak: 'sys_MaasTipi', id: '0' }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Maaş Tipleri Geldi :", data);
            this.salaryTypes = [...data];

            this.store.select('form').pipe(take(1)).subscribe((state) => {
                if (!state.shiftInfo && this.operationType == 'u') {
                    this.getRegisterDetail();
                }
            });
        });
    }

    createForm() {
        this.form = this.fb.group({
            salaryType: [""],
            overtime: [false],
            missingTime: [false],
            missingTimeOvertime: [false],
            earlyWork: [false],
            missingDay: [false],
            nightRaise: [false]
        });
    }

    changedFormValue() {
        this.form?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            this.formEvent.emit(value);
        });
    }

    getRegisterDetail() {
        var sp: any[] = [
            { mkodu: 'yek209', id: this.selectedRegister?.Id.toString() }
        ];
        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;
            if (message.islemsonuc == -1) {
                return;
            }
            console.log("Sicil Detay Geldi : ", data);
            this.registerDetail = [...data];
            this.setFormValue();
        });
    }

    setFormValue() {
        const salaryTypeValue = this.salaryTypes.find(item => item.ID === this.registerDetail[0]?.maastipi);

        this.form.patchValue({
            salaryType: salaryTypeValue || null,
            overtime: this.registerDetail[0].fazlamesai,
            missingTime: this.registerDetail[0].eksikmesai,
            missingTimeOvertime: this.registerDetail[0].eksikmesai_fm,
            earlyWork: this.registerDetail[0].erkenmesai,
            missingDay: this.registerDetail[0].eksikgun,
            nightRaise: this.registerDetail[0].gecezammi
        });
    }

    saveFormToStore() {
        this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            this.store.dispatch(updateForm({ formName: 'shiftInfo', formData: this.form.value }));
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
