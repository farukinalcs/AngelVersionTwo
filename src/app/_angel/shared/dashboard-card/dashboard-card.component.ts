import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() cards: any[]; 
  displayDetail: boolean = false;
  selected: any;
  
  constructor(
  ) {}
  
  ngOnInit(): void {
  }

  openMore(detail: any) {
    this.selected = detail;
    this.displayDetail = true;
  }

  onHideMore() {
    this.displayDetail = false;
  }

  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
