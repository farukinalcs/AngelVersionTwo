import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-ongoing-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TooltipModule,
    MatExpansionModule,
    CustomPipeModule,
    SharedModule
  ],
  templateUrl: './ongoing-requests.component.html',
  styleUrl: './ongoing-requests.component.scss'
})
export class OngoingRequestsComponent implements OnInit, OnDestroy {
  @Input() ongoingRequests: any;
  @Input() selectedNavItem: any;
  @Input() menuItems: any;
  @Output() getMyDemandsEvent = new EventEmitter<any>();
  @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
  @Output() showDemandProcessDialogEvent = new EventEmitter<{demandId: any, demandTypeName: any}>();
  @Output() showPositionDialogEvent = new EventEmitter<{position: any, demand: any}>();

  private ngUnsubscribe = new Subject()

  checkGrid: boolean = true;
  filterText : string  = "";
  imageUrl: any;

  constructor(
    public layoutService : LayoutService,
    private profileService: ProfileService
  ) { 
    this.imageUrl = this.profileService.getImageUrl();
  }

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

  showPositionDialog(position: any, demand: any) {
    this.showPositionDialogEvent.emit({position, demand});
  }
  

  isCardOpen(item : any) {
    item.panelOpenState = true;
    console.log("Kard Açıldı : "); 
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
