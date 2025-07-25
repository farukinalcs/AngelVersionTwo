import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact-info',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule
    ],
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    @Input() operationType: any;
    form: FormGroup;
    registerDetail: any[] = [];

    constructor(
        private translateService: TranslateService,
        private profileService: ProfileService,
        private toastrService: ToastrService,
        private formBuilder: FormBuilder,
        private store: Store<{ form: FormState }>
    ) { }

    ngOnInit(): void {
        this.createForm();

        this.store.select('form').pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
            if (state.contactInfo) {
                this.form.patchValue(state.contactInfo, { emitEvent: false });
            }
        });

        this.saveFormToStore();
    }

    ngOnChanges() {
        this.store.select('form').pipe(take(1)).subscribe((state) => {
            if (!state.contactInfo && this.operationType == 'u') {
                this.getRegisterDetail();
            }
        });
    }

    createForm() {
        this.form = this.formBuilder.group({
            tel: [""],
            mobilePhone: [""],
            mail: [""],
            province: [""],
            town: [""],
            address: [""]
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
        this.form?.get('tel')?.setValue(this.registerDetail[0].telefon1);
        this.form?.get('mobilePhone')?.setValue(this.registerDetail[0].ceptelefon);
        this.form?.get('mail')?.setValue(this.registerDetail[0].email);
        this.form?.get('province')?.setValue(this.registerDetail[0].Il);
        this.form?.get('town')?.setValue(this.registerDetail[0].Ilce);
        this.form?.get('address')?.setValue(this.registerDetail[0].adres);


    }

    saveFormToStore() {
        this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            this.store.dispatch(updateForm({ formName: 'contactInfo', formData: this.form.value }));
        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
