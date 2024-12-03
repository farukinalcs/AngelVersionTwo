import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.newApiUrl;
const API_DynamicPlus = environment.apiUrl2;
@Injectable({
  providedIn: 'root'
})
export class PatrolService {

  constructor(
    private httpClient: HttpClient,
    private helperService : HelperService
  ) { }

  requestMethod(sp : any[]){

    var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    console.log("SP",sp);
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

  getPatrolInfo(){
    var sp : any[] = [{
      mkodu : 'yek189',
    }]

    return this.requestMethod(sp);
  }
}
