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

  getType_S(source:string){
    var sp : any[] = [{
      mkodu : 'yek041',
      id : '0',
      kaynak : source
    }]
    return this.requestMethod(sp);
  }

  getDevice_I(name:string,kind:number,model:number,io:number,sourcename:string,cardformat:string,pingcheck:number,timesend:number,door:string,debug:number){
    var sp : any[] = [{
      mkodu : 'yek116',
      id : '0',
      name:name,
      kind:kind,
      model:model,
      io:io ,
      sourcename:sourcename,
      cardformat:cardformat,
      pingcheck:pingcheck,
      timesend:timesend,
      door:door,
      debug:debug


    }]
    return this.requestMethod(sp);
  }

	// @islemno nvarchar(200),
	// @langcode nvarchar(10),
	// @loginid bigint,
	// @xsicilid bigint,
	// @id int,
	// @name nvarchar(150),
	// @kind int,
	// @model int,
	// @io int,
	// @sourcename nvarchar(200),
	// @cardformat nvarchar(50),
	// @pingcheck int,
	// @timesend int,
	// @door nvarchar(100),
	// @debug int,
	// @firmaid int,
	// @ip nvarchar(50),
	// @port int,
	// @controllerno nvarchar(50),
	// @securitycode nvarchar(150)

}
