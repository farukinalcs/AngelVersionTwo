import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { AttendanceManagementSystemComponent } from './attendance-management-system/attendance-management-system.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { OrganizationColumnFilterComponent } from './organization-column-filter/organization-column-filter.component';
import { AttendanceListFilterComponent } from './attendance-list-filter/attendance-list-filter.component';
import { DialogModule } from 'primeng/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from '../shared/shared.module';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { DrawersModule } from 'src/app/_metronic/partials';
import { ProcessChangeComponent } from './attendance-pivot-list/process-change/process-change.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AttendanceRegistryListComponent } from './attendance-registry-list/attendance-registry-list.component';
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

@NgModule({
  declarations: [
    AttendanceListComponent,
    AttendanceDefinitionsComponent,
    AttendanceReportComponent,
    AttendanceManagementSystemComponent,
    OrganizationColumnFilterComponent,
    AttendanceListFilterComponent,
    AttendancePivotListComponent,
    ProcessChangeComponent,
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
    AttendanceRegistryListComponent
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
    // ProfileModule,
    SharedModule,
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
    DatePickerModule
  ],
  
  exports: [
    AttendanceManagementSystemComponent,
    AttendanceListFilterComponent
  ]
})
export class AttendanceModule { }
