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
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';



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
    SearchFilterPipe 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SearchFilterPipe
  ]
})
export class SharedModule { }
