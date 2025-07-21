import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-patroldefinitions',
  templateUrl: './patroldefinitions.component.html',
  styleUrls: ['./patroldefinitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default 
})
export class PatroldefinitionsComponent implements OnInit, OnDestroy{
  activeWidget: number = 1;
    constructor(
      private ref : ChangeDetectorRef
    ) { }

  ngOnInit(): void {

 
    this.ref.markForCheck();
    this.changeContent(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }
  
  changeContent(widgetValue: number) {
    this.activeWidget = widgetValue;
  }

  widgets = [
    { title: 'Güvenlik Turları',icon:'fa-solid fa-route', value: 1},
    { title: 'Güvenlik Lokasyonları',icon:'fa-solid fa-location-dot', value: 2},
    { title: 'Güvenlik İstasyonları',icon:'fa-solid fa-font-awesome', value: 3},
    { title: 'Güvenlik Tur Takvim',icon: 'fa-solid fa-calendar', value: 4},

  ];

  ngOnDestroy(){

  }

}
