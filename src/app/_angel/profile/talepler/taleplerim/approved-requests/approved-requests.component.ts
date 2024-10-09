import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-approved-requests',
  templateUrl: './approved-requests.component.html',
  styleUrls: ['./approved-requests.component.scss']
})
export class ApprovedRequestsComponent implements OnInit, OnDestroy {
  @Input() approvedRequests: any;
  @Input() selectedNavItem: any;
  @Input() menuItems: any;
  @Output() getMyDemandsEvent = new EventEmitter<any>();
  @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
  @Output() showDemandProcessDialogEvent = new EventEmitter<{demandId: any, demandTypeName: any}>();
  
  private ngUnsubscribe = new Subject()

  checkGrid: boolean = true;
  filterText : string  = "";
  
  constructor(
  ) { }

  ngOnInit(): void {
  }

  getMyDemands(menuItemKey: any) {
    this.getMyDemandsEvent.emit(menuItemKey);
  }

  showDetailSearchDialog() {
    this.showDetailSearchDialogEvent.emit(this.selectedNavItem);
  }

  showDemandProcessDialog(demandId: any, demandTypeName: any) {
    this.showDemandProcessDialogEvent.emit({demandId, demandTypeName});
  }

  isCardOpen(item : any) {
    item.panelOpenState = true;
    console.log("Kard Açıldı : "); 
  }

  trackBy(index: number, item: any): number {
    return item.Id;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
