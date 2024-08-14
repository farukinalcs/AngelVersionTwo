import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-drawer',
  templateUrl: './activity-drawer.component.html',
})
export class ActivityDrawerComponent implements OnInit {
  @Input() assignmentLog: any[] = []; 
  constructor() {}

  ngOnInit(): void {
    console.log("ActivityDrawerComponent : ", this.assignmentLog);
    
  }
}
