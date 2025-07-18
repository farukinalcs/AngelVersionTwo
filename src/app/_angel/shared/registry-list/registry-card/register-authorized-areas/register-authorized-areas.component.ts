import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { FormsModule } from '@angular/forms';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-register-authorized-areas',
    standalone: true,
    imports: [
        CommonModule,
        DataNotFoundComponent,
        TranslateModule,
        FormsModule,
        CustomPipeModule,
        InputIconModule,
        FloatLabelModule,
        IconFieldModule,
        InputTextModule
    ],
    templateUrl: './register-authorized-areas.component.html',
    styleUrls: ['./register-authorized-areas.component.scss']
})
export class RegisterAuthorizedAreasComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() operationType: any;
    @Input() selectedRegister: any;
    devices: any[] = [];
    filterText: string = "";
    authorizedAreas: any[] = [];
    selectedValue: any;
    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private toastrService: ToastrService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getDevices();
    }

    getDevices() {
        var sp: any[] = [{
            mkodu: 'yek212',
            sicilid: this.selectedRegister.Id.toString(),
            userid: '',
            terminalid: '0',
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.devices = [...data];
            console.log("Terminaller Geldi :", this.devices);
        });
    }

    onClickItem(item: any) {
        this.getAuthorizedAreas();
        item.isEdit = true;
    }

    getAuthorizedAreas() {
        if (this.authorizedAreas.length > 0) {
            return;
        }

        var sp: any[] = [{
            mkodu: 'yek041',
            kaynak: 'cbo_timezone',
            id: '0',
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.authorizedAreas = [...data];
            console.log("Sicil Yetki Alanları Geldi :", this.authorizedAreas);
        });
    }

    onValueChange(value: any, item: any) {
        console.log("Value Değişti :", value);
        item.isEdit = false;
        item.isUpdate = true;
        item.newId = value.split(',')[0];
        item.newName = value.split(',')[1];

        this.selectedValue = "";
        console.log("Yeni İtem : ", item);

    }

    setDefault(item: any) {
        item.isUpdate = false;
    }

    trackById(index: number, item: any): any {
        return item.terminalId;
    }





    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
