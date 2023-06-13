import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AuthHTTPService } from '../../services/auth-http';
import { HelperService } from 'src/app/_helpers/helper.service';
import { TranslationService } from 'src/app/modules/i18n';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    userName: 'meyer',
    password: '18781878',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  selectedLanguage : any;
  language : LanguageFlag;
  languages : LanguageFlag[] = [
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

  appList : any[] = [];

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authHttpService : AuthHTTPService,
    private route: ActivatedRoute,
    private router: Router,
    private helperService : HelperService,
    private translationService : TranslationService,
    private ref : ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.setSelectedLanguage();
    this.gate();
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      appList : ['', Validators.required],
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

  submit() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.f.userName.value, this.f.password.value, this.selectedLanguage, this.f.appList.value)
      .pipe(first())
      .subscribe((data) => {

        if (data) {
          this.router.navigate([this.returnUrl]);
          this.helperService.gateResponseX = '';
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  gate() {
    const gateSubscr = this.authHttpService.gate().subscribe((response : any) => {
      console.log("GATE : ", response);
      this.helperService.gateResponseX = response.x;
      this.helperService.gateResponseY = response.y

      this.appList = JSON.parse(response.m);
      
      this.ref.detectChanges();
    });

    this.unsubscribe.push(gateSubscr);
  }

  setLanguageWithRefresh(lang : any) {
    this.setLanguage(lang);
    this.selectedLanguage = lang;
  }

  setLanguage(lang : any) {
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