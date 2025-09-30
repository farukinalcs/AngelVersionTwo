import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceDashboardComponent } from './performance-dashboard/performance-dashboard.component';
import { PerformanceDefinitionsComponent } from './performance-definitions/performance-definitions.component';
import { ProcessManagementComponent } from './process-management/process-management.component';



const routes: Routes = [
  {
    path:'dashboard',
    component:PerformanceDashboardComponent
  },
  {
    path:'tanimlamalar',
    component:PerformanceDefinitionsComponent
  },
  {
    path:'process',
    component:ProcessManagementComponent
  },
  // {
  //   path:'Surveyyy',
  //   component:
  // }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
