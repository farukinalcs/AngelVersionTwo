import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private selectedItemsSubject = new BehaviorSubject<any[]>([]);
  selectedItems$: Observable<any[]> = this.selectedItemsSubject.asObservable();
  
  constructor() { }

  setSelectedItems(items: any[]) {
    this.selectedItemsSubject.next(items);
  }

  getSelectedItems(): Observable<any[]> {
    return this.selectedItems$;
  }
}
