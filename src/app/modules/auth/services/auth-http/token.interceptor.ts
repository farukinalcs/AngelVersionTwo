import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AuthService } from '../auth.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  private flag: boolean = false;

  constructor(
    private helperService: HelperService,
    private authService : AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.flag) {
      this.flag = true;
      return next.handle(request);
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
            
            // if (responseBody[0].x) {
            //   responseBody[0].x = JSON.parse(responseBody[0].x);
            // }
            // if (responseBody[0].z) {
            //   responseBody[0].z = JSON.parse(responseBody[0].z);
            // }

            this.authService.setAuthFromLocalStorage(responseBody[0].y);
          }
          
        }
      })
    );
  }
}