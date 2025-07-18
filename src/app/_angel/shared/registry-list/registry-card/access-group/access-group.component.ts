import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { addItemToAddedGroups, loadAccessGroups, loadAddedGroups, removeItemFromAddedGroups } from 'src/app/store/actions/access-group.action';
import { AccessGroupState } from 'src/app/store/models/access-group.state';
import { selectAccessGroups, selectAddedGroups } from 'src/app/store/selectors/access-group.selector';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-access-group',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DialogModule,
        FormsModule,
        DatePickerModule,
        CustomPipeModule,
        DataNotFoundComponent,
        TooltipModule,
        IconFieldModule,
        FloatLabelModule,
        InputIconModule,
        InputTextModule
    ],
    templateUrl: './access-group.component.html',
    styleUrls: ['./access-group.component.scss']
})
export class AccessGroupComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    @Input() operationType: any;
    @Input() checkFormController: any;
    @Output() actionTypeEvent = new EventEmitter<string>();
    accessGroups: any[] = [];  // Ana tablonun verilerini tutacak dizi
    addedGroups: any[] = [];    // Eklenen (diğer) tabloyu tutacak dizi
    display: boolean = false;
    startDate: any = "";
    endDate: any = "";
    startTime: any = "";
    endTime: any = "";
    desc: any = "";
    selectedItem: any;
    groupDetail: any[] = [];
    detailDisplay: boolean = false;
    header: string;
    filterTextAdded: string = "";
    filterTextMain: string = "";

    accessGroups$ = this.store.pipe(select(selectAccessGroups));
    addedGroups$ = this.store.pipe(select(selectAddedGroups));
    actionType: any = "u";
    constructor(
        private profileService: ProfileService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef,
        private store: Store<AccessGroupState>
    ) { }

    ngOnInit(): void {
        if (this.operationType == 'i' || this.operationType == 't') {
            this.getAccessGroup();

        } else if (this.operationType == 'u') {
            this.getAccessGroupForRegister();
            this.getAddedGroupForRegister();
        }
    }

    getAccessGroupForRegister() {
        var sp: any[] = [
            { mkodu: 'yek206', kaynak: 'yetki', id: '0', sid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geçiş Grupları :", data);

            this.accessGroups = data.map((item: any) => ({
                ...item,
                hasItem: false
            }));

            this.store.dispatch(loadAccessGroups({ accessGroups: this.accessGroups }));
        });
    }

    getAddedGroupForRegister() {
        var sp: any[] = [
            { mkodu: 'yek206', kaynak: 'yetki', id: '1', sid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geçiş Grupları :", data);

            this.addedGroups = data.map((item: any) => ({
                ...item,
                hasItem: true
            }));

            this.store.dispatch(loadAddedGroups({ addedGroups: this.addedGroups }));
        });
    }

    getAccessGroup() {
        var sp: any[] = [
            { mkodu: 'yek206', kaynak: 'yetki', id: '0', sid: '0' }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geçiş Grupları :", data);

            this.accessGroups = data.map((item: any) => ({
                ...item,
                hasItem: false
            }));

            this.store.dispatch(loadAccessGroups({ accessGroups: this.accessGroups }));
        });
    }


    // İşlem değişikliği fonksiyonu
    relationStateChange(item: any, process: string, isTemp: any) {
        if (process === 'i') {
            // Item'ı ekle (ana tablodan çıkar, eklenen tablodan göster)
            this.addItemToAddedGroups(item, isTemp);
        } else if (process === 'd') {
            // Item'ı çıkar (eklenen tablodan çıkar, ana tablodan göster)
            this.removeItemFromAddedGroups(item, isTemp);
        }
    }

    addItemToAddedGroups(item: any, isTemp: boolean) {
        this.store.dispatch(addItemToAddedGroups({ item, isTemp, startDate: this.startDate, endDate: this.endDate, startTime: this.startTime, endTime: this.endTime, desc: this.desc }));
        let accessGroups$ = this.store.pipe(select(selectAccessGroups));
        let addedGroups$ = this.store.pipe(select(selectAddedGroups));
        accessGroups$.subscribe(value => console.log("access :", value));
        addedGroups$.subscribe(value => console.log("add :", value));
        // addedGroups$.subscribe(value => console.log("add :", value.filter((item:any)=> !('isTemp' in item)).map((item:any)=> item.ID).join(';')));


        if (isTemp) {
            this.close();
        }
    }

    removeItemFromAddedGroups(item: any, isTemp: boolean) {
        this.store.dispatch(removeItemFromAddedGroups({ item, isTemp }));
    }

    open(item: any) {
        this.display = true;
        this.selectedItem = item;
    }

    close() {
        this.display = false;
        this.startDate = "";
        this.endDate = "";
        this.startTime = "";
        this.endTime = "";
        this.desc = "";
    }

    getGroupDetail(item: any) {
        var sp: any[] = [
            { mkodu: 'yek207', id: item.ID.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geçiş Grup Detay :", data);

            this.groupDetail = [...data];
            if (this.groupDetail.length > 0) {
                this.detailDisplay = true;
            } else {
                this.toastrService.warning(this.translateService.instant("Detay_Bulunamadı!"), this.translateService.instant("Uyarı"));
            }


        });
    }

    showDetail(item: any) {
        this.header = `${item.Ad} Detay`;
        this.getGroupDetail(item);
    }

    hideDetail() {
        this.detailDisplay = false;
    }


    changeActionType(action: any) {
        this.actionType = action;
        this.actionTypeEvent.emit(action);
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
