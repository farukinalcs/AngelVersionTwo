import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { PdksReducer } from './_angel/NGRX/pdks.reducer';
import { TokenInterceptor } from './modules/auth/services/auth-http/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './modules/loading/loading.component';
import { formReducer } from './store/reducers/form.reducer';
import { accessGroupReducer } from './store/reducers/access-group.reducer';
import { ApiUrlService } from './_helpers/api-url.service';
// #fake-start#
// import { FakeAPIService } from './_fake/fake-api.service';

// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    // return new Promise((resolve) => {
    //   //@ts-ignore
    //   authService.getUserByToken().subscribe().add(resolve);
    // });
  };
}

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
    // StoreModule.forRoot({number: PdksReducer}),
    ToastrModule.forRoot(),
    StoreModule.forRoot({ form: formReducer }),
    StoreModule.forFeature('accessGroup', accessGroupReducer)
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
    }
  ],
  bootstrap: [AppComponent],
  exports: [LoadingComponent]
})
export class AppModule {}
