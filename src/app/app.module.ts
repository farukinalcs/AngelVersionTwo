import { NgModule, APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { StoreModule } from '@ngrx/store';
import { TokenInterceptor } from './modules/auth/services/auth-http/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './modules/loading/loading.component';
import { formReducer } from './store/reducers/form.reducer';
import { accessGroupReducer } from './store/reducers/access-group.reducer';
import { ApiUrlService } from './_helpers/api-url.service';
import { registerReducer } from './store/reducers/register.reducer';


import { LoadingInterceptor } from './modules/loading/interceptors/loading.interceptor';

// PrimeNG Theme
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import MyPreset from './_primeng/mypreset'
// -------------

import 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise';


import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

LicenseManager.setLicenseKey(
  "BOARD4ALL_NDEwMjM1MTIwMDAwMA==8f4481b5cc626ad79fe91bc5f4e52e3d"
);


function appInitializer(authService: AuthService) {
  return () => {
    // return new Promise((resolve) => {
    //   //@ts-ignore
    //   authService.getUserByToken().subscribe().add(resolve);
    // });
  };
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    })
  ]
};

registerLocaleData(localeTr, 'tr');

@NgModule({
  declarations: [AppComponent, LoadingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot(),
    

    // NgRx State Mangement
    StoreModule.forRoot({ 
      form: formReducer,
      registers: registerReducer
    }),
    StoreModule.forFeature('accessGroup', accessGroupReducer),
    
    
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (apiUrlService: ApiUrlService) => () =>
        apiUrlService.loadAppConfig(),
      deps: [ApiUrlService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi : true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,  // LoadingInterceptor
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'tr-TR' },
    appConfig.providers
  ],
  bootstrap: [AppComponent],
  exports: [LoadingComponent]
})
export class AppModule {}
