import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { SessionService } from 'src/app/_helpers/session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    const triggered = localStorage.getItem('manualLogoutTriggered');
    if (token && !triggered) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    localStorage.removeItem('token');
    localStorage.removeItem('manualLogoutTriggered');
    this.router.navigate(['/auth/login']);
    return false;
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const token = localStorage.getItem('token');
  //   const triggered = localStorage.getItem('manualLogoutTriggered');

  //   if (token && !triggered) {
  //     return true;
  //   }

  //   // if (triggered) {
  //   //   this.sessionService.logoutUser();      
  //   // }
  //   return false;
  // }
}



// canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//   const token = localStorage.getItem('token');
//   const triggered = localStorage.getItem('manualLogoutTriggered');

//   if (token && !triggered) {
//     return of(true);
//   }

//   return this.sessionService.logoutUser().pipe(
//     tap(() => {
//       localStorage.removeItem('manualLogoutTriggered');
//       this.router.navigate(['/auth/login']);
//     }),
//     map(() => false),
//     catchError((err) => {
//       this.router.navigate(['/auth/login']);
//       return of(false);
//     })
//   );
// }