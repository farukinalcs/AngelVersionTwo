import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { MenuAuthorization } from 'src/app/_angel/profile/models/menu-authorization';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { MENU, MenuItem } from './sidebar-config';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { AuthService } from 'src/app/modules/auth';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    menu: MenuItem[] = [];

    constructor(
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
        private permissionService: PermissionService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getMenuAuthorization();
    }

    getMenuAuthorization() {
        this.profileService.getMenuAuthorization()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: ResponseModel<MenuAuthorization, ResponseDetailZ>[]) => {
                const permissions = response[0].x;
                const message = response[0].z;
                if (message.islemsonuc === 1) {
                    this.permissionService.setPermissions(permissions); // YETKİLER YÜKLENDİ
                    console.log(this.permissionService.getAll());
                    this.menu = this.applyPermissions(MENU, permissions);
                    this.ref.detectChanges();
                }
            });
    }

    applyPermissions(menu: MenuItem[], permissions: MenuAuthorization[]): MenuItem[] {
        return menu
            .filter(item => !item.permissionCode || permissions.some(p => p.menu === item.permissionCode && p.goruntulenme))
            .map(item => ({
                ...item,
                children: item.children ? this.applyPermissions(item.children, permissions) : undefined
            }));
    }

    hasAccess(item: MenuItem): boolean {
        const app = this.authService.selectedApp;
        return !item.app || item.app.includes(app); // Uygulama bazlı menü öğeleri için erişim kontrolü
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
