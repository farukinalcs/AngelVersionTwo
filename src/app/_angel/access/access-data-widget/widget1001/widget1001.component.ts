import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { AccessService } from '../../access.service';
import { DialogWidget1001Component } from './dialog-widget1001/dialog-widget1001.component';

@Component({
  selector: 'app-widget1001',
  templateUrl: './widget1001.component.html',
  styleUrls: ['./widget1001.component.scss']
})
export class Widget1001Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent : EventEmitter<GridsterItem>;

  resizeSub: Subscription;

  constructor(
    private dialog : MatDialog,
    private accessService : AccessService
  ) { }
  

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        console.log("widget : ", widget);
      }
    });
    
  }

  openDialog() {
    this.dialog.open(DialogWidget1001Component, {
      width : '5000',
    });
  }


  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

}
