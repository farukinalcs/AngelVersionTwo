import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-my-requests-page',
    imports: [CommonModule, RouterModule, TranslateModule, MatTabsModule],
    template: `

        <div class="container-xxl">
            <div class="card p-5">
                <mat-tab-group [(selectedIndex)]="selectedIndex" (selectedTabChange)="onTabChange($event)">
                    <mat-tab label="{{ 'Süreci_Devam_Eden_Formlar' | translate }}"></mat-tab>
                    <mat-tab label="{{ 'Onaylananlar' | translate }}"></mat-tab>
                    <mat-tab label="{{ 'Reddedilenler' | translate }}"></mat-tab>
                </mat-tab-group>

                <div class="mt-3">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>

  `,
})
export class MyRequestsPage implements OnInit {
    selectedIndex = 0;

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const path = this.route.firstChild?.snapshot.url[0]?.path;
        this.selectedIndex = this.getIndexFromPath(path);
    }

    onTabChange(event: MatTabChangeEvent) {
        const tabRoutes = ['pending', 'approved', 'rejected'];
        this.router.navigate([tabRoutes[event.index]], { relativeTo: this.route });
    }

    private getIndexFromPath(path: string | undefined): number {
        switch (path) {
            case 'pending': return 0;
            case 'approved': return 1;
            case 'rejected': return 2;
            default: return 0;
        }
    }

}
