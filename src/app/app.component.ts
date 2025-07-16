import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { LoadingService } from './_helpers/loading.service';
import { SessionService } from './_helpers/session.service';

@Component({
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
    fullUrl: string;
    constructor(
        private modeService: ThemeModeService,
        public loadingService: LoadingService,
        private sessionService: SessionService
    ) { }

    ngOnInit() {

        // this.fullUrl = window.location.href;
        this.fullUrl = "https://yekgateway.mecloud.com.tr/api/gate";
        console.log('Kullanıcının linki:', this.fullUrl);
        
        
        
        
        window.addEventListener('beforeunload', () => {
            // Yenileme olabilir! İşaret bırakıyoruz
            localStorage.setItem('manualLogoutTriggered', 'true');
        });
        this.checkIfReloaded();
        this.modeService.init();
    }

    checkIfReloaded() {
        const isRefresh = localStorage.getItem('manualLogoutTriggered') === 'true';

        if (isRefresh) {
            localStorage.removeItem('manualLogoutTriggered');
            const userkey = sessionStorage.getItem('userkey');
            if (userkey) {
                // API isteği, localStorage temizliği, yönlendirme vs.                
                this.sessionService.logoutUser(userkey).subscribe((success) => {
                    if (success) {
                        console.log("Başarıyla çıkış yapıldı.");
                        // Devam eden işlemler...
                        sessionStorage.removeItem('id');
                        sessionStorage.removeItem('userkey');
                    } else {
                        console.log("Çıkış başarısız.");
                        // Hata işlemleri...
                    }
                });
            }
        }
    }

}
