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
import { SessionService } from 'src/app/_helpers/session.service';
import Swal from 'sweetalert2';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private flag: boolean = false;

  constructor(
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.has('skipInterceptor')) {
      const headers = request.headers.delete('skipInterceptor'); 
      const clonedRequest = request.clone({ headers });
      return next.handle(clonedRequest);
    }
    if (request.headers.has('gate')) {
      return next.handle(request).pipe(
        finalize(() => {
        })
      );
    }

    let headers = {};
    console.log("Token interceptor : ", this.helperService.gateResponseY);
    if (this.helperService.gateResponseX) {
      // İlk istekten sonra yapılacak istekler
      const latitude = localStorage.getItem('lat') || 'izin vermedi';
      const longitude = localStorage.getItem('lng') || 'izin vermedi';
      headers = {
        Authorization: this.helperService.gateResponseX,
        'X-User-Latitude': latitude.toString(),
        'X-User-Longitude': longitude.toString()
      };
    } else {
      // İlk iki istekten sonra yapılacak istekler
      
      const token = JSON.parse(sessionStorage.getItem('token') || '{}');
    //   const token = JSON.parse(localStorage.getItem('token') || '{}');
      const latitude = localStorage.getItem('lat') || 'izin vermedi';
      const longitude = localStorage.getItem('lng') || 'izin vermedi';
      if (token) {
        headers = {
          Authorization: token,
          'X-User-Latitude': latitude.toString(),
          'X-User-Longitude': longitude.toString()
        };
      }
    }

    request = request.clone({
      setHeaders: headers,
      // withCredentials: true
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            this.sessionService.updateActivity(); // Her response’ta zamanı güncelle
            
            if (event.body && event.body instanceof Object) {
              const responseBody = event.body;
              responseBody.forEach((item: any) => {
                if (item.x) {
                  item.x = JSON.parse(item.x);
                }
                if (item.z) {
                  item.z = JSON.parse(item.z);

                  if (item.z.islemsonuc === -58) {
                    console.error(item.z);
                    
                    Swal.fire({
                      title: 'Oturum Sona Erdi!',
                      html: `Oturumunuz başka bir tarayıcıda açıldığı için veya sunucuya erişim sağlanamadığı için kapatılmıştır.<br>Giriş ekranına dönmek için lütfen <b>"Giriş Ekranına Dön"</b> butonuna tıklayınız.`,
                      icon: 'warning',
                      showCancelButton: false,
                      confirmButtonText: 'Giriş Ekranına Dön',
                      allowOutsideClick: false,
                      didOpen: () => {
                        this.sessionService.stopMonitoring();
                      },
                      willClose: () => {

                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.sessionService.stopMonitoring();
                        sessionStorage.removeItem('token');
                        // localStorage.removeItem('token');
                        // localStorage.removeItem('is-secure');
                        sessionStorage.removeItem('is-secure');
                        localStorage.removeItem('onboarded'); 

                        this.router.navigate(['/auth/login']);
                        // document.location.reload();
                      }
                    });
                  }
                }
                if (item.m) {
                  item.m = JSON.parse(item?.m);
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
