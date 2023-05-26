import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { MenuAuthorization } from 'src/app/_angel/profile/models/menu-authorization';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AuthMenuService } from 'src/app/_metronic/core/services/auth-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  menuConfig : any;
  
  constructor(
    private authMenuService : AuthMenuService,
    private profileService : ProfileService,
    private authService : AuthService,
    private helperService : HelperService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.getMenuConfig();
    this.getMenuAuthorization();
  }

  getMenuConfig() {
    const menuSubscr = this.authMenuService.menuConfig$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.menuConfig = res;
      console.log("MENU_CONFIG :", this.menuConfig);
      
      this.ref.detectChanges();
    })
  }

  getMenuAuthorization() {
    this.profileService.getMenuAuthorization().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MenuAuthorization,ResponseDetailZ>[]) => {
      // let data = JSON.parse(response[0].x.toString());
      // let message = JSON.parse(response[0].z.toString());
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      if (message.islemsonuc == 1) {
        this.helperService.yetki = data


        data.forEach((item:MenuAuthorization) => {
          if (item.menu == 'a001') {
            this.menuConfig.asideMenu.profil.main = item.goruntulenme;
          } else if (item.menu == 'm926') {
            this.menuConfig.asideMenu.profil.subMenu.gecislerim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.gecislerim = item.goruntulenme;

          } else if (item.menu == 'm927') {
            this.menuConfig.asideMenu.profil.subMenu.surelerim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.surelerim = item.goruntulenme;
            
          } else if (item.menu == 'm928') {
            this.menuConfig.asideMenu.profil.subMenu.izinlerim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.izinlerim = item.goruntulenme;

          } else if (item.menu == 'm917') {
            this.menuConfig.asideMenu.profil.subMenu.talepEdilenler = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.talepEdilenler = item.goruntulenme;

          } else if (item.menu == 'm961') {
            this.menuConfig.asideMenu.profil.subMenu.taleplerim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.taleplerim = item.goruntulenme;

          } else if (item.menu == 'm962') {
            this.menuConfig.asideMenu.profil.subMenu.ziyaretciTaleplerim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.ziyaretciTaleplerim = item.goruntulenme;

          } else if (item.menu == 'm918') {
            this.menuConfig.asideMenu.profil.subMenu.mobilLokasyon = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.mobilLokasyon = item.goruntulenme;

          } else if (item.menu == 'm34') {
            this.menuConfig.asideMenu.profil.subMenu.taskListem = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.taskListem = item.goruntulenme;

          } else if (item.menu == 'm944') {
            this.menuConfig.asideMenu.profil.subMenu.takimim = item.goruntulenme;
            this.menuConfig.pages.profil.tabMenu.takimim = item.goruntulenme;

          }
        })
        console.log(" Yek030-Response :", data);
      }
      
    // this.authService.setAuthFromLocalStorage(responseToken);
      // const storageToken = JSON.parse(localStorage.getItem('token') || '{}');
      // if (storageToken != responseToken) {
      //   this.authService.setAuthFromLocalStorage(responseToken);
      // }

      this.ref.detectChanges();
    })
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}