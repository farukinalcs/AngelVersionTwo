import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const isSecure = localStorage.getItem('is-secure');
    const isSecure = sessionStorage.getItem('is-secure'); 
    const triggered = localStorage.getItem('manualLogoutTriggered');
    if (isSecure == '1' && !triggered) {
      // Eğer token ve isSecure varsa, sessionService ile doğrulama yap
      return true;
    }

    // login olunmadığı için false döndür ve storage'yi temizle
    sessionStorage.removeItem('token');
    // localStorage.removeItem('token');
    // localStorage.removeItem('is-secure');
    sessionStorage.removeItem('is-secure'); 
    localStorage.removeItem('manualLogoutTriggered');
    localStorage.removeItem('onboarded'); 

    this.router.navigate(['/auth/login']);
    return false;
  }
}