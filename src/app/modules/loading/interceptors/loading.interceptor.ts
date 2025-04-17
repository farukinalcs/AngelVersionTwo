import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from 'src/app/_helpers/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoading = req.headers.has('noloading');

    // Header'dan noloading'i kaldır (isteğe temiz olarak gitmesi için)
    const headers = req.headers.delete('noloading');
    const modifiedReq = req.clone({ headers });

    if (!skipLoading) {
      this.loadingService.show();
    }

    return next.handle(modifiedReq).pipe(
      finalize(() => {
        if (!skipLoading) {
          this.loadingService.hide();
        }
      })
    );
  }
}
