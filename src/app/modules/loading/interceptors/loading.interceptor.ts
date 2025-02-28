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
    // Loading başlat
    this.loadingService.show();

    return next.handle(req).pipe(
      finalize(() => {
        // HTTP isteği bittiğinde loading'ı kapat
        this.loadingService.hide();
      })
    );
  }
}
