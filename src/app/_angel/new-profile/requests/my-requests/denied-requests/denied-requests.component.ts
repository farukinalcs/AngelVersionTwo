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
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
    selector: 'app-denied-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TooltipModule,
        CustomPipeModule,
        MatExpansionModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        DataNotFoundComponent
    ],
    templateUrl: './denied-requests.component.html',
    styleUrl: './denied-requests.component.scss'
})
export class DeniedRequestsComponent implements OnInit, OnDestroy {
    @Input() deniedRequests: any;
    @Input() selectedNavItem: any;
    @Input() menuItems: any;
    @Output() getMyDemandsEvent = new EventEmitter<any>();
    @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
    @Output() showDemandProcessDialogEvent = new EventEmitter<{ demandId: any, demandTypeName: any }>();
    @Output() showUploadedFilesEvent = new EventEmitter<any>();

    private ngUnsubscribe = new Subject()

    checkGrid: boolean = true;
    filterText: string = "";
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
        this.showDemandProcessDialogEvent.emit({ demandId, demandTypeName });
    }

    isCardOpen(item: any) {
        item.panelOpenState = true;
        console.log("Kard Açıldı : ");
    }

    trackBy(index: number, item: any): number {
        return item.Id;
    }

    showUploadedFiles(selectedDemand: any) {
        this.showUploadedFilesEvent.emit(selectedDemand);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
