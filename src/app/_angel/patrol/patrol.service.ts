import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import CryptoES from "crypto-es";
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

  getImageUrl(path?: string): string {
    return `${environment.imageUrl}`;
  }

  getPatrolInfo(locationid:number){
    var sp : any[] = [{
      mkodu : 'yek189',
      lokasyon:locationid?.toString()
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

  setGuardTour(ad:string,type:number,forced:string){
    var sp: any[] = [{
      mkodu:'yek223',
      ad:ad.toString(),
      turtipi:type.toString(),
      zorlama:forced.toString()
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

  getGuardTour(lokasyon:number){
    var sp: any[] = [{
      mkodu:'yek225',
      lokasyon:lokasyon.toString(),
    }]
    return this.requestMethod(sp);
  }

  upGuardTour(ad:string,id:number,type:number,forced:string){
    var sp: any[] = [{
      mkodu:'yek224',
      ad:ad.toString(),
      id:id.toString(),
      tip:type.toString(),
      zorlama:forced.toString()
    }]
    return this.requestMethod(sp);
  }

  setGuardStation(ad:string,type:number,number:string,lat:string,lng:string,description:string){
    var sp: any[] = [{
      mkodu:'yek228',
      ad:ad.toString(),
      tip:type.toString(),
      numara:number.toString(),
      lat:lat.toString(),
      lng:lng.toString(),
      aciklama:description.toString()
    }]
    console.log("setGuardStation ",sp)
    return this.requestMethod(sp);
  }

  updateGuardStation(ad:string,id:number,type:number,number:string,lat:string,lng:string,description:string){
    var sp: any[] = [{
      mkodu:'yek229',
      ad:ad.toString(),
      id:id.toString(),
      tip:type.toString(),
      numara:number.toString(),
      lat:lat.toString(),
      lng:lng.toString(),
      aciklama:description.toString()
    }]
    console.log("updateGuardStation ",sp)
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

  setGuardLocation(id:number,tip:string,hedefid:number,islemid:number){
    var sp: any[] = [{
      mkodu:'yek243',
      id:id.toString(),
      tip:tip,
      hedefid:hedefid.toString(),
      islemid:islemid.toString()
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

  setGuardTourCalendar(id:number,day:string,tour:string,tourTime:string,forWeek:string,description:string){
    var sp: any[] = [{
      mkodu:'yek253',
      gun:day.toString(),
      tur:tour.toString(),
      tursaat:tourTime.toString(),
      lokasyon:id.toString(),
      ozel:forWeek.toString(),
      aciklama:description.toString()
    }]
   
    return this.requestMethod(sp);
  }

  deleteGuardTourCalendar(locationId:number,tourId:number,specific:string){
    var sp: any[] = [{
      mkodu:'yek254',
      lokasyonid:locationId.toString(),
      id:tourId.toString(),
      ozel:specific.toString()
    }]
    console.log("deleteGuardTourCalendar",sp)
    return this.requestMethod(sp);
  }

  dailyGuardTourCheck(date:string,lokasyonId:number){

    var sp: any[] = [{
      mkodu:'yek258',
      tarih: date.toString(),
      lokasyon:lokasyonId.toString(),
    
    }]
    console.log("SPPPPPPPPPPPPPPPP",sp)
    return this.requestMethod(sp);
  }

  dailyGuardTourCheck2(date:string,lokasyonId:number){

    var sp: any[] = [{
      mkodu:'yek259',
      tarih: date.toString(),
      lokasyon:lokasyonId.toString(),
    
    }]
    return this.requestMethod(sp);
  }

  // dailyGuardTourDetail(date:string){
  //   console.log("DATEEEEEdetail",date);
  //   var sp: any[] = [{
  //     mkodu:'yek260',
  //     tarih: date.toString(),
  //   }]
  //   return this.requestMethod(sp);
  // }

  tour_s(date:string,locationid:number){
    var sp: any[] = [{
      mkodu:'yek265',
      tarih: date.toString(),
      lokasyon:locationid.toString()
    }]
    return this.requestMethod(sp);
  }

  tour_sd(date:string,locationid:number){
    var sp: any[] = [{
      mkodu:'yek266',
      tarih: date.toString(),
      lokasyon:locationid.toString()
    }]
    return this.requestMethod(sp);
  }

  tip23_s(){
    var sp: any[] = [{
      mkodu:'yek041',
      id: '0',
      kaynak:'guvenlikistasyontipi'
    }]
    return this.requestMethod(sp);
  }


  tip23_ss(){
    var sp: any[] = [{
      mkodu:'yek041',
      id: '0',
      kaynak:'guvenlikturtipi'
    }]
    return this.requestMethod(sp);
  }

  guardTourDetail(date:string,locationid:number){
    var sp: any[] = [{
      mkodu:'yek377',
      lokasyon: locationid.toString(),
      tarih:date.toString(),
    }]
    return this.requestMethod(sp);
  }

  guardIncidentLogs(locationid:number){
    var sp: any[] = [{
      mkodu:'yek417',
      lokasyon: locationid.toString(),
    }]
    return this.requestMethod(sp);
  }

  guardVoiceLogs(locationid:number){
    var sp: any[] = [{
      mkodu:'yek418',
      lokasyon: locationid.toString(),
    }]
    return this.requestMethod(sp);
  }

  guardAlertLogs(locationid:number){
    var sp: any[] = [{
      mkodu:'yek420',
      lokasyon: locationid.toString(),
    }]
    return this.requestMethod(sp);
  }

  getIncidentFiles(typeId : number, kaynak:string) {
    var sp : any[] = [{
      mkodu : 'yek066',
      formId : typeId.toString(),
      kaynak : kaynak
    }];
    
    return this.requestMethod(sp);
  }


}
