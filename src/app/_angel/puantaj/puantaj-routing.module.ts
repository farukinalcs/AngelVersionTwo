import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdksComponent } from './pdks/pdks.component';
import { PuantajRaporlarComponent } from './puantaj-raporlar/puantaj-raporlar.component';
import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar/puantaj-tanimlamalar.component';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PuantajdashboardComponent,
  },
  {
    path: 'genel_bakis',
    component: PuantajdashboardComponent,
  },
  {
    path: 'pdks',
    component: PdksComponent,
  },
  {
    path: 'pdkspiv',
    component: PdksComponent,
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
export class PuantajRoutingModule { }
