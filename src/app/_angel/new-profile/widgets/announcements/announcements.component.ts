import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AnnouncementComponent } from '../../request-forms/announcement/announcement.component';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-announcements',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        TranslateModule,
        MatTabsModule,
        CarouselModule,
        AnnouncementComponent,
        TooltipModule,
        ButtonModule,
        CustomPipeModule,
    ],
    templateUrl: './announcements.component.html',
    styleUrl: './announcements.component.scss'
})
export class AnnouncementsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    items: any[] = [];

    displayAllAnnouncements: boolean;
    displayAnnouncementForm: boolean = false;

    constructor(
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.fetchData('0')
    }

    fetchData(range: any) {
        var sp: any[] = [
            {
                mkodu: 'yek351',
                zamanaralik: range
            }
        ];
        console.log("Zamanaralik :", sp);
        

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.items = [...data];
            console.log("Duyuru geldi :", data);
        });
    }

    showAllAnnouncements() {
        this.displayAllAnnouncements = true;
    }

    onHideAll() {
        this.displayAllAnnouncements = false;
        this.fetchData('0');
    }
    displayAnnouncement(event?: boolean) {
        this.displayAnnouncementForm = !this.displayAnnouncementForm;

        if (event) {
            this.fetchData('0');
        }
    }

    delete(item: any) {

    }

    onChangeTab(index: any) {
        this.fetchData(index == 0 ? '0' : index == 1 ? '7' : '30');
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
