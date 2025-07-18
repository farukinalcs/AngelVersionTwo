import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { AttendanceManagementSystemComponent } from './attendance-management-system/attendance-management-system.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { OrganizationColumnFilterComponent } from './organization-column-filter/organization-column-filter.component';
import { DialogModule } from 'primeng/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropdownModule } from 'primeng/dropdown';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { DrawersModule } from 'src/app/_metronic/partials';
import { ProcessChangeComponent } from './attendance-pivot-list/process-change/process-change.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { AttendanceDefinitionsComponent } from './attendance-definitions/attendance-definitions.component';
import { LevelDefinitionComponent } from './attendance-definitions/definitions/level-definition/level-definition.component';
import { OvertimeCausesComponent } from './attendance-definitions/definitions/overtime-causes/overtime-causes.component';
import { AttendanceRestrictionComponent } from './attendance-definitions/definitions/attendance-restriction/attendance-restriction.component';
import { FormMailsComponent } from './attendance-definitions/definitions/form-mails/form-mails.component';
import { ExcuseCardPermissionAssignmentComponent } from './attendance-definitions/definitions/excuse-card-permission-assignment/excuse-card-permission-assignment.component';
import { ShiftPlanningComponent } from './attendance-definitions/definitions/shift-planning/shift-planning.component';
import { BreakTimesComponent } from './attendance-definitions/definitions/break-times/break-times.component';
import { SplitTheDayComponent } from './attendance-definitions/definitions/split-the-day/split-the-day.component';
import { AdvertComponent } from './attendance-definitions/definitions/advert/advert.component';
import { PermitTypesComponent } from './attendance-definitions/definitions/permit-types/permit-types.component';
import { HolidayTypesComponent } from './attendance-definitions/definitions/holiday-types/holiday-types.component';
import { ShiftsComponent } from './attendance-definitions/definitions/shifts/shifts.component';
import { OverrideComponent } from './attendance-definitions/definitions/override/override.component';
import { ShiftGroupsComponent } from './attendance-definitions/definitions/shift-groups/shift-groups.component';
import { ShiftPeriodsComponent } from './attendance-definitions/definitions/shift-periods/shift-periods.component';
import { OvertimeComponent } from '../new-profile/request-forms/overtime/overtime.component';
import { AttendanceChangeComponent } from '../new-profile/request-forms/attendance-change/attendance-change.component';
import { ShiftChangeComponent } from '../new-profile/request-forms/shift-change/shift-change.component';
import { LeaveComponent } from '../new-profile/request-forms/leave/leave.component';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AttendanceOverviewContentComponent } from './attendance-dashboard/overview-content/attendance-overview-content.component';
import { DataNotFoundComponent } from '../shared/data-not-found/data-not-found.component';
import { DashboardCardComponent } from '../shared/dashboard-card/dashboard-card.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    declarations: [
        AttendanceDefinitionsComponent,
        AttendanceManagementSystemComponent,
        OrganizationColumnFilterComponent,
        LevelDefinitionComponent,
        OvertimeCausesComponent,
        AttendanceRestrictionComponent,
        FormMailsComponent,
        ExcuseCardPermissionAssignmentComponent,
        ShiftPlanningComponent,
        BreakTimesComponent,
        SplitTheDayComponent,
        AdvertComponent,
        PermitTypesComponent,
        HolidayTypesComponent,
        ShiftsComponent,
        OverrideComponent,
        ShiftGroupsComponent,
        ShiftPeriodsComponent,
        AttendanceDashboardComponent,
    ],

    imports: [
        CommonModule,
        AttendanceRoutingModule,
        AgGridModule,
        FormsModule,
        TranslateModule,
        MatProgressSpinnerModule,
        ProgressBarModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CustomPipeModule,
        DialogModule,
        MatExpansionModule,
        DropdownModule,
        DrawersModule,
        MatTooltipModule,
        MatTabsModule,
        NgApexchartsModule,
        CarouselModule,
        TooltipModule,
        OvertimeComponent,
        AttendanceChangeComponent,
        ShiftChangeComponent,
        LeaveComponent,
        DatePickerModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        AttendanceOverviewContentComponent,
        DataNotFoundComponent,
        DashboardCardComponent,
        ButtonModule,
        InputTextModule

    ],

    exports: [
        AttendanceManagementSystemComponent,
    ]
})
export class AttendanceModule { }
