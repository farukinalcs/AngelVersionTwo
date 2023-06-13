import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.newApiUrl;


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private httpClient : HttpClient,
    private helperService : HelperService
  ) { }

  getMenuAuthorization() {
    // const authData = JSON.parse(localStorage.getItem("token") || '{}');
    // console.log("token : ", authData);
    
    // let headers = new HttpHeaders({
    //   Authorization: authData,
    // });
    
    var sp : any[] = [
      {
        mkodu : 'yek030'
      }
    ];

    
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
      // headers : headers,
      params : data
    };

    return this.httpClient.get<any>(API_URL + '/process', options);
  }

  

  getUserInformation() {
    var sp : any[] = [{
      mkodu : 'yek032',
    }]

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


  getTransitions(zaman : string) {
    var sp : any[] = [{
      mkodu : 'yek033',
      zamanaralik : zaman,
    }]

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

  getDurations(zaman : string) {
    var sp : any[] = [{
      mkodu : 'yek034',
      zamanaralik : zaman,
    }]

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

  getMyPermissions(zaman : string) {
    var sp : any[] = [{
      mkodu : 'yek035',
      zamanaralik : zaman,
    }]

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

  getMyDemands(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek036',
      kaynak : kaynak
    }]

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

  cancelMyDemands(formid : any, kaynak : any, aciklama : any) {
    var sp : any[] = [{
      mkodu : 'yek038',
      formid : formid.toString(),
      kaynak : kaynak,
      aciklama : aciklama
    }]

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

  cancelMyDemandsMultiple(arr : any[], aciklama : any) {
    var sp : any[] = [];
    
    arr.forEach((item) => {
      if (item.tipad == 'İzin') {
        item.tipad = 'izin';
      } else if (item.tipad == 'Fazla Mesai'){
        item.tipad = 'fm';
      }
      sp.push({
        mkodu : 'yek038',
        formid : item.Id.toString(),
        kaynak : item.tipad,
        aciklama : aciklama
      })
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

  getDemandProcess(formId : any, formTip : any) {
    var sp : any[] = [{
      mkodu : 'yek037',
      formid : formId.toString(),
      formtipi : formTip
    }]

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

  getDemanded(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek039',
      kaynak  : kaynak
    }]

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

  postDetailSearch(kaynak : string, detailFormValues : any) {
    var sp : any[] = [{
      mkodu : 'yek040',
      kaynak  : kaynak,
      ad : detailFormValues.ad,
      soyad : detailFormValues.soyad,
      sicilno : detailFormValues.sicilno,
      personelno : detailFormValues.personelno,
      firma : detailFormValues.firma,
      bolum : detailFormValues.bolum,
      pozisyon : detailFormValues.pozisyon,
      gorev : detailFormValues.gorev,
      altfirma : detailFormValues.altfirma,
      yaka : detailFormValues.yaka,
      direktorluk : detailFormValues.direktorluk,
      okod1 : detailFormValues.okod0,
      okod2 : detailFormValues.okod1,
      okod3 : detailFormValues.okod2,
      okod4 : detailFormValues.okod3,
      okod5 : detailFormValues.okod4,
      okod6 : detailFormValues.okod5,
      okod7 : detailFormValues.okod6,
      tarih : detailFormValues.tarih,
      tarihbit : detailFormValues.tarihbit,
      fsecimm : detailFormValues.fsecimm,
      ftip : detailFormValues.ftip
    }]


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

  getOKodField(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek041',
      id : '0',
      kaynak : kaynak
    }]

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
  
  getAccessData() {
    var sp : any[] = [{
      mkodu : 'yek043',
      id : '0',
      kaynak : 'access'
    }]

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

  confirmDemandSingle(formId : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek044',
      id : formId.toString(),
      kaynak : kaynak
    }]

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

  confirmDemandMultiple(arr : any[]) {
    var sp : any[] = [];
    
    arr.forEach((item) => {
      if (item.tipad == 'İzin') {
        item.tipad = 'izin';
      } else if (item.tipad == 'Fazla Mesai'){
        item.tipad = 'fm';
      }
      sp.push({
        mkodu : 'yek044',
        id : item.Id.toString(),
        kaynak : item.tipad,
      })
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

  postMyDemandedDetailSearch(kaynak : any, detailFormValues : any) {
    var sp : any[] = [{
      mkodu : 'yek045',
      kaynak  : kaynak,
      ad : detailFormValues.ad,
      soyad : detailFormValues.soyad,
      sicilno : detailFormValues.sicilno,
      personelno : detailFormValues.personelno,
      firma : detailFormValues.firma,
      bolum : detailFormValues.bolum,
      pozisyon : detailFormValues.pozisyon,
      gorev : detailFormValues.gorev,
      altfirma : detailFormValues.altfirma,
      yaka : detailFormValues.yaka,
      direktorluk : detailFormValues.direktorluk,
      okod1 : detailFormValues.okod0,
      okod2 : detailFormValues.okod1,
      okod3 : detailFormValues.okod2,
      okod4 : detailFormValues.okod3,
      okod5 : detailFormValues.okod4,
      okod6 : detailFormValues.okod5,
      okod7 : detailFormValues.okod6,
      tarih : detailFormValues.tarih,
      tarihbit : detailFormValues.tarihbit,
      fsecimm : detailFormValues.fsecimm,
      ftip : detailFormValues.ftip
    }]
    console.log("Yek045 : ", sp);
    

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

  getMyVisitorDemanded() {
    var sp : any[] = [{
      mkodu : 'yek046',
      id : '0'
    }]

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

  getLocations() {
    var sp : any[] = [{
      mkodu : 'yek047'
    }]

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

  getMyTeam() {
    var sp : any[] = [
      {mkodu : 'yek048'}
    ];

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

  postOvertimeOrVacationDemand(kaynak : string, form : any) {
    var ulasimID = form.ulasim?.ID ? form.ulasim.ID.toString() : "";
    var yemekID = form.yemek?.ID ? form.yemek.ID.toString() : "";
    var bassaat = form.bassaat ? form.bassaat : "";
    var bitsaat = form.bitsaat ? form.bitsaat : "";

    var sp : any[] = [{
      mkodu : 'yek049',
      kaynak : kaynak,
      tip : form.tip.ID.toString(),
      bastarih : form.bastarih + ' ' + bassaat,
      bittarih : form.bittarih + ' ' + bitsaat,
      izinadresi : form.izinadresi,
      ulasim : ulasimID,
      yemek : yemekID,
      aciklama : form.aciklama
    }];

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

  calculateVacationTime(form : any) {
    if (form.gunluksaatlik == 'gunluk') {
      form.bassaat = '00:00';
      form.bitsaat = '00:00';
    } 
    
    var sp : any[] = [{
      mkodu : 'yek050',
      tip : form.tip?.ID?.toString(),
      bastarih : form.bastarih + ' ' + form.bassaat,
      bittarih : form.bittarih + ' ' + form.bitsaat,
      siciller : form.siciller.toString(),
      kaynak : 'izin'
    }];

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

  getMyTaskList() {
    var sp : any[] = [
      {mkodu : 'yek051'}
    ];

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

  getIncompleteTimes(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek052',
      zamanaralik : zamanAralik
    }
    ];

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
