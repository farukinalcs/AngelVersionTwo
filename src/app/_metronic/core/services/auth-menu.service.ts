import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthMenu } from '../auth-menu.config';

const emptyMenuConfig = {}

@Injectable({
  providedIn: 'root'
})
export class AuthMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor() {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  private loadMenu() {
    this.setMenu(AuthMenu);
  }

  private setMenu(menuConfig : any) {
    this.menuConfigSubject.next(menuConfig);
  }
}
