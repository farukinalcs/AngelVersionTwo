import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent-widget2',
  templateUrl: './parent-widget2.component.html',
  styleUrls: ['./parent-widget2.component.scss']
})
export class ParentWidget2Component implements OnInit {
  @Input() widget : any;
  @Input() resizeEvent : any;
  @Input() iceridekiler : any[];
  constructor() { }

  ngOnInit(): void {
  }

}
