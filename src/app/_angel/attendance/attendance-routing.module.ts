import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { AttendanceRegistryListComponent } from './attendance-registry-list/attendance-registry-list.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { AttendanceDefinitionsComponent } from './attendance-definitions/attendance-definitions.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AttendanceListComponent,
  // },
  {
    path: 'dashboard',
    component: AttendanceDashboardComponent,
  },
  {
    path: 'registry-list',
    component: AttendanceRegistryListComponent,
  },
  {
    path: 'attendance-list',
    component: AttendanceListComponent,
  },
  {
    path: 'attendance-pivot',
    component: AttendancePivotListComponent,
  },
  {
    path: 'definitions',
    component: AttendanceDefinitionsComponent,
  },
  {
    path: 'reports',
    component: AttendanceReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
