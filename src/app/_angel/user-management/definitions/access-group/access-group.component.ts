import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
    selector: 'app-access-group',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        CustomPipeModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule
    ],
    templateUrl: './access-group.component.html',
    styleUrl: './access-group.component.scss'
})
export class AccessGroupComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    loading: boolean = true;
    accessGroups: any[] = [];
    selectedAccessGroup: any;
    relations: any[] = [];
    filterText: string = "";

    constructor(
        private profileService: ProfileService,
    ) { }

    ngOnInit(): void {
    }

    x(item?: any) {
        // this.loading = false;
        var sp: any[] = [
            {
                mkodu: 'yek190',
                id: '0',
            },
        ];
        console.log('Terminal Grupları Param : ', sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.accessGroups = [...data];
                console.log('Terminal Grupları Geldi : ', this.accessGroups);

                this.selectDeviceGroup(item || this.accessGroups[0]);

                // setTimeout(() => {
                //   this.loading = true;
                //   this.ref.detectChanges();
                // }, 1000);
            });
    }

    selectDeviceGroup(item: any) {
        
    }

    getRelation() {
        
    }

    relationStateChange(item: any, process: any) {
        var mkodu;
        if (process == "i") {
            mkodu = "yek156"
        } else if (process == "d") {
            mkodu = "yek157"
        }

        var sp: any[] = [
            {
                mkodu: mkodu,
                kaynakid: item.kaynakId.toString(),
                hedefid: item.hedefId.toString(),
                hedeftablo: 'terminalgroup',
                extra: "0"

            },
        ];

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc != 1) {
                    return;
                }
                console.log('relations durum değişti: ', data);
                this.getRelation();

            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
