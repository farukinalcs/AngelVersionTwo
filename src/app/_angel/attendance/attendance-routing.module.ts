import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { AttendanceRegistryListComponent } from './attendance-registry-list/attendance-registry-list.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { AttendanceDefinitionsComponent } from './attendance-definitions/attendance-definitions.component';

const routes: Routes = [
  // { path: '', component: AttendanceListComponent, data: { breadcrumb: 'Liste' } },

  {
    path: 'dashboard',
    component: AttendanceDashboardComponent,
    data: { breadcrumb: 'Kontrol Paneli' }
  },
  {
    path: 'registry-list',
    component: AttendanceRegistryListComponent,
    data: { breadcrumb: 'Sicil Listesi' }
  },
  {
    path: 'attendance-list',
    component: AttendanceListComponent,
    data: { breadcrumb: 'Yoklama Listesi' }
  },
  {
    path: 'attendance-pivot',
    component: AttendancePivotListComponent,
    data: { breadcrumb: 'Pivot Liste' }
  },
  {
    path: 'definitions',
    component: AttendanceDefinitionsComponent,
    data: { breadcrumb: 'Tanımlar' }
  },
  {
    path: 'reports',
    component: AttendanceReportComponent,
    data: { breadcrumb: 'Raporlar' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule {}
