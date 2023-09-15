import { GuvenlikdashboardComponent } from './guvenlikdashboard/guvenlikdashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuvenlikTanimlamalarComponent } from './guvenlik-tanimlamalar/guvenlik-tanimlamalar.component';
import { GuvenlikcilerComponent } from './guvenlikciler/guvenlikciler.component';

const routes: Routes = [
  {
    path:'',
    component:GuvenlikdashboardComponent,
    children:[
      {
        path:'genel_bakis',
        component:GuvenlikdashboardComponent
      },
      {
        path:'tanimlamalar',
        component:GuvenlikTanimlamalarComponent
      },
      {
        path:'guvenlikciler',
        component:GuvenlikcilerComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuvenlikRoutingModule { }
