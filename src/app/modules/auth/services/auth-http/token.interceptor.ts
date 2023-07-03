import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AuthService } from '../auth.service';
import { LoaderService } from 'src/app/_helpers/loader.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  private flag: boolean = false;

  constructor(
    private helperService: HelperService,
    private authService : AuthService,
    private loaderService : LoaderService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // this.loaderService.isLoading.next(true);

    if (!this.flag) {
      this.flag = true;
      return next.handle(request)
      .pipe(
        finalize(() => {
        // this.loaderService.isLoading.next(false);
        })
      );
    }

    let headers = {};

    if (this.helperService.gateResponseX) {
      // İlk istekten sonra yapılacak istekler
      headers = {
        Authorization: this.helperService.gateResponseX
      };
    } else {
      // İlk iki istekten sonra yapılacak istekler
      const token = JSON.parse(localStorage.getItem('token') || '{}');
      if (token) {
        headers = {
          Authorization: token
        };
      }
    }

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          // this.loaderService.isLoading.next(false);
          
          if (event.body && event.body instanceof Object) {
            const responseBody = event.body;
            responseBody.forEach((item : any) => {
              if (item.x) {
                item.x = JSON.parse(item.x);
              }
              if (item.z) {
                item.z = JSON.parse(item.z);
              }
              if (item.m) {
                item.m = JSON.parse(item.m);
              }
            })

            this.authService.setAuthFromLocalStorage(responseBody[0].y);
          }
          
        }
      })  
    );
  }
}