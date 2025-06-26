import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { UserInformation } from '../profile/models/user-information';
import { AuthMenuService } from 'src/app/_metronic/core/services/auth-menu.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../profile/profile.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatMenuModule } from '@angular/material/menu';
import { AttendanceChangeComponent } from './request-forms/attendance-change/attendance-change.component';
import { AuthorityComponent } from './request-forms/authority/authority.component';
import { VehicleComponent } from './request-forms/vehicle/vehicle.component';
import { AdvanceComponent } from './request-forms/advance/advance.component';
import { OvertimeComponent } from './request-forms/overtime/overtime.component';
import { ShiftChangeComponent } from './request-forms/shift-change/shift-change.component';
import { ExpenseComponent } from './request-forms/expense/expense.component';
import { LeaveComponent } from './request-forms/leave/leave.component';
import { VisitorComponent } from './request-forms/visitor/visitor.component';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-new-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatProgressSpinnerModule,
        TranslateModule,
        InlineSVGModule,
        MatMenuModule,
        AttendanceChangeComponent,
        AuthorityComponent,
        VehicleComponent,
        AdvanceComponent,
        OvertimeComponent,
        ShiftChangeComponent,
        ExpenseComponent,
        LeaveComponent,
        VisitorComponent,
        SharedModule
    ],
    templateUrl: './new-profile.component.html',
    styleUrl: './new-profile.component.scss'
})
export class NewProfileComponent implements OnInit, OnDestroy {
    menuConfig: any;
    private ngUnsubscribe = new Subject();
    user$: Observable<UserType>;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';


    displayOvertimeForm: boolean;
    displayVacationForm: boolean;

    userInformation: UserInformation;
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    displayVisitRequestForm: boolean;
    displayAdvancePaymentForm: boolean;
    displayAuthorityRequestForm: boolean;
    displayVehicleRequestForm: boolean;
    displayExpenseRequestForm: boolean;
    displayShiftForm: boolean;
    displayAttendanceForm: boolean;
    imageUrl: string;
    constructor(
        private auth: AuthService,
        private authMenuService: AuthMenuService,
        public dialog: MatDialog,
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.getMenuConfig();
        this.getUserInformation();
        this.getCurrentUserInformations();
    }

    getUserInformation() {
        this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<UserInformation, ResponseDetailZ>[]) => {
            // let data = JSON.parse(response[0].x.toString());
            // let message = JSON.parse(response[0].z.toString());
            let data = response[0].x;
            let message = response[0].z;
            let responseToken = response[0].y;

            console.log("Sicil Bilgiler :", data);


            if (message.islemsonuc == 1) {
                this.userInformation = data[0];
                console.log("USER :", this.userInformation);
            }

            this.isLoading.next(false);
            this.ref.detectChanges();
        });
    }

    getMenuConfig() {
        this.authMenuService.menuConfig$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            this.menuConfig = res;
            this.ref.detectChanges();
        });

        console.log("ben ekranı menü config :", this.menuConfig);

        console.log("Kurabiye : ", this.getCookie('UserId'));
    }

    getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    getCurrentUserInformations() {
        this.user$ = this.auth.currentUserSubject.asObservable();
    }

    /* Fazla Mesai Form Dialog Penceresi */
    showOvertimeDialog() {
        this.displayOvertimeForm = true;
    }
    onHideOvertimeForm() {
        this.displayOvertimeForm = false;
    }
    /* --------------------------------- */


    /* İzin Form Dialog Penceresi */
    showVacationDialog() {
        this.displayVacationForm = true;
    }

    onHideVacationForm() {
        this.displayVacationForm = false;
    }
    /* --------------------------------- */


    /* Ziyaretçi Form Dialog Penceresi */
    showVisitRequestDialog() {
        this.displayVisitRequestForm = true;
    }
    visitRequestFormIsSend() {
        this.displayVisitRequestForm = false;
    }

    /* Yetkili Alan İsteği Form Dialog Penceresi */
    showAuthorityRequestDialog() {
        this.displayAuthorityRequestForm = true;
    }
    authorityRequestFormIsSend() {
        this.displayAuthorityRequestForm = false;
    }
    /* --------------------------------- */

    // displayAuthority() {
    //     this.displayAuthorityRequestForm = !this.displayAuthorityRequestForm;
    // }

    /* Avans Form Dialog Penceresi */
    showAdvancePaymentDialog() {
        this.displayAdvancePaymentForm = true;
    }
    advancePaymentFormIsSend() {
        this.displayAdvancePaymentForm = false;
    }
    /* --------------------------------- */
    
    // displayAdvance() {
    //     this.displayAdvancePaymentForm = !this.displayAdvancePaymentForm;
    // }

    
    displayVehicle() {
        this.displayVehicleRequestForm = !this.displayVehicleRequestForm;
    }

    displayExpense() {
        this.displayExpenseRequestForm = !this.displayExpenseRequestForm;
    }

    showShiftDialog() {
        this.displayShiftForm = true;
    }

    onHideShiftForm() {
        this.displayShiftForm = false;
    }

    showAttendanceDialog() {
        this.displayAttendanceForm = true;
    }

    onHideAttendanceForm() {
        this.displayAttendanceForm = false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
