import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { PuantajRaporlarComponent } from './puantaj-raporlar/puantaj-raporlar.component';
import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar/puantaj-tanimlamalar.component';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AttendanceListComponent,
  // },
  {
    path: 'dashboard',
    component: PuantajdashboardComponent,
  },
  {
    path: 'pdks',
    component: AttendanceListComponent,
  },
  {
    path: 'pdkspiv',
    component: AttendanceListComponent,
  },
  {
    path: 'tanimlamalar',
    component: PuantajTanimlamalarComponent,
  },
  {
    path: 'raporlar',
    component: PuantajRaporlarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
