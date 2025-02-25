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
import { PatroldefinitionsComponent } from './patroldefinitions/patroldefinitions.component';
import { SecurityLocationsComponent } from './security-locations/security-locations.component';
import { SecurityStationsComponent } from './security-stations/security-stations.component';
import { SecurityTourCalendarComponent } from './security-tour-calendar/security-tour-calendar.component';
import { SecurityToursComponent } from './security-tours/security-tours.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { PickListModule } from 'primeng/picklist';
import { CarouselModule } from 'primeng/carousel';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    PatroldashboardComponent,
    SecurityGuardsComponent,
    PatroldefinitionsComponent,
    SecurityLocationsComponent,
    SecurityStationsComponent,
    SecurityTourCalendarComponent,
    SecurityToursComponent],
  imports: [
    CommonModule,
    PatrolRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdALF-5HPnZFuvYRXmGY8qkv21TGD25ak',
    }),
    SharedModule,
    AgGridModule,
    TranslationModule,
    OverlayPanelModule,
    SplitterModule,
    TableModule ,
    InputTextModule,
    DialogModule,
    ButtonModule,
    TimelineModule,
    CardModule,
    PickListModule,
    CarouselModule,
    MatTabsModule,
  ]
})
export class PatrolModule { }
