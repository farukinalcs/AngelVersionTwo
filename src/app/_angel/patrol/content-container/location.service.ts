import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private selectedLocationId = new BehaviorSubject<number | null>(null);
  selectedLocationId$ = this.selectedLocationId.asObservable();

  constructor() { }

  setLocation(id: number) {
    this.selectedLocationId.next(id);
  }

  getCurrentLocation(): number | null {
    return this.selectedLocationId.getValue();
  }
}
