import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget1004',
  templateUrl: './widget1004.component.html',
  styleUrls: ['./widget1004.component.scss']
})
export class Widget1004Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent : EventEmitter<GridsterItem>;

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
