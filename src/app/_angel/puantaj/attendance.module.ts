import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { PuantajListesiComponent } from './puantaj-listesi/puantaj-listesi.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyGridCellComponent } from './my-grid-cell/my-grid-cell.component';
import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar/puantaj-tanimlamalar.component';
import { PuantajRaporlarComponent } from './puantaj-raporlar/puantaj-raporlar.component';
import { PuantajWidgetComponent } from './puantaj-widget/puantaj-widget.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { AttendanceManagementSystemComponent } from './attendance-management-system/attendance-management-system.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { OrganizationColumnFilterComponent } from './organization-column-filter/organization-column-filter.component';
import { AttendanceListFilterComponent } from './attendance-list-filter/attendance-list-filter.component';
import { DialogModule } from 'primeng/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropdownModule } from 'primeng/dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModule } from '../profile/profile.module';
import { SharedModule } from '../shared/shared.module';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { DrawersModule } from 'src/app/_metronic/partials';
import { ProcessChangeComponent } from './attendance-pivot-list/process-change/process-change.component';
import { LevelDefinitionComponent } from './puantaj-tanimlamalar/definitions/level-definition/level-definition.component';
import { OvertimeCausesComponent } from './puantaj-tanimlamalar/definitions/overtime-causes/overtime-causes.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttendanceRestrictionComponent } from './puantaj-tanimlamalar/definitions/attendance-restriction/attendance-restriction.component';
import { FormMailsComponent } from './puantaj-tanimlamalar/definitions/form-mails/form-mails.component';
import { ExcuseCardPermissionAssignmentComponent } from './puantaj-tanimlamalar/definitions/excuse-card-permission-assignment/excuse-card-permission-assignment.component';
import { ShiftPlanningComponent } from './puantaj-tanimlamalar/definitions/shift-planning/shift-planning.component';
import { BreakTimesComponent } from './puantaj-tanimlamalar/definitions/break-times/break-times.component';
import { SplitTheDayComponent } from './puantaj-tanimlamalar/definitions/split-the-day/split-the-day.component';
import { AdvertComponent } from './puantaj-tanimlamalar/definitions/advert/advert.component';
import { PermitTypesComponent } from './puantaj-tanimlamalar/definitions/permit-types/permit-types.component';
import { HolidayTypesComponent } from './puantaj-tanimlamalar/definitions/holiday-types/holiday-types.component';
import { ShiftsComponent } from './puantaj-tanimlamalar/definitions/shifts/shifts.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OverrideComponent } from './puantaj-tanimlamalar/definitions/override/override.component';
import { ShiftGroupsComponent } from './puantaj-tanimlamalar/definitions/shift-groups/shift-groups.component';
import { ShiftPeriodsComponent } from './puantaj-tanimlamalar/definitions/shift-periods/shift-periods.component';


@NgModule({
  declarations: [
    PuantajdashboardComponent,
    AttendanceListComponent,
    PuantajListesiComponent,
    MyGridCellComponent,
    PuantajTanimlamalarComponent,
    PuantajRaporlarComponent,
    PuantajWidgetComponent,
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
    ShiftPeriodsComponent
  ],

  imports: [
    CommonModule,
    AttendanceRoutingModule,
    AgGridModule,
    FormsModule,
    TranslateModule,
    MatProgressSpinnerModule,
    ProgressBarModule,
    SpeedDialModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CustomPipeModule,
    DialogModule,
    MatExpansionModule,
    DropdownModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTooltipModule,
    ProfileModule,
    SharedModule,
    DrawersModule,
    MatTooltipModule,
    MatTabsModule
  ],
  
  exports: [
    AttendanceManagementSystemComponent
  ]
})
export class AttendanceModule { }
