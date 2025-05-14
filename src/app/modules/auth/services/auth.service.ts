import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthHTTPService } from './auth-http/auth-http.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from '../models/response-model';
import { ResponseXloginDetail } from '../models/response-Xlogindetail';
import { ResponseDetailZ } from '../models/response-detail-z';
import { SessionService } from 'src/app/_helpers/session.service';

export type UserType = ResponseXloginDetail | undefined;

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    private isLoadingSubject: BehaviorSubject<boolean>;
    // public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    public authLocalStorageToken = "token";

    // public fields
    currentUser$: Observable<UserType>;
    isLoading$: Observable<boolean>;
    currentUserSubject: BehaviorSubject<UserType>;
    selectedApp: any;

    get currentUserValue(): UserType {
        return this.currentUserSubject.value;
    }

    constructor(
        private authHttpService: AuthHTTPService,
        private router: Router,
        private helper: HelperService,
        private sessionService: SessionService,
        private helperService: HelperService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
        // const subscr = this.getUserByToken().subscribe();
        // this.unsubscribe.push(subscr);
        console.log("Auth Service Çalıştı");

    }

    login(loginOptions: any): Observable<any> {
        this.isLoadingSubject.next(true);

        return this.authHttpService.cryptoLogin(loginOptions).pipe(map((auth: ResponseModel<ResponseXloginDetail, ResponseDetailZ>[]) => {
            const data = auth[0].x;
            var message = auth[0].z;

            localStorage.setItem('is-secure', data[0].issecure);
            

            if (message.islemsonuc == -13) {
                return -13;                
            }
            
            console.log("Auth :", data);
            this.helper.customerCode = data[0]?.CustomerCode;
            if (message.islemsonuc == 1) {
                var user = data[0];

                this.helper.userLoginModel = data[0];
                this.currentUserSubject = new BehaviorSubject<any>(user);
                this.isLoadingSubject.next(false);

                const timeout = user.Timeout || 90000; // ms cinsinden
                this.sessionService.startMonitoring(timeout);

                return this.currentUserSubject.value;
            } else if (message.islemsonuc == -13) {
                const res = new BehaviorSubject<any>(auth);
                return res.value;
            }
        }),

            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        localStorage.removeItem(this.authLocalStorageToken);
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

    getUserByToken(): Observable<any> {
        var token = this.getAuthFromLocalStorage();
        if (token == null) {
            return of(undefined);
        }
        var user: any;

        const auth = this.getAuthFromLocalStorage();

        if (!auth || !auth.tokenid) {
            return of(undefined);
        }

        this.isLoadingSubject.next(true);
        return this.authHttpService.getUserByToken(auth.tokenid).pipe(
            map((result: any) => {
                if (result) {
                    this.currentUserSubject.next(user);
                } else {
                    this.logout();
                }
                return result;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // need create new user then login
    registration(user: UserModel): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.createUser(user).pipe(
            map(() => {
                this.isLoadingSubject.next(false);
            }),
            // switchMap(() => this.login(user.email, user.password)),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    forgotPassword(email: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .forgotPassword(email)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    // private methods
    setAuthFromLocalStorage2(token: any): boolean {
        // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes

        const storageToken = JSON.parse(localStorage.getItem('token') || '{}');
        // console.log("....STORAGE TOKEN",storageToken);
        // console.log("....REfRESH TOKEN",token);
        if (storageToken != token) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(token));
            return true;
        }
        return false;
    }

    setAuthFromLocalStorage(token: any): boolean {
        const storageTokenStr = localStorage.getItem('token');

        let storageToken;
        try {
            storageToken = storageTokenStr ? JSON.parse(storageTokenStr) : {};
        } catch (error) {
            console.error("Geçersiz JSON formatı:", error);
            storageToken = {};
        }
        if (storageToken !== token) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(token));
            return true;
        }
        return false;
    }

    // 
    // if (storageToken != responseToken) {
    //   this.authService.setAuthFromLocalStorage(responseToken);
    // }

    private getAuthFromLocalStorage(): any {
        try {
            const authData = JSON.parse(
                localStorage.getItem(this.authLocalStorageToken) || '{}'
            );
            return authData;
        } catch (error) {
            var hata: any = "undifend"
            console.error(error);
            return hata;
        }
    }

    // refreshSecureKey(code: string) {
    //   const reversed = code.split('').reverse().join('');       // 4312
    //   const reversedReordered = reversed.slice(1) + reversed[0]; // 3124 (manuel istenen düzende değilse bu düzenleme yapılabilir)
    //   const reversedPart = reversedReordered.slice(0, 3);       // 312
    //   const lastThree = code.slice(-3);                         // 134
    //   this.helperService.gateResponseY = `${code}*${reversedReordered}${reversedPart}!${lastThree}`;
    // }

    refreshSecureKey(code: string) {
        const reversed = code.split('').reverse().join('');
        const reversedReordered = reversed.slice(1) + reversed[0];
        const reversedPart = reversedReordered.slice(0, 3);
        const lastThree = code.slice(-3);
        this.helperService.gateResponseY = `${code}*${reversedReordered}${reversedPart}!${lastThree}`;
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
