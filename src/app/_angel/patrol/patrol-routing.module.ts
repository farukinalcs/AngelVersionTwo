import { SecurityGuardsComponent } from './security-guards/security-guards.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatroldashboardComponent } from './patroldashboard/patroldashboard.component';



// const routes: Routes = [];
const routes: Routes = [
  {
    path:'dashboard',
    component:PatroldashboardComponent,
    // children:[
    //   {
    //     path:'guvenlikciler',
    //     component:SecurityGuardsComponent
    //   }

    // ]
  },
  {
    path:'guvenlikciler',
    component:SecurityGuardsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrolRoutingModule { }