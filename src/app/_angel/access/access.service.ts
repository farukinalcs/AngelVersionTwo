import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";

const API_URL = environment.newApiUrl;

@Injectable({
  providedIn: 'root',
})
export class AccessService {

  constructor(
    private httpClient: HttpClient,
    private helperService : HelperService
  ) {}

  requestMethod(sp : any[]){
    var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);

    var encryptedParam = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
      keySize : 128 / 8,
      iv : iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    };

    let options = {
      params : data
    };

    return this.httpClient.get<any>(API_URL + '/process', options);
  }
  getAccessDashboardHeader(arr : any[]) {
    var sp : any[] = [];
    
    arr.forEach((item) => {
      if (item.mkodu) {
        sp.push({
          mkodu : item.mkodu,
        });
      }
    })

    var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);

    var encryptedParam = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
      keySize : 128 / 8,
      iv : iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    };

    let options = {
      params : data
    };

    return this.httpClient.get<any>(API_URL + '/process', options);
  } 

  getDevices(){
    // var sp : any[] = [{
    //   mkodu : 'yek111',
    // }]
    let a = 0;
    var sp : any[] = [{
      mkodu : 'yek111',
      id:a.toString(),
      name:"",
      modelad:a.toString(),
      port:"",
      ip:"",
      ioad:a.toString(),
      kindad:a.toString(),
      controllerno: ""    
    }]
    return this.requestMethod(sp);
  }
}
