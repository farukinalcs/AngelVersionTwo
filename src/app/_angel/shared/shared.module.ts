import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDivComponent } from './full-screen-div/full-screen-div.component';
import { SicilListeComponent } from './sicil-liste/sicil-liste.component';
import { SicilComponent } from './sicil/sicil.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';



@NgModule({
  declarations: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent,
    DataNotFoundComponent,
    FormStepperComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
