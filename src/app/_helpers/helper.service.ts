import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  userLoginModel:any={ loginname:"",gorev:null,yetki:null,bolum:null,kademe:null,xsicilid:null,extloginname:"", customerName: "", id: null, tokenid: "",islemno:'',access:"",accessmenu:true,admin:false}
}