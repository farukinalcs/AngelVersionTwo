import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import CryptoES from "crypto-es";
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(
        private httpClient: HttpClient,
        private helperService : HelperService,
        private apiUrlService: ApiUrlService) { }

    requestMethod(sp : any[]){
  
      var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
      var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
      //console.log("SP",sp);
      var encryptedParam = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
        // keySize : 128 / 8,
        iv : iv,
        mode : CryptoES.mode.CBC,
        padding : CryptoES.pad.Pkcs7
      });
  
      var data = {
        securedata : encryptedParam.toString()
      };
  
      let options = {
        params : data
      };
  
      return this.httpClient.get<any>(this.apiUrlService.apiUrl + '/process', options);
    }

    setCategory(name:string){
      var sp: any[] = [{
        mkodu:'yek293',
        Ad:name,
      }]
      return this.requestMethod(sp);
    }
    
    getCategory(id:number){
      var sp: any[] = [{
        mkodu:'yek295',
        id:id.toString(),
      }]
      return this.requestMethod(sp);
    }

    deleteCategory(id:number){
      var sp: any[] = [{
        mkodu:'yek296',
        id:id.toString(),
      }]
      return this.requestMethod(sp);
    }

    updateCategory(id:number,name:string){
      var sp: any[] = [{
        mkodu:'yek294',
        id:id.toString(),
        Ad:name.toString(),
      }]
      return this.requestMethod(sp);
    }

  setScale(name:string,answer1:string,answer2:string,answer3:string,answer4:string,answer5:string,answerN:number,direction:number){
      var sp: any[] = [{
        mkodu:'yek299',
        ad:name.toString(),
        cevap1:answer1.toString(),
        cevap2:answer2.toString(),
        cevap3:answer3.toString(),
        cevap4:answer4.toString(),
        cevap5:answer5.toString(),
        cevapn:answerN.toString(),
        yon:direction.toString(),
      }]
      return this.requestMethod(sp);
    }
}
