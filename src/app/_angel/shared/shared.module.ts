import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDivComponent } from './full-screen-div/full-screen-div.component';
import { SicilListeComponent } from './sicil-liste/sicil-liste.component';
import { SicilComponent } from './sicil/sicil.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { DetailSearchComponent } from './detail-search/detail-search.component';
import { RequestProcessComponent } from './request-process/request-process.component';
import { RequestMenuComponent } from './request-menu/request-menu.component';
import { AnnualCalendarComponent } from './annual-calendar/annual-calendar.component';

// PrimeNG modules
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/modules/i18n';
import { AgGridModule } from 'ag-grid-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent,
    DataNotFoundComponent,
    FormStepperComponent,
    DetailSearchComponent,
    RequestProcessComponent,
    RequestMenuComponent,
    AnnualCalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AccordionModule,
    CardModule,
    TimelineModule,
    ButtonModule,
    InputTextModule,
    TranslationModule,
    AgGridModule,
    MatProgressSpinnerModule
  ],
  exports: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent,
    DataNotFoundComponent,
    FormStepperComponent,
    DetailSearchComponent,
    RequestProcessComponent,
    RequestMenuComponent,
    AnnualCalendarComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AccordionModule,
    CardModule,
    TimelineModule,
    ButtonModule,
    InputTextModule
  ]
})
export class SharedModule { }
