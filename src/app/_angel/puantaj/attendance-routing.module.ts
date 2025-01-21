import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AttendancePivotListComponent } from './attendance-pivot-list/attendance-pivot-list.component';
import { AttendanceRegistryListComponent } from './attendance-registry-list/attendance-registry-list.component';
import { PuantajRaporlarComponent } from './puantaj-raporlar/puantaj-raporlar.component';
import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar/puantaj-tanimlamalar.component';

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
    component: PuantajTanimlamalarComponent,
  },
  {
    path: 'reports',
    component: PuantajRaporlarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
