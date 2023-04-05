import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuantajRoutingModule } from './puantaj-routing.module';
import { PuantajdashboardComponent } from './puantajdashboard/puantajdashboard.component';
import { PdksComponent } from './pdks/pdks.component';
import { PuantajListesiComponent } from './puantaj-listesi/puantaj-listesi.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MyGridCellComponent } from './my-grid-cell/my-grid-cell.component';
import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar/puantaj-tanimlamalar.component';
import { PuantajRaporlarComponent } from './puantaj-raporlar/puantaj-raporlar.component';
import { PuantajWidgetComponent } from './puantaj-widget/puantaj-widget.component';


@NgModule({
  declarations: [
    PuantajdashboardComponent,
    PdksComponent,
    PuantajListesiComponent,
    MyGridCellComponent,
    PuantajTanimlamalarComponent,
    PuantajRaporlarComponent,
    PuantajWidgetComponent
  ],
  imports: [
    CommonModule,
    PuantajRoutingModule,
    AgGridModule,
    FormsModule
  ]
})
export class PuantajModule { }
