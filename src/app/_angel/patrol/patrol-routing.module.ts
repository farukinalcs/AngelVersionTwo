import { SecurityGuardsComponent } from './security-guards/security-guards.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatroldashboardComponent } from './patroldashboard/patroldashboard.component';
import { PatroldefinitionsComponent } from './patroldefinitions/patroldefinitions.component';
import { PatrolreportComponent } from './patrolreport/patrolreport.component';
import { DeviceAndmapComponent } from './device-andmap/device-andmap.component';
import { ToursComponent } from './tours/tours.component';
import { ContentContainerComponent } from './content-container/content-container.component';



// const routes: Routes = [];
const routes: Routes = [
  {
    path:'dashboard',
    component:PatroldashboardComponent,
  },
  {
    path:'guvenlikciler',
    component:SecurityGuardsComponent
  },
  {
    path:'tanimlamalar',
    component:PatroldefinitionsComponent
  },
  {
    path:'content',
    component:ContentContainerComponent,
       children:[
        {
          path:'device-map',
          component:DeviceAndmapComponent
        },
        {
          path:'tours',
          component:ToursComponent
        },
    ]
  },
  {
    path:'raporlar',
    component:PatrolreportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrolRoutingModule { }
