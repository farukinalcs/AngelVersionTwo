import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PuantajdashboardComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuantajRoutingModule { }
