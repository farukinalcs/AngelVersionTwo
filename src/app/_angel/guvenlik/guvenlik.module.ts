import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuvenlikRoutingModule } from './guvenlik-routing.module';
import { GuvenlikdashboardComponent } from './guvenlikdashboard/guvenlikdashboard.component';
import { GuvenlikTanimlamalarComponent } from './guvenlik-tanimlamalar/guvenlik-tanimlamalar.component';
import { GuvenlikcilerComponent } from './guvenlikciler/guvenlikciler.component';


@NgModule({
  declarations: [
    GuvenlikdashboardComponent,
    GuvenlikTanimlamalarComponent,
    GuvenlikcilerComponent
  ],
  imports: [
    CommonModule,
    GuvenlikRoutingModule
  ]
})
export class GuvenlikModule { }
