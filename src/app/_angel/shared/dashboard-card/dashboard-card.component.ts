import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  @Input() fromWhere: string = '';
  @Output() removeEvent: any = new EventEmitter<any>();
  displayDetail: boolean = false;
  selected: any;
  
  constructor(
    private toastrService: ToastrService
  ) {}
  
  ngOnInit(): void {
  }

  openMore(detail: any) {
    if (detail.items.length === 0) {
      this.toastrService.warning('Bu kartta gösterilecek detay yok.', 'Uyarı');
      return;
    }
    
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
