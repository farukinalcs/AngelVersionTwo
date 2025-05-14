import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { LoadingService } from './_helpers/loading.service';
import { Router } from '@angular/router';
import { AuthHTTPService } from './modules/auth/services/auth-http';
import { SessionService } from './_helpers/session.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(
    private modeService: ThemeModeService,
    public loadingService: LoadingService,
    private router: Router,
    private sessionService: SessionService,
    private authHttpService: AuthHTTPService
  ) { }

  ngOnInit() {
    // const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    // const isReloaded = navigation?.type === 'reload';
    // const isLoginPage = this.router.url.includes('/auth/login');

    // if (isReloaded && !isLoginPage) {
    //   // this.sessionService.logoutUser();
    //   localStorage.setItem('manualLogoutTriggered', 'true');

    //   // this.router.navigate(['/auth/login']);
    // }


    
    
    // const triggered = localStorage.getItem('manualLogoutTriggered');
    // if (triggered) {
    //   this.sessionService.logoutUser(triggered);
    //   localStorage.removeItem('manualLogoutTriggered');
    // }
    
    // window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.modeService.init();
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorageOnRefresh(event: BeforeUnloadEvent) {
    event.preventDefault();  
    event.returnValue = '';
    
    localStorage.setItem('manualLogoutTriggered', 'true');
  }
  
}
