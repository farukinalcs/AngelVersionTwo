import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget1003',
  templateUrl: './widget1003.component.html',
  styleUrls: ['./widget1003.component.scss']
})
export class Widget1003Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent : EventEmitter<GridsterItem>;
  @Input() sonIslemler : any[];

  resizeSub: Subscription;

  constructor() { }
  

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        console.log("widget : ", widget);
      }
    });
  }


  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

}
