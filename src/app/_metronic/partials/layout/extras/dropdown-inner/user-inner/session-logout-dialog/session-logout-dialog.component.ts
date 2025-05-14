import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { SessionService } from 'src/app/_helpers/session.service';

@Component({
  selector: 'app-session-logout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    Tooltip
  ],
  templateUrl: './session-logout-dialog.component.html',
  styleUrl: './session-logout-dialog.component.scss'
})
export class SessionLogoutDialogComponent implements OnInit, OnDestroy {
  @Output() dialogClosed = new EventEmitter<void>();
  private ngUnsubscribe = new Subject();

  display = true;
  dontAskAgain = false;

  selectedLat: number | null = null;
  selectedLng: number | null = null;
  selectedLocation: string | null = null;
  mapUrl: SafeResourceUrl | null = null;
  deviceType: 'mobile' | 'desktop' = 'desktop';
  // sessions = [
  //   {
  //     id: 'session-1',
  //     ip: '192.168.1.15',
  //     browser: 'Chrome',
  //     os: 'Windows 11',
  //     location: 'İstanbul, Türkiye',
  //     lastAccess: new Date(),
  //     latitude: 41.0082,
  //     longitude: 28.9784,
  //     current: true
  //   },
  //   {
  //     id: 'session-2',
  //     ip: '192.168.1.15',
  //     browser: 'Safari',
  //     os: 'Windows 11',
  //     location: 'İstanbul, Türkiye',
  //     lastAccess: new Date(),
  //     latitude: 41.0082,
  //     longitude: 28.9784,
  //     current: false
  //   },
  //   {
  //     id: 'session-3',
  //     ip: '192.168.1.15',
  //     browser: 'Edge',
  //     os: 'Windows 11',
  //     location: 'İstanbul, Türkiye',
  //     lastAccess: new Date(),
  //     latitude: 41.0082,
  //     longitude: 28.9784,
  //     current: false
  //   },
  //   {
  //     id: 'session-4',
  //     ip: '172.25.3.10',
  //     browser: 'Firefox',
  //     os: 'Ubuntu',
  //     location: 'Ankara, Türkiye',
  //     lastAccess: new Date(Date.now() - 86400000),
  //     latitude: 39.9208,
  //     longitude: 32.8541,
  //     current: false
  //   }
  // ];

  sessions: any[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private authHttpService: AuthHTTPService,
    private sessionService: SessionService

  ) {}
  

  ngOnInit() {
    this.getSessions();
    this.detectCurrentDeviceType();
  }

  getSessions() {
    const sp: any[] = [{ mkodu: 'yek287' }];
  
    this.profileService.requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;
  
        // current bilgisi ayarlanıyor
        this.sessions = data.map((item: any) => ({
          ...item,
          current: item.userkey === this.authHttpService.userkey
        }));
  
        // Konumları getir
        // this.setLocationsForSessions();

        console.log("Sessions: ", this.sessions);
        
      });
  }
  
  setLocationsForSessions() {
    this.sessions.forEach(session => {
      if (session.latitude && session.longitude) {
        this.profileService.reverseGeocode(session.latitude, session.longitude).subscribe(location => {
          session.location = location;
        });
      } else {
        session.location = 'Konum Bilinmiyor';
      }
    });
  }
  
  
  
  detectCurrentDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    this.deviceType = isMobile ? 'mobile' : 'desktop';
  }

  closeDialog() {
    this.dialogClosed.emit(); // Parent bileşene bildir
  }

  logoutSession(session: any) {
    console.log('Sonlandırılacak oturum ID:', session);

    this.sessionService.logoutUser(session.userkey, session);
  }

  logoutCurrent() {
    const currentSession = this.sessions.find(s => s.current);
    if (currentSession) {
      this.logoutSession(currentSession);
    }

    if (this.dontAskAgain) {
      console.log('Uyarı tekrar gösterilmeyecek.');
      localStorage.setItem('dontAskAgain', 'true');
    }

    console.log('Mevcut oturum sonlandırıldı.');
  }

  logoutAll() {
    console.log('Tüm oturumlar sonlandırılıyor...');

    this.sessions.forEach(session => {
      this.logoutSession(session);
    });
  }

  showLocationOnMap(lat: number, lng: number, location: string) {
    this.selectedLat = lat;
    this.selectedLng = lng;
    this.selectedLocation = location;

    const rawUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  getBrowserIconClass(browser: string): string {
    switch (browser.toLowerCase()) {
      case 'chrome': return 'fa-brands fa-chrome chrome';
      case 'firefox': return 'fa-brands fa-firefox firefox';
      case 'edge': return 'fa-brands fa-edge edge';
      case 'safari': return 'fa-brands fa-safari safari';
      default: return 'fa-solid fa-globe other';
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}
