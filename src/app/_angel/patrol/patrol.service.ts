import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';

const API_URL = environment.newApiUrl;
const API_DynamicPlus = environment.apiUrl2;
@Injectable({
  providedIn: 'root'
})
export class PatrolService {

  constructor(
    private httpClient: HttpClient,
    private helperService : HelperService,
    private apiUrlService: ApiUrlService
  ) { }

  requestMethod(sp : any[]){

    var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    //console.log("SP",sp);
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

    return this.httpClient.get<any>(this.apiUrlService.apiUrl + '/process', options);
  }

  getPatrolInfo(){
    var sp : any[] = [{
      mkodu : 'yek189',
    }]
    return this.requestMethod(sp);
  }

  getGuardEvents(olayid:any,imei:any){
    var sp: any[] = [{
      mkodu:'yek203',
      olayid:olayid.toString(),
      imei:imei.toString()
    }]
    return this.requestMethod(sp);
  }

  setGuardTour(ad:string){
    var sp: any[] = [{
      mkodu:'yek223',
      ad:ad.toString(),
    }]
    return this.requestMethod(sp);
  }

  deleteGuardTour(id:number){
    var sp: any[] = [{
      mkodu:'yek238',
      id:id.toString(),
    }]
    return this.requestMethod(sp);
  }

  getGuardTour(lokasyon:string){
    var sp: any[] = [{
      mkodu:'yek225',
      lokasyon:lokasyon.toString(),
    }]
    return this.requestMethod(sp);
  }

  upGuardTour(ad:string,id:number){
    var sp: any[] = [{
      mkodu:'yek224',
      ad:ad.toString(),
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  setGuardStation(ad:string){
    var sp: any[] = [{
      mkodu:'yek228',
      ad:ad.toString(),
    }]
    return this.requestMethod(sp);
  }

  getGuardStation(turid:string){
    var sp: any[] = [{
      mkodu:'yek231',
      turid:turid.toString(),
    }]
    return this.requestMethod(sp);
  }

  upGuardStation(ad:string,id:number){
    var sp: any[] = [{
      mkodu:'yek229',
      ad:ad.toString(),
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }


  deleteGuardStation(id:number){
    var sp: any[] = [{
      mkodu:'yek230',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  relation_i(kaynakid:number,hedefid:number){
    var sp : any[] = [{
      mkodu:'yek156',
      kaynakid : kaynakid.toString(),
      hedefid: hedefid.toString(),
      hedeftablo:'guvenlikturlari',
      extra:''
    }]
    return this.requestMethod(sp);
  }

  relation_d(kaynakid:number,hedefid:number){
    var sp : any[] = [{
      mkodu:'yek157',
      kaynakid : kaynakid.toString(),
      hedefid: hedefid.toString(),
      hedeftablo:'guvenlikturlari',
      extra:''
    }]
    return this.requestMethod(sp);
  }

  getLocation(){
    var sp: any[] = [{
      mkodu:'yek239',
    }]
    return this.requestMethod(sp);
  }

  deletelocation(id:number){
    var sp: any[] = [{
      mkodu:'yek240',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  setLocation(name:string){
    var sp: any[] = [{
      mkodu:'yek241',
      ad:name,
    }]
    return this.requestMethod(sp);
  }

  updateLocation(name:string,id:number){
    var sp: any[] = [{
      mkodu:'yek242',
      ad:name,
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  setGuardLocation(id:number,tip:string,hedefid:string,islem:number){
    var sp: any[] = [{
      mkodu:'yek243',
      id:id.toString(),
      tip:tip,
      hedefid:hedefid,
      islem:islem.toString()
    }]
    return this.requestMethod(sp);
  }

  allLocationDetails(id:number){
    var sp: any[] = [{
      mkodu:'yek245',
      lokasyonid:id.toString()
    }]
    return this.requestMethod(sp);
  }
  
  locationDetails(id:number){
    var sp: any[] = [{
      mkodu:'yek248',
      lokasyonid:id.toString()
    }]
    return this.requestMethod(sp);
  }

  getGuardTourCalendar(id:number){
    var sp: any[] = [{
      mkodu:'yek246',
      lokasyonid:id.toString()
    }]
    return this.requestMethod(sp);
  }

  setGuardTourCalendar(id:number){
    var sp: any[] = [{
      mkodu:'yek253',
      gun:"",
      tur:"",
      tursaat:"",
      lokasyonid:id.toString(),
      ozel:""
    }]
    return this.requestMethod(sp);
  }

  deleteGuardTourCalendar(id:number){
    var sp: any[] = [{
      mkodu:'yek254',
      lokasyonid:id.toString(),
      id:"",
      ozel:""
    }]
    return this.requestMethod(sp);
  }
}
