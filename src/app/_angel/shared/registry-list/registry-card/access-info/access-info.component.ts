import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-access-info',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        DropdownModule,
        DatePickerModule,
        ReactiveFormsModule
    ],
    templateUrl: './access-info.component.html',
    styleUrls: ['./access-info.component.scss']
})
export class AccessInfoComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() fromWhere: any[];
    @Input() selectedRegister: any;
    @Input() operationType: any;
    @Output() formEvent = new EventEmitter<any>();
    @Input() checkFormController: any;

    form: FormGroup;
    userDefinitions: any[] = [];
    registerDetail: any[] = [];
    devices: any[] = [];
    deviceDetail: any[] = [];
    fingerCount: any[] = [];
    constructor(
        private profileService: ProfileService,
        private fb: FormBuilder,
        private store: Store<{ form: FormState }>
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getUserDefiniton();

        if (this.operationType == 'i') {
            this.changedFormValue();
        } else if (this.operationType == 'u') {
            this.getDevices();
            this.deviceChanged();
            this.getFingerCount();
        }

        this.store.select('form').pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
            if (state.accessInfo) {
                this.form.patchValue(state.accessInfo, { emitEvent: false });
            }
        });

        this.saveFormToStore();
    }

    ngOnChanges() {

    }

    createForm() {
        this.form = this.fb.group({
            userNumber: ["0"],
            cardNumber: ["000000000000000"],
            facilityNumber: ["00000"],
            rfLabelNumber: [""],
            rfLastValidty: [""],
            userDefinition: [""],
            master: [false],
            passCard: [false],
            device: [""]
        });
    }

    getUserDefiniton() {
        var sp: any[] = [
            { mkodu: 'yek041', kaynak: 'sys_userdef', id: '0' }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.userDefinitions = data.filter((item: any) => this.fromWhere?.includes(item.ID));

            this.store.select('form').pipe(take(1)).subscribe((state) => {
                if (!state.accessInfo && this.operationType == 'u') {
                    this.getRegisterDetail();
                }
            });
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
        const userDefValue = this.userDefinitions.find(item => item.ID == this.registerDetail[0]?.userdef);

        this.form.patchValue({
            userNumber: this.registerDetail[0].userId,
            cardNumber: this.registerDetail[0].cardID,
            facilityNumber: this.registerDetail[0].facilitycode,
            rfLabelNumber: this.registerDetail[0].facilitycode,
            rfLastValidty: this.registerDetail[0].cardID26,
            userDefinition: userDefValue || null,
            master: this.registerDetail[0].master,
            passCard: this.registerDetail[0].bypasscard,
        });

        this.form.get('userNumber')?.disable();
    }

    getDevices() {
        var sp: any[] = [{
            mkodu: 'yek111',
            id: '0',
            name: "",
            modelad: '-1',
            port: "",
            ip: "",
            ioad: '',
            kindad: '',
            controllerno: ""
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.devices = [...data];
            console.log("Terminaller Geldi :", this.devices);

            const deviceValue = this.devices[0];
            this.form.patchValue({ device: deviceValue || null });
        });
    }

    deviceChanged() {
        this.form.get("device")?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
            this.getDeviceDetail(value);
        });
    }

    getDeviceDetail(value: any) {
        var sp: any[] = [{
            mkodu: 'yek210',
            sicilid: this.selectedRegister.Id.toString(),
            terminalid: value.Id.toString()
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.deviceDetail = [...data];
            console.log("Terminaller Detay Geldi :", this.deviceDetail);

        });
    }

    getFingerCount() {
        var sp: any[] = [{
            mkodu: 'yek211',
            sicilid: this.selectedRegister.Id.toString(),
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.fingerCount = [...data];
            console.log("Parmak Sayısı Geldi :", this.deviceDetail);

        });
    }

    saveFormToStore() {
        this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            this.store.dispatch(updateForm({ formName: 'accessInfo', formData: this.form.value }));
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
