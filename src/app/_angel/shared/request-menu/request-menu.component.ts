import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-request-menu',
  templateUrl: './request-menu.component.html',
  styleUrls: ['./request-menu.component.scss']
})
export class RequestMenuComponent implements OnInit {
  @Input() menuItems: any[];
  @Output() getRequestsEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  getRequests(menuItemKey: any) {
    this.getRequestsEvent.emit(menuItemKey);
  }

}
