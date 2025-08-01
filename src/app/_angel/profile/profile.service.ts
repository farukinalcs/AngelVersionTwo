import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoES from "crypto-es";
import { catchError, map, Observable, switchMap, tap } from 'rxjs';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.newApiUrl;


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private httpClient : HttpClient,
    private helperService : HelperService,
    private apiUrlService : ApiUrlService
  ) { }

  getImageUrl(path?: string): string {
    return `${environment.imageUrl}`;
  }

  getApiUrl() {
    return this.apiUrlService.apiUrl;
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


    // var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    // var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);

    // var encryptedParam = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
    //   keySize : 128 / 8,
    //   iv : iv,
    //   mode : CryptoJS.mode.CBC,
    //   padding : CryptoJS.pad.Pkcs7
    // });

    // var data = {
    //   securedata : encryptedParam.toString()
    // };

    // let options = {
    //   // headers : headers,
    //   params : data
    // };

    // return this.httpClient.get<any>(API_URL + '/process', options);

    return this.requestMethod(sp);
  }

  perfprmans_form_s(id:number){
    var sp: any[] = [{
      mkodu: 'yek314',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }


  getUserInformation() {
    var sp : any[] = [{
      mkodu : 'yek032',
    }]

    return this.requestMethod(sp);
  }


  getTransitions(zaman : string) {
    var sp : any[] = [{
      mkodu : 'yek033',
      zamanaralik : zaman,
    }]

    return this.requestMethod(sp);
  }

  getDurations(zaman : string) {
    var sp : any[] = [{
      mkodu : 'yek034',
      zamanaralik : zaman,
    }]

    return this.requestMethod(sp);
  }

  getMyPermissions(yilay : string) {
    var sp : any[] = [{
      mkodu : 'yek035',
      yilay : yilay,
    }]

    return this.requestMethod(sp);
  }

  getMyDemands(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek036',
      kaynak : kaynak
    }]

    return this.requestMethod(sp);
  }

  cancelMyDemands(formid : any, kaynak : any, aciklama : any) {
    var sp : any[] = [{
      mkodu : 'yek038',
      formid : formid.toString(),
      kaynak : kaynak,
      aciklama : aciklama
    }]

    return this.requestMethod(sp);
  }

  cancelMyDemandsMultiple(arr : any[], aciklama : any) {
    var sp : any[] = [];

    arr.forEach((item) => {
      if (item.tipad == 'İzin') {
        item.tipad = 'izin';
      } else if (item.tipad == 'Fazla Mesai'){
        item.tipad = 'fm';
      } else if (item.tipad == 'Yetki'){
        item.tipad = 'sureliyetki';
      } else if (item.tipad == 'Avans'){
        item.tipad = 'avans';
      }

      sp.push({
        mkodu : 'yek038',
        formid : item.Id.toString(),
        kaynak : item.tipad,
        aciklama : aciklama
      })
    })

    return this.requestMethod(sp);
  }

  getDemandProcess(formId : any, formTip : any) {
    var sp : any[] = [{
      mkodu : 'yek037',
      formid : formId.toString(),
      formtipi : formTip
    }]

    return this.requestMethod(sp);
  }

  getDemanded(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek039',
      kaynak  : kaynak
    }]

    return this.requestMethod(sp);
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


    return this.requestMethod(sp);
  }

  getTypeValues(kaynak : string) {
    var sp : any[] = [{
      mkodu : 'yek041',
      id : '0',
      kaynak : kaynak
    }]

    return this.requestMethod(sp);
  }

  getAccessData() {
    var sp : any[] = [{
      mkodu : 'yek043',
      id : '0',
      kaynak : 'access'
    }]

    return this.requestMethod(sp);
  }

  confirmDemandSingle(formId : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek044',
      id : formId.toString(),
      kaynak : kaynak
    }]

    return this.requestMethod(sp);
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

    return this.requestMethod(sp);
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

    return this.requestMethod(sp);
  }

  getMyVisitorDemanded() {
    var sp : any[] = [{
      mkodu : 'yek046',
      id : '0'
    }]

    return this.requestMethod(sp);
  }

  getLocations() {
    var sp : any[] = [{
      mkodu : 'yek047'
    }]

    return this.requestMethod(sp);
  }

  getMyTeam() {
    var sp : any[] = [
      {mkodu : 'yek048'}
    ];

    return this.requestMethod(sp);
  }

  postRequestForm(kaynak : string, form : any, employees:any[]) {
    var sp: any[] = [];

    if (kaynak == 'vardiya') {
      employees.forEach((item:any) => {
        sp.push({
          mkodu: 'yek049',
          kaynak: kaynak,
          tip: form.shift.ID.toString(),
          bastarih: form.startDate,
          bittarih: form.endDate ? form.endDate : form.startDate,
          izinadresi: '',
          ulasim: '',
          yemek: '',
          aciklama: form?.explanation,
          siciller: item,
        });
      });
    } else {
      employees.forEach((item:any) => {
        sp.push({
          mkodu: 'yek049',
          kaynak: kaynak,
          tip: form.tip.ID.toString(),
          bastarih: form?.bassaat ? `${form.bastarih} ${form.bassaat}` : form.bastarih,
          bittarih: form?.bitsaat ? `${form.bittarih} ${form.bitsaat}` : form.bittarih,
          izinadresi: form.izinadresi,
          ulasim: form.ulasim?.ID ? form.ulasim.ID.toString() : '',
          yemek: form.yemek?.ID ? form.yemek.ID.toString() : '',
          aciklama: form.aciklama,
          siciller: item,
        });
      });
    }

    console.log("İzin talebi param : ", sp);


    return this.requestMethodPost(sp);
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

    return this.requestMethod(sp);
  }

  getMyTaskList() {
    var sp : any[] = [
      {mkodu : 'yek051'}
    ];

    return this.requestMethod(sp);
  }

  getIncompleteTimes(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek052',
      zamanaralik : zamanAralik
    }
    ];

    return this.requestMethod(sp);
  }


  getDurationsMobile(yilay : string) {
    var sp : any[] = [{
      mkodu : 'yek053',
      yilay : yilay
    }
    ];

    return this.requestMethod(sp);
  }

  getNewPersons(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek054',
      zamanaralik : zamanAralik
    }
    ];

    return this.requestMethod(sp);
  }

  getPersonsBirthday(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek055',
      zamanaralik : zamanAralik
    }];

    return this.requestMethod(sp);
  }

  getSeniorPersons(zamanAralik : string) {
    var sp : any[] = [{
      mkodu : 'yek056',
      zamanaralik : zamanAralik
    }
    ];

    return this.requestMethod(sp);
  }


  postBulletinForm(formValues : any) {
    var sp : any[] = [{
      mkodu : 'yek057',
      baslik : formValues.title,
      aciklama : formValues.description,
      bastarih : formValues.startDate,
      bittarih : formValues.endDate,
      yayinlayan : formValues.owner,
      imagepath : formValues.image,
      sicilgrup: formValues.registryGroup.id.toString()
    }
    ];

    return this.requestMethod(sp);
  }


  postFileForDemand(file : any, formId : any, kaynak : any, tip : any) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('formid', formId);
    formData.append('kaynak', kaynak);
    formData.append('tip', tip?.toString());

    return this.httpClient.post<any>(this.apiUrlService.apiUrl + '/File/SetFile', formData);
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

    return this.requestMethod(sp);
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

    return this.requestMethod(sp);
  }

  getFileTypeForDemandType(tip : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek062',
      tip : tip.toString(),
      kaynak : kaynak
    }];

    return this.requestMethod(sp);
  }

  getSelectedDayMenus() {
    var sp : any[] = [{
      mkodu : 'yek063',
    }];

    return this.requestMethod(sp);
  }


  getUploadedFiles(formid : any, kaynak : any) {
    var sp : any[] = [{
      mkodu : 'yek066',
      formId : formid.toString(),
      kaynak : kaynak
    }];

    return this.requestMethod(sp);
  }

  getFileForDemand(id : any, uzanti : any, kaynak: any) {
    return this.httpClient.post<any>(this.apiUrlService.apiUrl + '/File/GetFile?uniqueid=' + id + '&filetype=' + uzanti + '&kaynak=' + kaynak, {});
  }

  deleteFileForDemand(id : any, uzanti : any, kaynak: any) {
    return this.httpClient.post<any>(this.apiUrlService.apiUrl + '/File/DeleteFile?uniqueid=' + id + '&filetype=' + uzanti + '&kaynak=' + kaynak, {});
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

    console.log("Ziyaretçi ekle parametreler: ", sp);

    return this.requestMethod(sp);
  }

  removeVisit(visitId : any, description : any) {
    var sp : any[] = [{
      mkodu : 'yek073',
      talepid : visitId.toString(),
      aciklama : description
    }];

    return this.requestMethod(sp);
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
    }];

    return this.requestMethod(sp);
  }


  getVisitorRequests() {
    var sp : any[] = [{
      mkodu : 'yek078'
    }]

    return this.requestMethod(sp);
  }


  approvedVisitor(visitId: any, visitorId: any) {
    var sp : any[] = [{
      mkodu : 'yek079',
      ziyaretid: visitId.toString(),
      id: visitorId.toString()
    }];

    return this.requestMethod(sp);
  }

  cancelVisitor(visitId: any, visitorId: any) {
    var sp : any[] = [{
      mkodu : 'yek080',
      ziyaretid: visitId.toString(),
      id: visitorId.toString()
    }];

    return this.requestMethod(sp);
  }

  getPersonsList() {
    var sp: any[] = [{
      mkodu: 'yek081',
      id: '0',
      xsicilid: '233',
      ad: '',
      soyad: '',
      sicilno: '',
      personelno: '',
      firma: '0',
      bolum: '0',
      pozisyon: '0',
      gorev: '0',
      altfirma: '0',
      yaka: '0',
      direktorluk: '0',
      sicilgroup: '0',
      userdef: '1',
      yetki: '-1',
      cardid: '',
      aktif: '1',
      okod1: '',
      okod2: '',
      okod3: '',
      okod4: '',
      okod5: '',
      okod6: '',
      okod7: '',
      mesaiperiyodu:'0'
    }];

    return this.requestMethod(sp);
  }

  postAdvancedRequest(formValues: any) {
    var sp : any[] = [{
      mkodu : 'yek085',
      bastarih : formValues.tarih,
      taksit : formValues.taksit.toString(),
      parabirimi : formValues.paraBirimi,
      aciklama : formValues.aciklama,
      tutar : formValues.tutar.toString(),
      iban:  formValues.iban,
      ibansave: formValues.ibanKaydet.toString(),
    }];

    return this.requestMethod(sp);
  }

  getIbanList() {
    var sp : any[] = [{
      mkodu : 'yek086'
    }];

    return this.requestMethod(sp);
  }

  requestMethod(sp : any[], headers?:any){
    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);

    var encryptedParam = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
      // keySize : 128 / 8,
      iv : iv,
      mode : CryptoES.mode.CBC,
      padding : CryptoES.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    };

    let options;
    
    if (headers) {
      options = {
        headers : headers,
        params : data
      };
    } else {
      options = {
        params : data
      };
    }
    
    

    return this.httpClient.get<any>(this.apiUrlService.apiUrl + '/process', options);
  }

  processMultiPost(sp: any[], signal?: AbortSignal): Promise<Response> {
    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);

    var encryptedParam = CryptoES.AES.encrypt(
      CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)),
      key,
      {
        // keySize: 128 / 8,
        iv: iv, 
        mode: CryptoES.mode.CBC,
        padding: CryptoES.pad.Pkcs7
      }
    );

    var data = {
      securedata: encryptedParam.toString()
    };

    return fetch(this.apiUrlService.apiUrl + '/ProcessMulti', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal // AbortController'dan gelen sinyali ekledim
    });
  }

  
  




  requestMethodPost(sp : any[]){
    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);

    var encryptedParam = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(sp)), key, {
      // keySize : 128 / 8,
      iv : iv,
      mode : CryptoES.mode.CBC,
      padding : CryptoES.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    };

    return this.httpClient.post<any>(this.apiUrlService.apiUrl + '/process', data);
  }


  report(sp: any) {
    

    return this.httpClient.post<any>(this.apiUrlService.apiUrl + '/Report/PostReportAction', sp);
  }


  logout(sp : any){
    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);

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

    return this.httpClient.get<any>(this.apiUrlService.apiUrl + '/logout', options);
  }

  reverseGeocode(lat: number, lng: number) {
    const key = "AIzaSyDXtjkQ56Mi1TtWXAsAEOTVqo_Gx9nMruE";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}&language=tr`;
    return this.httpClient.get<any>(url).pipe(
      map(res => {
        const result = res.results[0];
        if (result) {
          // return result.formatted_address; 
          return this.extractCityDistrict(result.address_components);
        }
        return 'Konum Bilinmiyor';
      })
    );
  }

  private extractCityDistrict(components: any[]): string {
    const district = components.find(c => c.types.includes('administrative_area_level_2'))?.long_name;
    const city = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
    return `${district}/${city}`;
  }

  getMySurvey() {
    var sp : any[] = [{
      mkodu : 'yek334'
    }];

    return this.requestMethod(sp);
  }

  sendAnswer(sicilid:number,formid:number,soruid:number,cevap:string){

    var sp : any[] = [{

      sicilid:sicilid.toString(),
      formid:formid.toString(),
      soruid:soruid.toString(),
      cevapid:cevap.toString(),
      mkodu : 'yek358'

    }];

    return this.requestMethod(sp);
  }

}
