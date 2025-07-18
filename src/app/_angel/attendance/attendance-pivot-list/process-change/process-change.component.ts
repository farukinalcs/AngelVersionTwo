import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
    selector: 'app-process-change',
    standalone: true,
    imports: [
        CommonModule,
        DataNotFoundComponent,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        FloatLabelModule,
        TranslateModule,
        CustomPipeModule,
        FormsModule,
        InputTextModule

    ],
    templateUrl: './process-change.component.html',
    styleUrls: ['./process-change.component.scss']
})
export class ProcessChangeComponent implements OnInit, OnDestroy {
    @Input() displayProcessChange: boolean = true;
    @Output() displayProcessChangeEvent: EventEmitter<void> = new EventEmitter<void>();
    private ngUnsubscribe = new Subject();
    processLoading: boolean;
    processChangeList: any[] = [];
    filterText: string = '';

    constructor(
        public profileService: ProfileService,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.getProcessChangeList();

    }

    getProcessChangeList() {
        this.processLoading = false;
        var sp: any[] = [
            { mkodu: 'yek119' }
        ];



        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.processChangeList = data;
                console.log('Pivot Özet (s) : ', data);

                this.processLoading = true;
            });
    }

    hideProcessChange() {
        this.displayProcessChangeEvent.emit();
    }

    removeItem(id: number) {
        var sp: any[] = [
            {
                mkodu: 'yek120',
                id: id.toString()
            }
        ];

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                console.log('Pivot Özet (d) : ', data);

                this.toastrService.info(
                    this.translateService.instant('Pivot_Özet_Listesinden_Kaldırıldı'),
                    this.translateService.instant('Başarılı')
                );

                this.getProcessChangeList();
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
