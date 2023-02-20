import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDivComponent } from './full-screen-div/full-screen-div.component';
import { SicilListeComponent } from './sicil-liste/sicil-liste.component';
import { SicilComponent } from './sicil/sicil.component';



@NgModule({
  declarations: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
