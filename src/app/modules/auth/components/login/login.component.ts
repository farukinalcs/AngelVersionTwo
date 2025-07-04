import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHTTPService } from '../../services/auth-http';
import { HelperService } from 'src/app/_helpers/helper.service';
import { TranslationService } from 'src/app/modules/i18n';
import { SessionService } from 'src/app/_helpers/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    // KeenThemes mock, change it to:
    defaultAuth: any = {
        userName: '',
        password: '',
    };
    loginForm: FormGroup;
    hasError: boolean;
    returnUrl: string;
    isLoading$: Observable<boolean>;
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);


    selectedLanguage: any;
    language: LanguageFlag;
    languages: LanguageFlag[] = [
        {
            lang: 'en',
            name: 'English',
            flag: './assets/media/flags/united-states.svg',
        },
        {
            lang: 'de',
            name: 'German',
            flag: './assets/media/flags/germany.svg',
        },
        {
            lang: 'tr',
            name: 'Turkish',
            flag: './assets/media/flags/turkey.svg',
        },
    ];

    appList: any[] = [];

    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    companyLogo: string;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private authHttpService: AuthHTTPService,
        private route: ActivatedRoute,
        private router: Router,
        private helperService: HelperService,
        private translationService: TranslationService,
        private ref: ChangeDetectorRef,
        private sessionService: SessionService,
        private toastrService: ToastrService
    ) {
        const url = window.location.href;
        if (url.includes('cadde')) {
            this.companyLogo = '../../../../../assets/media/logos/cadde-logo.png';
        } else {
            this.companyLogo = '../../../../../assets/media/logos/MECLOUD (13) - Copy.png'
        }
        
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit(): void {
        this.sessionService.stopMonitoring();
        this.setSelectedLanguage();
        this.authHttpService.getLocation();
        this.gate();
        this.initForm();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    initForm() {
        this.loginForm = this.fb.group({
            appList: ['', Validators.required],
            userName: [
                this.defaultAuth.userName,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                ]),
            ],
            password: [
                this.defaultAuth.password,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]),
            ],
        });
    }

    generateRandomKey(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';

        for (let i = 0; i < 8; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const now = new Date();
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // 3 haneli salise

        return key + milliseconds;
    }

    submit() {
        if (!this.loginForm.value.appList) {
            this.toastrService.warning("Lütfen bir uygulama seçiniz.");
            return;
        }

        this.authService.selectedApp = this.loginForm.value.appList; 
        const userkey = this.generateRandomKey();
        sessionStorage.setItem('userkey', userkey);
        this.authHttpService.userkey = userkey;
        var loginOptions = {
            loginName: this.f.userName.value,
            password: this.f.password.value,
            langcode: this.selectedLanguage,
            appcode: this.f.appList.value,
            userkey: userkey,
            // mkodu: 'sysLogin'
        };

        this.hasError = false;
        const loginSubscr = this.authService.login(loginOptions).pipe(first()).subscribe((data: any) => {
            if (data == -13) {
                // localStorage.removeItem("token");
                this.submit();
                return;
            }
            
            if (data) {
                console.log("Login yanıtı:", data);
                sessionStorage.setItem('id', data.Id);
                // 2FA gerekiyorsa two-factor sayfasına yönlendir
                if (data['2FA']) {
                    this.router.navigate(['/auth/two-factor'], {
                        queryParams: { fa: data['2FA'], email: data['EMail'], phone: data['CepTelefon'] }
                    });
                } else {
                    this.router.navigate(['profile']);
                }

                this.helperService.gateResponseX = '';

            } else {
                this.hasError = true;
            }
        });

        this.unsubscribe.push(loginSubscr);
    }

    routeToDashboard() {
        const appId = this.f.appList.value;
        
        if (appId == '1') {
            this.router.navigate(['profile']);
        } else if (appId == '2') {
            this.router.navigate(['']);
        } else if (appId == '3') {
            this.router.navigate(['']);
        }
    }


    gate() {
        const gateSubscr = this.authHttpService.gate().subscribe((response: any) => {
            console.log("GATE : ", response);
            this.helperService.gateResponseX = response.x;
            this.helperService.gateResponseY = response.y

            this.appList = JSON.parse(response.m);

            this.isLoading.next(false);
            this.ref.detectChanges();
        });

        this.unsubscribe.push(gateSubscr);
    }

    setLanguageWithRefresh(lang: any) {
        this.setLanguage(lang);
        this.selectedLanguage = lang;
    }

    setLanguage(lang: any) {
        this.languages.forEach((language: LanguageFlag) => {
            if (language.lang === lang) {
                language.active = true;
                this.language = language;
                this.selectedLanguage = lang;
                this.translationService.setLanguage(lang);
            } else {
                language.active = false;
            }
        });
        this.helperService.lang.next(lang);
    }

    setSelectedLanguage(): any {
        this.setLanguage(this.translationService.getSelectedLanguage());
        this.translationService.langObs.next(this.translationService.getSelectedLanguage());
    }

    getIconClass(appId: string): string {
        switch (appId) {
            case "1":
                return 'fa-solid fa-cloud';
            case "2":
                return 'fa-solid fa-shield-halved';
            case "3":
                return 'fa-solid fa-paste';
            default:
                return 'fa-solid fa-cubes'; // varsayılan ikon –  uygulama simgesi
        }
    }


    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}


interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
}