import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDivComponent } from './full-screen-div/full-screen-div.component';
import { SicilListeComponent } from './sicil-liste/sicil-liste.component';
import { SicilComponent } from './sicil/sicil.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';



@NgModule({
  declarations: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
