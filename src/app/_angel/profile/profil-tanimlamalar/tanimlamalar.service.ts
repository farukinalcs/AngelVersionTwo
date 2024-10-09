import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import * as CryptoJS from "crypto-js";
import { environment } from 'src/environments/environment';

const API_URL = environment.newApiUrl;

@Injectable({
  providedIn: 'root'
})
export class TanimlamalarService {

  constructor(
    private httpClient : HttpClient,
    private helperService : HelperService
  ) { }

  getMealType(){
    var sp : any[] = [{
      mkodu : 'yek074',

    }];

    return  this.requestMethod(sp);
  }

  setMeal(meal:any){
    var sp : any[] = [{
      mkodu : 'yek075',
      tip : meal.yemektipi.toString(),
      aciklama :meal.yemekadi

    }];

    return this.requestMethod(sp);
  }

  getMeal(){
    var sp : any[] = [{
      mkodu : 'yek076',
    }];

    return  this.requestMethod(sp);
  }

  setDailyMenu(tarih:any,yemek:any,yemektipi:any){
    var sp : any[] = [{
      mkodu : 'yek082',
      tarih : tarih,
      yemek: yemek.toString(),
      yemektipi : yemektipi.toString()
    }];
    
    return this.requestMethod(sp);
  }

  clearDailyMenu(tarih:any,yemek:any,yemektipi:any){
    var sp : any[] = [{
      mkodu : 'yek083',
      tarih : tarih,
      yemek: yemek.toString(),
      yemektipi : yemektipi.toString()
    }];
    
    return this.requestMethod(sp);

  }

  getDailyMenu(tarih:any){
    var sp : any[] = [{
      mkodu : 'yek084',
      tarih : tarih
    }];

    return this.requestMethod(sp);
  }

  requestMethod(sp:any){
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
}
