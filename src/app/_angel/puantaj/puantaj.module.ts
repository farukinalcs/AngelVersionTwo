import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuantajRoutingModule } from './puantaj-routing.module';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';
import { PdksComponent } from './pdks/pdks.component';
import { PuantajListesiComponent } from './puantaj-listesi/puantaj-listesi.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    PuantajdashboardComponent,
    PdksComponent,
    PuantajListesiComponent
  ],
  imports: [
    CommonModule,
    PuantajRoutingModule,
    AgGridModule
  ]
})
export class PuantajModule { }
