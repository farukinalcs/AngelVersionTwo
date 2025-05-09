import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import CryptoES from "crypto-es";
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { Scale } from './models/scale';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
    private apiUrlService: ApiUrlService) { }

  requestMethod(sp: any[]) {

    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    //console.log("SP",sp);
    var encryptedParam = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
      // keySize : 128 / 8,
      iv: iv,
      mode: CryptoES.mode.CBC,
      padding: CryptoES.pad.Pkcs7
    });

    var data = {
      securedata: encryptedParam.toString()
    };

    let options = {
      params: data
    };

    return this.httpClient.get<any>(this.apiUrlService.apiUrl + '/process', options);
  }

  setCategory(name: string) {
    var sp: any[] = [{
      mkodu: 'yek293',
      Ad: name,
    }]
    return this.requestMethod(sp);
  }

  getCategory(id: number) {
    var sp: any[] = [{
      mkodu: 'yek295',
      id: id.toString(),
    }]
    return this.requestMethod(sp);
  }

  deleteCategory(id: number) {
    var sp: any[] = [{
      mkodu: 'yek296',
      id: id.toString(),
    }]
    return this.requestMethod(sp);
  }

  updateCategory(id: number, name: string) {
    var sp: any[] = [{
      mkodu: 'yek294',
      id: id.toString(),
      Ad: name.toString(),
    }]
    return this.requestMethod(sp);
  }

  setScale(scale: Scale) {

    console.log("SCALEEEE", scale)
    const sp = [{
      mkodu: 'yek299',
      ad: scale.name,
      cevap1: scale.answers[0] || null,
      cevap2: scale.answers[1] || null,
      cevap3: scale.answers[2] || null,
      cevap4: scale.answers[3] || null,
      cevap5: scale.answers[4] || null,
      cevapn: scale.count.toString(),
      yon: scale.direction.toString(),
    }];
    return this.requestMethod(sp);
  }

  getScale(id:number) {
    var sp: any[] = [{
      mkodu: 'yek301',
      id: id.toString(),
    }]
    return this.requestMethod(sp);
  }

  
  updateScale(scale: Scale) {
    console.log("updateSCALEEEE", scale)
    const sp = [{
      mkodu: 'yek300',
      id:scale.id?.toString(),
      ad: scale.name,
      cevap1: scale.answers[0] || null,
      cevap2: scale.answers[1] || null,
      cevap3: scale.answers[2] || null,
      cevap4: scale.answers[3] || null,
      cevap5: scale.answers[4] || null,
      cevapn: scale.count.toString(),
      yon: scale.direction.toString(),
    }];
    return this.requestMethod(sp);
  }

  deleteScale(id:number){
    var sp: any[] = [{
      mkodu: 'yek302',
      id: id.toString(),
    }]
    return this.requestMethod(sp);
  }
}
