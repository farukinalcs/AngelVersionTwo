import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { NewItemComponent } from './new-item/new-item.component';
import { LoadingSkeletonComponent } from './loading-skeleton/loading-skeleton.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [CommonModule, ItemCardComponent, NewItemComponent, LoadingSkeletonComponent, TranslateModule, DragDropModule],
    templateUrl: './onboarding.component.html',
    styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent implements OnInit {
    private ngUnsubscribe = new Subject()
    items: any[] = [];
    private loadingSubject = new BehaviorSubject<boolean>(false)
    public loading$ = this.loadingSubject.asObservable()
    display: boolean = false;

    constructor(
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.fetchItems()
    }

    fetchItems() {
        var sp: any[] = [
            {
                mkodu: 'yek341',
                id: '0'
            }
        ];

        this.loadingSubject.next(true)
        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).pipe(tap(() => this.loadingSubject.next(false))).subscribe((res: any) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geldi :", data);

            this.items = [...data];
        });
    }

    addNewItemForm(): void {

    }

    showAdd() {
        this.display = true;
    }

    close(event: any) {
        this.display = false;
        console.log("Event :", event);

        if (event) {
            this.fetchItems();
        }
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(this.items, event.previousIndex, event.currentIndex);

            this.saveOrder();
        }
    }

    private saveOrder() {
        const orderedItems = this.items.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        console.log(orderedItems);
        const formatString = this.convertToApiFormat(orderedItems);

        var sp: any[] = [
            {
                mkodu: 'yek359',
                sira: formatString
            }
        ];

        console.log(sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Sıralandı :", data);
            
        });
    }

    private convertToApiFormat(items: any[]): string {
        return items.map(item => item.id).join(',');
    }
}