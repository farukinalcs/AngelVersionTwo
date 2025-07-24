import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LayoutService } from 'src/app/_metronic/layout';
import { NewPerson } from 'src/app/_angel/profile/models/newPerson';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

@Component({
    selector: 'app-departure',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        MatTabsModule,
        CarouselModule,
        TranslateModule,
        TooltipModule,
        CustomPipeModule,
        DataNotFoundComponent
    ],
    templateUrl: './departure.component.html',
    styleUrl: './departure.component.scss'
})
export class DepartureComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    persons: any[] = [];
    todayPerson: any[] = [];
    displayAll: boolean;
    imageUrl: string;

    constructor(
        private profileService: ProfileService,
        public layoutService: LayoutService,
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.getPersons('1');
    }

    showAllNewPerson() {
        this.displayAll = true;
    }

    getPersons(event: any) {
        var range = '1';
        this.persons = [];
        if (event.index) {
            if (event.index == 0) {
                range = '1';
            } else if (event.index == 1) {
                range = '7';
            } else if (event.index == 2) {
                range = '30';
            }
        }

        var sp: any[] = [
            {
                mkodu: '',
                zamanaralik: range
            }
        ]

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<NewPerson, ResponseDetailZ>[]) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == 1) {

                if (range == '1') {
                    this.todayPerson = data;
                } else {
                    this.persons = data;
                }

            }
            console.log("Yeni Katılanlar :", this.persons);

        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
