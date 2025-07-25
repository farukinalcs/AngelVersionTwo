import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locationIdSubject  = new BehaviorSubject<number | null>(null);
  selectedLocationId$ = this.locationIdSubject .asObservable();

  constructor() { }

  setLocation(id: number) {
    this.locationIdSubject .next(id);
  }

  getCurrentLocation(): number | null {
    return this.locationIdSubject .getValue();
  }
}
