import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';

@Component({
  selector: 'app-patroldefinitions',
  templateUrl: './patroldefinitions.component.html',
  styleUrls: ['./patroldefinitions.component.scss']
})
export class PatroldefinitionsComponent implements OnInit, OnDestroy{
  activeWidget: number = 1;

    constructor(
      private patrol : PatrolService,
      private ref : ChangeDetectorRef
    ) { }

  ngOnInit(): void {

    this.ref.detectChanges();
 
  }

  
  changeContent(widgetValue: number) {
    this.activeWidget = widgetValue;
  }

  widgets = [
    { title: 'Güvenlik Turları', value: 1},
    { title: 'Güvenlik Lokasyonları', value: 2},
    { title: 'Güvenlik İstasyonları', value: 3},
    { title: 'Güvenlil Tur Takvim', value: 4},

  ];

  ngOnDestroy(){

  }

}
