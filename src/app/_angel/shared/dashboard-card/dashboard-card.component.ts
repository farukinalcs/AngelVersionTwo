import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() cards: any[]; 
  @Input() editMode: boolean = true;
  @Output() removeEvent: any = new EventEmitter<any>();
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

  removeCard(item:any) {
    item.visible = false;
    const index = this.cards.indexOf(item);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
    this.removeEvent.emit(item);
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
