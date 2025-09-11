import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { LoadingService } from './_helpers/loading.service';
import { SessionService } from './_helpers/session.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // istersen aç
})
export class AppComponent implements OnInit {
  fullUrl: string = 'https://yekgateway.mecloud.com.tr/api/gate';

  constructor(
    private modeService: ThemeModeService,
    public loadingService: LoadingService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    console.log('Kullanıcının linki:', this.fullUrl);
    this.checkIfReloaded();
    this.modeService.init();
  }

  /** Sayfa kapatma/yenileme anında işaret bırak */
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    // Yenileme olabilir! İşaret bırakıyoruz
    localStorage.setItem('manualLogoutTriggered', 'true');
  }

  private checkIfReloaded(): void {
    const isRefresh = localStorage.getItem('manualLogoutTriggered') === 'true';
    if (!isRefresh) return;

    localStorage.removeItem('manualLogoutTriggered');

    const userkey = sessionStorage.getItem('userkey');
    if (!userkey) return;

    // API isteği, local storage temizliği, yönlendirme vs.
    this.sessionService.logoutUser(userkey).subscribe((success) => {
      if (success) {
        console.log('Başarıyla çıkış yapıldı.');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('userkey');
      } else {
        console.log('Çıkış başarısız.');
      }
    });
  }
}
