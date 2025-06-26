import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProfileService } from '../_angel/profile/profile.service';
import { AuthHTTPService } from '../modules/auth/services/auth-http';
import { HelperService } from './helper.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private lastActivityTime: number = Date.now();
    private timeout: number; // Oturum zaman aşımı süresi (ms)
    private intervalRef: any;
    private warningShown: boolean = false; // Uyarı gösterilip gösterilmeyeceğini kontrol etmek için

    constructor(
        private router: Router,
        private profileService: ProfileService,
        private authHttpService: AuthHTTPService,
        private helperService: HelperService
    ) { }

    startMonitoring(timeout: number) {
        this.timeout = timeout;
        this.resetTimer();
        this.startTimer();
    }

    updateActivity() {
        this.lastActivityTime = Date.now();
        this.warningShown = false; // tekrar uyarı gösterebilmek için sıfırladımm
    }

    private startTimer() {
        this.intervalRef = setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - this.lastActivityTime;

            if (timeSinceLastActivity > this.timeout) {

                this.logoutUser().subscribe((success) => {
                    if (success) {
                        console.log("Başarıyla çıkış yapıldı.");
                        // Devam eden işlemler...
                        this.stopMonitoring();
                        const storageKeys = [
                            'token',
                            'is-secure',
                            'manualLogoutTriggered',
                            'onboarded'
                        ];
                        storageKeys.forEach(key => localStorage.removeItem(key));
                        // Oturum sonlandırıldıktan sonra yönlendirme                        

                        sessionStorage.removeItem('id');
                        sessionStorage.removeItem('userkey');

                        this.router.navigate(['/auth/login']);


                    } else {
                        console.log("Çıkış başarısız.");
                        // Hata işlemleri...
                    }
                    return;
                });

            } else if (timeSinceLastActivity > this.timeout - 60000 && !this.warningShown) {
                this.warningShown = true;
                this.showWarningModal();
            }
        }, 10000); // 10 saniyede bir kontrol
    }

    private resetTimer() {
        this.lastActivityTime = Date.now();
    }

    stopMonitoring() {
        clearInterval(this.intervalRef);
    }

    //   logoutUser(userkey?: string, session?: any) {
    //     var sp: any =
    //     {
    //       userkey: session ? userkey : this.authHttpService.userkey,
    //       source: 'weblogin',
    //       loginid: this.helperService.userLoginModel?.Id.toString(),
    //     };

    //     this.profileService.logout(sp).subscribe((res: any) => {
    //       console.log("Logout Res : ", res);


    //       if (session && session.current) {
    //         this.stopMonitoring();
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('is-secure');
    //         localStorage.removeItem('manualLogoutTriggered');
    //         localStorage.removeItem('onboarding'); 

    //         this.router.navigate(['/auth/login']);  
    //       }

    //       // document.location.reload();
    //     });
    //   }

    logoutUser(userkey?: string, session?: any): Observable<boolean> {
        const sp: any = {
            userkey: userkey ? userkey : session ? session.userkey : this.authHttpService.userkey,
            source: 'weblogin',
            loginid: this.helperService.userLoginModel?.Id.toString() || sessionStorage.getItem('id'),
        };

        return new Observable<boolean>((observer) => {
            this.profileService.logout(sp).subscribe({
                next: (res) => {
                    console.log("Logout başarılı: ", res);
                    // İlgili işlemler
                    if (session && session.current || userkey) {
                        this.stopMonitoring();
                        const storageKeys = [
                            'token',
                            'is-secure',
                            'manualLogoutTriggered',
                            'onboarded'
                        ];
                        storageKeys.forEach(key => localStorage.removeItem(key));
                        // Oturum sonlandırıldıktan sonra yönlendirme                        
                        this.router.navigate(['/auth/login']);
                    }

                    observer.next(true);
                    observer.complete();
                },
                error: (err) => {
                    console.error("Logout hatası: ", err);
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }


    logout(): Observable<any> {
        var sp: any[] = [
            {
                userkey: this.authHttpService.userkey,
                source: 'weblogin',
                loginid: this.helperService.userLoginModel?.Id.toString()
            }
        ];
        return this.profileService.logout(sp);
    }


    // // session.service.ts
    // logoutUser(userkey?: string): Observable<any> {
    //   const sp = {
    //     userkey: this.authHttpService.userkey || userkey,
    //     source: 'weblogin',
    //     loginid: this.helperService.userLoginModel?.Id.toString(),
    //   };

    //   return this.profileService.logout(sp).pipe(
    //     tap(() => {
    //       this.stopMonitoring();
    //       localStorage.removeItem('token');
    //     })
    //   );
    // }


    private showWarningModal() {
        const totalSeconds = 60;
        const startTime = Date.now();
        let soundPlayed = false;

        const audio = new Audio('../assets/sounds/Logout.mp3');

        let timerInterval: any;

        Swal.fire({
            title: 'Oturum sona ermek üzere!',
            html: `İşlem yapılmadığı için oturumunuz <b><span id="countdown">${totalSeconds}</span></b> saniye içinde kapatılacak.<br><br>Devam etmek istiyor musunuz?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, devam et',
            cancelButtonText: 'Hayır, çıkış yap',
            allowOutsideClick: false,
            customClass: {
                container: 'swal-on-top',
                popup: 'swal-popup-zfix'
            },
            didOpen: () => {
                const content = Swal.getHtmlContainer()?.querySelector('#countdown');

                timerInterval = setInterval(() => {
                    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                    const remaining = totalSeconds - elapsedSeconds;

                    if (content) content.textContent = remaining.toString();

                    if (remaining === 21 && !soundPlayed) {
                        audio.play().catch((error) => {
                            console.warn('Ses dosyası çalınamadı:', error);
                        });
                        soundPlayed = true;
                    }

                    if (remaining <= 0) {
                        clearInterval(timerInterval);
                        Swal.close();
                        this.logoutUser().subscribe((success) => {
                            if (success) {
                                console.log("Başarıyla çıkış yapıldı.");
                                // Devam eden işlemler...
                                this.stopMonitoring();
                                const storageKeys = [
                                    'token',
                                    'is-secure',
                                    'manualLogoutTriggered',
                                    'onboarded'
                                ];
                                storageKeys.forEach(key => localStorage.removeItem(key));
                                // Oturum sonlandırıldıktan sonra yönlendirme                        

                                sessionStorage.removeItem('id');
                                sessionStorage.removeItem('userkey');

                                this.router.navigate(['/auth/login']);


                            } else {
                                console.log("Çıkış başarısız.");
                                // Hata işlemleri...
                            }
                            return;
                        });
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.userIsActive();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.logoutUser().subscribe((success) => {
                    if (success) {
                        console.log("Başarıyla çıkış yapıldı.");
                        // Devam eden işlemler...
                        this.stopMonitoring();
                        const storageKeys = [
                            'token',
                            'is-secure',
                            'manualLogoutTriggered',
                            'onboarded'
                        ];
                        storageKeys.forEach(key => localStorage.removeItem(key));
                        // Oturum sonlandırıldıktan sonra yönlendirme                        

                        sessionStorage.removeItem('id');
                        sessionStorage.removeItem('userkey');

                        this.router.navigate(['/auth/login']);


                    } else {
                        console.log("Çıkış başarısız.");
                        // Hata işlemleri...
                    }
                });
            }
        });
    }


    userIsActive() {
        var sp: any[] = [
            {
                mkodu: 'yek041',
                kaynak: 'user_is_active',
                id: '0',
            }
        ];
        console.log('userIsActive', sp);
        this.profileService.requestMethod(sp).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;
            console.log('userIsActive', data);
            if (message.islemsonuc == -1) {
                return;
            }
        }, (err) => {
            console.error('Error:', err);
        });
    }



}
