import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget1002',
  templateUrl: './widget1002.component.html',
  styleUrls: ['./widget1002.component.scss']
})
export class Widget1002Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent : EventEmitter<GridsterItem>;
  @Input() ziyaretciler : any[];
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
