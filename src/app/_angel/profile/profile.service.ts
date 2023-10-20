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
  ) {
    console.log("Profile Service Çalıştı");
   }

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

  getMyPermissions(yilay : string) {
    var sp : any[] = [{
      mkodu : 'yek035',
      yilay : yilay,
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

  getTypeValues(kaynak : string) {
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
  

  getDurationsMobile(yilay : string) {
    var sp : any[] = [{
      mkodu : 'yek053',
      yilay : yilay
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

  getNewPersons(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek054',
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

  getPersonsBirthday(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek055',
      zamanaralik : zamanAralik
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

  getSeniorPersons(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek056',
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


  postBulletinForm(formValues : any) {
    var sp : any[] = [{
      mkodu : 'yek057',
      baslik : formValues.title,
      aciklama : formValues.description,
      bastarih : formValues.startDate,
      bittarih : formValues.endDate,
      yayinlayan : formValues.owner,
      resimtip : formValues.image,
      filepath : formValues.file
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


  postFileForDemand(file : any, formId : any, kaynak : any, tip : any) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('formid', formId);
    formData.append('kaynak', kaynak);
    formData.append('tip', tip.toString());
    
    return this.httpClient.post<any>(API_URL + '/SetFile', formData);
  }

  postFileTypeForDemandType(id : any, kaynak : any, belge : any[]) {
    var sp : any[] = [];

    belge.forEach(item => {
      sp.push({
        mkodu : 'yek060',
        tip : id.toString(),
        belge : item.ID.toString(),
        kaynak : kaynak  
      });
    });
    // var sp : any[] = [{
    //   mkodu : 'yek060',
    //   tip : id.toString(),
    //   belge : belge.toString(),
    //   kaynak : kaynak
    // }];

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

  deleteFileTypeForDemandType(belge : any[], kaynak : any) {
    var sp : any[] = [];

    belge.forEach(item => {
      sp.push({
        mkodu : 'yek061',
        id : item.id.toString(),
        kaynak : kaynak  
      });
    });
    
    // var sp : any[] = [{
    //   mkodu : 'yek061',
    //   id : id.toString(),
    //   kaynak : kaynak
    // }];

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

  getFileTypeForDemandType(tip : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek062',
      tip : tip.toString(),
      kaynak : kaynak
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

  getSelectedDayMenus() {
    var sp : any[] = [{
      mkodu : 'yek063',
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


  getUploadedFiles(formid : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek066',
      formId : formid.toString(),
      kaynak : kaynak
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

  getFileForDemand(id : any, uzanti : any) {
    return this.httpClient.post<any>(API_URL + '/GetFile?uniqueid=' + id + '&filetype=' + uzanti, {});
  }

  deleteFileForDemand(id : any, uzanti : any) {
    return this.httpClient.post<any>(API_URL + '/DeleteFile?uniqueid=' + id + '&filetype=' + uzanti, {});
  }

  postVisitForm(formValues : any) {
    var sp : any[] = [{
      mkodu : 'yek072',
      ziyaretciler : formValues.visitorsNameSurname,
      aciklama : formValues.description,
      email : formValues.email,
      firma : formValues.otherCompany,
      ziyarettipi : formValues.type,
      giristarih : formValues.entryDateTime,
      cikistarih : formValues.exitDateTime
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

  removeVisit(visitId : any, description : any) {
    var sp : any[] = [{
      mkodu : 'yek073',
      talepid : visitId.toString(),
      aciklama : description

  getMealType(){
    var sp : any[] = [{
      mkodu : 'yek074',

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



  postAuthorityRequest(formValues: any, isRequest: any) {
    var sp : any[] = [{
      mkodu : 'yek077',
      yetkiid : formValues.transitionGroup.ID.toString(),
      aciklama : formValues.description,
      limit : formValues.durationType,
      tip: isRequest,
      bastarih : formValues.startDate, 
      bassaat:  formValues.startTime,
      bittarih: formValues.endDate,
      bitsaat: formValues.endTime,
      sicillerim: formValues.sicillerim.toString()

  setMeal(meal:any){
    var sp : any[] = [{
      mkodu : 'yek075',
      tip : meal.yemektipi.toString(),
      aciklama :meal.yemekadi

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


  getVisitorRequests() {
    var sp : any[] = [{
      mkodu : 'yek078'
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


  approvedVisitor(visitId: any, visitorId: any) {
    var sp : any[] = [{
      mkodu : 'yek079',
      ziyaretid: visitId.toString(),
      id: visitorId.toString()
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

  cancelVisitor(visitId: any, visitorId: any) {
    var sp : any[] = [{
      mkodu : 'yek080',
      ziyaretid: visitId.toString(),
      id: visitorId.toString()
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

  setMealMenu(){


  }

}
