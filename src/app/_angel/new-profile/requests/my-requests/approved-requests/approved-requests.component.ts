import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
  selector: 'app-approved-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    TranslateModule,
    MatExpansionModule,
    CustomPipeModule,
    SharedModule,
    InputIconModule,
    IconFieldModule,
    FloatLabelModule
  ],
  templateUrl: './approved-requests.component.html',
  styleUrl: './approved-requests.component.scss'
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
  imageUrl: any;
  
  constructor(
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
