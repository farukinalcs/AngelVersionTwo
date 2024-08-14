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
    AttendancePivotListComponent
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
    DrawersModule
  ],
  
  exports: [
    AttendanceManagementSystemComponent
  ]
})
export class AttendanceModule { }
