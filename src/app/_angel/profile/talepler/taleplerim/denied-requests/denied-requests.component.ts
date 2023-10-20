import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-denied-requests',
  templateUrl: './denied-requests.component.html',
  styleUrls: ['./denied-requests.component.scss']
})
export class DeniedRequestsComponent implements OnInit, OnDestroy {
  @Input() deniedRequests: any;
  @Input() selectedNavItem: any;
  @Input() menuItems: any;
  @Output() getMyDemandsEvent = new EventEmitter<any>();
  @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
  @Output() showDemandProcessDialogEvent = new EventEmitter<{demandId: any, demandTypeName: any}>();
  
  private ngUnsubscribe = new Subject()

  checkGrid: boolean = true;
  filterText : string  = "";
  
  constructor(
    public layoutService : LayoutService
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
