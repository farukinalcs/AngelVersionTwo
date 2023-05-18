import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent-widget',
  templateUrl: './parent-widget.component.html',
  styleUrls: ['./parent-widget.component.scss']
})
export class ParentWidgetComponent implements OnInit {
  @Input() widget : any;
  @Input() resizeEvent : any;
  
  constructor() { }

  ngOnInit(): void {
    console.log("widget :", this.widget);
    console.log("resizeEvent :", this.resizeEvent);
  }

}
