import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  show() {
    this.loadingCount++;
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loadingSubject.next(false);
    }
  }

}
