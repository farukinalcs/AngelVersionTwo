import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatrolRoutingModule } from './patrol-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomDateAdapter, MY_DATE_FORMATS, PatroldashboardComponent } from './patroldashboard/patroldashboard.component';
// import { AgmCoreModule } from '@agm/core';
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
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule,MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TooltipModule } from 'primeng/tooltip';
import { DeviceAndmapComponent } from './device-andmap/device-andmap.component';
import { ToursComponent } from './tours/tours.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [
    PatroldashboardComponent,
    PatroldefinitionsComponent,
    SecurityLocationsComponent,
    SecurityStationsComponent,
    SecurityTourCalendarComponent,
    SecurityToursComponent,
    DeviceAndmapComponent,
    ToursComponent,
    ContentContainerComponent],
  imports: [
    CommonModule,
    PatrolRoutingModule,
    FormsModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAdALF-5HPnZFuvYRXmGY8qkv21TGD25ak',
    // }),
    AgGridModule,
    CalendarModule,
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
    GoogleMapsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    TooltipModule,
    DropdownModule,
    SelectModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide : DatePipe}
  ] 
})
export class PatrolModule { }
