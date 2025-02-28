import { NgModule, APP_INITIALIZER } from '@angular/core';
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

// Bold Reports
import './../globals';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
import { LoadingInterceptor } from './modules/loading/interceptors/loading.interceptor';
// ------------




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
    ToastrModule.forRoot(),
    

    // NgRx State Mangement
    StoreModule.forRoot({ 
      form: formReducer,
      registers: registerReducer
    }),
    StoreModule.forFeature('accessGroup', accessGroupReducer),

    // Bold Reports
    BoldReportViewerModule
    
    
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
    }
  ],
  bootstrap: [AppComponent],
  exports: [LoadingComponent]
})
export class AppModule {}
