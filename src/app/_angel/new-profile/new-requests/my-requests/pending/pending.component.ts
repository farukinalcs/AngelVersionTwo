import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { RequestsService } from '../../requests.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-pending',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule
    ],
    templateUrl: './pending.component.html',
    styleUrl: './pending.component.scss'
})
export class PendingComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    menuItems: any[] = [];
    selectedIndex: number = 0;
    selectedKey: string | undefined;


    constructor(
        private reqService: RequestsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const initialKey = this.getCurrentTabKey();
        this.selectedIndex = this.getIndexFromKey(initialKey);
        this.selectedKey = this.getCurrentTabKey();
        // Route değişimlerini dinle
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.selectedKey = this.getCurrentTabKey();
            });
        this.getMenuItems();
    }

    getMenuItems() {
        this.menuItems = this.reqService.menuItems;
    }

    onTabChange(tab: any) {
        this.router.navigate([tab.route], { relativeTo: this.route });
        this.reqService.selectedTab = tab;
    }

    getIndexFromKey(key: string | undefined): number {
        const index = this.menuItems.findIndex(tab => tab.type === key);
        return index >= 0 ? index : 0;
    }


    getCurrentTabKey(): string | undefined {
        let currentRoute = this.route;
        while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
        }

        const urlSegments = currentRoute.snapshot.url;

        if (urlSegments.length === 2) {
            // Ör: shared-requests/leave
            return urlSegments[1].path;
        } else if (urlSegments.length === 1) {
            // Ör: expense-requests (type yok, kendisi key gibi davranabiliriz)
            return urlSegments[0].path;
        }

        return undefined;
    }





    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
