import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { PersonBirthday } from 'src/app/_angel/profile/models/personsBirthday';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { LayoutService } from 'src/app/_metronic/layout';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { BirthdayFireworksComponent } from './birthday-fireworks/birthday-fireworks.component';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

@Component({
    selector: 'app-birthday',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        MatTabsModule,
        TranslateModule,
        CarouselModule,
        TooltipModule,
        DataNotFoundComponent,
        CustomPipeModule,
        BirthdayFireworksComponent
    ],
    templateUrl: './birthday.component.html',
    styleUrl: './birthday.component.scss'
})
export class BirthdayComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    currentItemIndex = 0;

    displayAllBirthdays: boolean;
    personsBirthday: PersonBirthday[] = [];
    todayPersonsBirthday: PersonBirthday[] = [];
    imageUrl: string;
    constructor(
        private profileService: ProfileService,
        public layoutService: LayoutService,
        private ref: ChangeDetectorRef
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.getPersonsBirthday('1');
    }

    showAllBirthdays() {
        this.displayAllBirthdays = true;
    }

    getPersonsBirthday(event: any) {
        var zamanAralik = '1';
        this.personsBirthday = [];
        // this.todayPersonsBirthday = [];

        if (event.index) {
            if (event.index == 0) {
                zamanAralik = '1';
            } else if (event.index == 1) {
                zamanAralik = '7';
            } else if (event.index == 2) {
                zamanAralik = '30';
            }
        }

        this.profileService.getPersonsBirthday(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<PersonBirthday, ResponseDetailZ>[]) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == 1) {

                if (zamanAralik == '1') {
                    this.todayPersonsBirthday = data;
                } else {
                    this.personsBirthday = data;
                }

            }
            console.log("Doğum Günüsü :", this.personsBirthday);

            this.ref.detectChanges();
        });
    }

    shouldTriggerConfetti(): boolean {
        const filter = this.todayPersonsBirthday.filter(item => item.kendi == 1); 
        return filter.length > 0;
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}

