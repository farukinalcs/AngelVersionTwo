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
import {ProgressBarModule} from 'primeng/progressbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { AttendanceManagementSystemComponent } from './attendance-management-system/attendance-management-system.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { OrganizationColumnFilterComponent } from './organization-column-filter/organization-column-filter.component';


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
    OrganizationColumnFilterComponent
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
    CustomPipeModule
  ],
  exports: [
    AttendanceManagementSystemComponent
  ]
})
export class AttendanceModule { }
