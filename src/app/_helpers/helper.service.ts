import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  gateResponseX : any;
  gateResponseY : any;
  customerCode:any;
  userLoginModel : any;
  loginOptions:any = {
    loginName : "",
    password : "",
    langcode : "",
    appcode : "",
    mkodu : ''
  };
  yetki : any[];
  lang = new Subject;
  configureComponentBehavior: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  
  constructor() { }


}