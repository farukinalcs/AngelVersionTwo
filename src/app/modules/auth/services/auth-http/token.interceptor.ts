import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/_helpers/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private flag: boolean = false;

  constructor(
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService // LoadingServic
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // // İstek başladığında loading'i göster
    // this.loadingService.show();
    if (request.headers.has('skipInterceptor')) {
      const headers = request.headers.delete('skipInterceptor'); 
      const clonedRequest = request.clone({ headers });
      return next.handle(clonedRequest);
    }
    if (!this.flag) {
      this.flag = true;
      return next.handle(request).pipe(
        finalize(() => {
        })
      );
    }

    let headers = {};

    if (this.helperService.gateResponseX) {
      // İlk istekten sonra yapılacak istekler
      headers = {
        Authorization: this.helperService.gateResponseX,
      };
    } else {
      // İlk iki istekten sonra yapılacak istekler
      const token = JSON.parse(localStorage.getItem('token') || '{}');
      if (token) {
        headers = {
          Authorization: token,
        };
      }
    }

    request = request.clone({
      setHeaders: headers,
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            if (event.body && event.body instanceof Object) {
              const responseBody = event.body;
              responseBody.forEach((item: any) => {
                if (item.x) {
                  item.x = JSON.parse(item.x);
                }
                if (item.z) {
                  item.z = JSON.parse(item.z);
                }
                if (item.m) {
                  item.m = JSON.parse(item.m);
                }
              });

              this.authService.setAuthFromLocalStorage(responseBody[0].y);
            }

            if (event.status && event.status == 500) {
              this.router.navigate(['error/500']);
            }
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 500) {
            this.router.navigate(['error/500']);
          }
        }
      ),
      finalize(() => {

      })
    );
  }
}
