import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrolRoutingModule } from './patrol-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { PatroldashboardComponent } from './patroldashboard/patroldashboard.component';
import { AgmCoreModule } from '@agm/core';
import { SecurityGuardsComponent } from './security-guards/security-guards.component';
import { SharedModule } from '../shared/shared.module';
import { TranslationModule } from 'src/app/modules/i18n';


@NgModule({
  declarations: [PatroldashboardComponent,SecurityGuardsComponent],
  imports: [
    CommonModule,
    PatrolRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdALF-5HPnZFuvYRXmGY8qkv21TGD25ak',
    }),
    SharedModule,
    AgGridModule,
    TranslationModule
  ]
})
export class PatrolModule { }
