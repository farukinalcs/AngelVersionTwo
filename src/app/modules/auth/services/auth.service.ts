import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http/auth-http.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/_helpers/helper.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private isLoadingSubject: BehaviorSubject<boolean>;
  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  
  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  // isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  

  // set currentUserValue(user: UserType) {
  //   this.currentUserSubject.next(user);
  // }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private helper: HelperService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
  }

  // public methods
  // login(email: string, password: string): Observable<UserType> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.login(email, password).pipe(
  //     map((auth: AuthModel) => {
  //       const result = this.setAuthFromLocalStorage(auth);
  //       return result;
  //     }),
  //     switchMap(() => this.getUserByToken()),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.authHttpService.login(email, password).pipe(
      map((auth: any) => {
        const result = this.setAuthFromLocalStorage(auth[0]);
        if (result) {
          var AuthModel = this.getAuthFromLocalStorage();
          if (AuthModel == null) {
            return of(undefined);
          }
          
          var user:any = { loginname:"",gorev:null,yetki:null,bolum:null,kademe:null,xsicilid:null,extloginname:"", customerName: "", id: null, tokenid: "",islemno:'',access:"",accessmenu:true,admin:false};
       
          user=AuthModel;
          this.helper.userLoginModel = AuthModel;
          this.currentUserSubject = new BehaviorSubject<any>(user);
          this.isLoadingSubject.next(false)

          console.log("AuthModel",AuthModel);
          console.log("USER",user);
          console.log("this.helper.userLoginModel",this.helper.userLoginModel);

          return this.currentUserSubject;
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
    var AuthModel = this.getAuthFromLocalStorage();
    if (AuthModel == null) {
      return of(undefined);
    }
    var user:any;

    // var user = { fullname: "", username: "", id: null, tokenid: "",extloginname:"",xsicilid:null };
    // var user: any = { loginname:"", id: null, tokenid: "",gorev:null,yetki:null,bolum:null,kademe:null,xsicilid:null,extloginname:"", customerName: "",islemno:'',access:"",accessmenu:true,admin:false};
    
    // user.loginname = AuthModel.loginname;
    // user.gorev = AuthModel.gorev;
    // user.yetki = AuthModel.yetki;
    // user.bolum = AuthModel.bolum;
    // user.kademe = AuthModel.kademe;
    // user.id = AuthModel.id;
    // user.tokenid = AuthModel.tokenid;
    // user.extloginname = AuthModel.extloginname;
    // user.xsicilid = AuthModel.xsicilid;
    // this.helper.userLoginModel = AuthModel;
    
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
      switchMap(() => this.login(user.email, user.password)),
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
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.tokenid) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }
  
  private getAuthFromLocalStorage(): AuthModel{
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken) || '{}'
      );
      return authData;
    } catch (error) {
      var hata:any = "undifend"
      console.error(error);
      return hata;
    }
  }
  // private getAuthFromLocalStorage(): AuthModel | undefined {
  //   try {
  //     const lsValue = localStorage.getItem(this.authLocalStorageToken);
  //     if (!lsValue) {
  //       return undefined;
  //     }

  //     const authData = JSON.parse(lsValue);
  //     return authData;
  //   } catch (error) {
  //     console.error(error);
  //     return undefined;
  //   }
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
