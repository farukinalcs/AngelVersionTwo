import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";
import { Subject } from 'rxjs';

const API_URL = environment.newApiUrl;
const API_DynamicPlus = environment.apiUrl2;

@Injectable({
  providedIn: 'root',
})
export class AccessService {

  constructor(
    private httpClient: HttpClient,
    private helperService : HelperService
  ) {}

  private triggerEvent = new Subject<void>();
  triggerEvent$ = this.triggerEvent.asObservable(); 

  triggerOtherComponentInit() {
    this.triggerEvent.next();  // Data list yenileme
  }

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

  getType_S(source:string){
    var sp : any[] = [{
      mkodu : 'yek041',
      id : '0',
      kaynak : source
    }]
    return this.requestMethod(sp);
  }

  // getDevice_I(name:string,kind:number,model:number,io:number,sourcename:string,cardformat:string,pingcheck:number,timesend:number,door:string,debug:number){
  //   var sp : any[] = [{
  //     mkodu : 'yek116',
  //     id : '0',
  //     name:name,
  //     kind:kind,
  //     model:model,
  //     io:io ,
  //     sourcename:sourcename,
  //     cardformat:cardformat,
  //     pingcheck:pingcheck,
  //     timesend:timesend,
  //     door:door,
  //     debug:debug,
  //     firmaid:'0',
  //     securitycode:'',
  //     latitude:'',
  //     longtitude:''
  //   }]
  //   return this.requestMethod(sp);
  // }

  addNewDevice(detailFormValues : any,latitude:any,longtitude:any){
    let a = 0;
    var sp : any[] = [{
      mkodu : 'yek116',
      id : a.toString(),
      name:detailFormValues?.cihazAdi.toString(),
      kind:detailFormValues?.cihazTanimi.toString(),
      model:detailFormValues?.model.toString(),
      io:detailFormValues?.girisCıkıs.toString(),
      sourcename:detailFormValues?.pcAdi.toString(),
      cardformat:detailFormValues?.kartFormat.toString(),
      pingcheck:this.convertToNumber(detailFormValues?.pingTest).toString(),
      debug:this.convertToNumber(detailFormValues?.aktifPasif).toString(),
      timesend:this.convertToNumber(detailFormValues?.showTime).toString(),
      doortype:detailFormValues?.doortype.toString(),
      door:detailFormValues?.kapiBilgi.toString(),
      firmaid:a.toString(),
      ip:detailFormValues?.ip.toString(),
      port:detailFormValues.port.toString(),
      controllerno:detailFormValues.moduleid.toString(),
      securitycode:detailFormValues?.secureKey.toString(),
      latitude:latitude.toString(),
      longtitude:longtitude.toString(),
      adres:detailFormValues?.adres.toString(),
      katbilgisi:detailFormValues?.katNo.toString(),
      odabilgisi:detailFormValues?.odaNo.toString()
    }]
    console.log("REEEEEEEEEEEEEEEEEE",sp)
    return this.requestMethod(sp);
  }

  UpdateDevice(name:string,kind:string,model:number,io:number,
    sourcename:string,cardformat:string,ping:boolean,debug:boolean,timesend:boolean,
    doortype:string,door:string,ip:string,port:number,controllerno:number,securitycode:string,
    latitude:number,longtitude:number){
    let a = 0;
    var sp : any[] = [{
      mkodu : 'yek135',
      id : a.toString(),
      name:name.toString(),
      kind:kind.toString(),
      model:model.toString(),
      io:io.toString(),

      sourcename:sourcename.toString(),
      cardformat:cardformat.toString(),
      pingcheck:this.convertToNumber(ping).toString(),
      debug:this.convertToNumber(debug).toString(),
      timesend:this.convertToNumber(timesend).toString(),

      doortype:doortype.toString(),
      door:door.toString(),
      firmaid:a.toString(),
      ip:ip.toString(),
      port:port.toString(),
      controllerno:controllerno.toString(),
      securitycode:securitycode.toString(),
      latitude:latitude.toString(),
      longtitude:longtitude.toString(),
      adres:'',
      katbilgisi:'',
      odabilgisi:'',
      lasteventtarih:'',
	    tip: 'update'
    }]
    return this.requestMethod(sp);
  }

  UpdateDevice2(name:string,kind:number,model:number,io:number,
    sourcename:string,cardformat:string,ping:boolean,debug:boolean,timesend:boolean,
    doortype:string,ip:string,port:number,controllerno:string,securitycode:string,
    latitude:string,longtitude:string){
    let a = 0;
    var sp : any[] = [{
      mkodu : 'yek135',
      id : a.toString(),
      name:name.toString(),
      kind:kind.toString(),
      model:model.toString(),
      io:io.toString(),

      sourcename:sourcename.toString(),
      cardformat:cardformat.toString(),
      pingcheck:this.convertToNumber(ping).toString(),
      debug:this.convertToNumber(debug).toString(),
      timesend:this.convertToNumber(timesend).toString(),
      doortype:doortype.toString(),
      door:"bla bla",
      firmaid:a.toString(),
      ip:ip.toString(),
      port:port.toString(),
      controllerno:'546096986',
      securitycode:'+MeUs0zu8JzdR7jp1BA1AQEHzODgve6/C824YpjwGwo=',

      latitude:latitude.toString(),
      longtitude:longtitude.toString(),
      adres:'',
      katbilgisi:'',
      odabilgisi:'',
      lasteventtarih:'',
	    tip: 'update'
    }]
    return this.requestMethod(sp);
  }

  convertToNumber(value: boolean): number {
    return value ? 1 : 0;
  }
  getSecurityCode(serino:number,customerCode:any){
    var params = {Name:'tokenid='+ '9b612-mds58d-e45gdf-y54fg4-e4554r-1878f' + '&point=stokkayitex&islemtipi=s&serino='+serino+'&customercode='+customerCode}
    const headers = new HttpHeaders({ 'skipInterceptor': 'true' });
    return this.httpClient.get<any>(API_DynamicPlus,{params,headers});
  }



}
