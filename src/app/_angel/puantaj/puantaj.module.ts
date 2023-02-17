import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuantajRoutingModule } from './puantaj-routing.module';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';


@NgModule({
  declarations: [
    PuantajdashboardComponent
  ],
  imports: [
    CommonModule,
    PuantajRoutingModule
  ]
})
export class PuantajModule { }
