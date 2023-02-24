import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdksComponent } from './pdks/pdks.component';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PuantajdashboardComponent,
  },
  {
    path: 'pdks',
    component: PdksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuantajRoutingModule { }
