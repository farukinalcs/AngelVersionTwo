import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-card-detail',
  templateUrl: './dashboard-card-detail.component.html',
  styleUrls: ['./dashboard-card-detail.component.scss']
})
export class DashboardCardDetailComponent implements OnInit, OnDestroy {
  @Input() display: boolean = false;
  @Input() selectedDetail: any;
  @Output() hide = new EventEmitter<any>();
  filterText: string = "";
  constructor() {}
  
  ngOnInit(): void {
  }

  onHide() {
    this.display = false;
    this.hide.emit();
  }
  
  ngOnDestroy(): void {
  }

}
