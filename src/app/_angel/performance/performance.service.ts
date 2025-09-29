import { asNativeElements, Injectable } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment } from 'src/environments/environment';
import CryptoES from "crypto-es";
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { Scale } from './models/scale';
import { useTheme } from '@primeng/themes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

  setQuestion(question:string,categoryId:number,scaleId:number){
    var sp: any[] = [{
      mkodu: 'yek305',
      aciklama:question,
      kategori: categoryId.toString(),
      olcek:scaleId.toString(),
    }]
    return this.requestMethod(sp);
  }

  getQuestion(questionId:number,categoryId:number){
    var sp: any[] = [{
      mkodu: 'yek306',
      id:questionId.toString(),
      kategoriid:categoryId.toString()
    }]
    return this.requestMethod(sp);
  }

  updateQuestion(questionId:number,question:string,categoryId:number,scaleId:number){
    var sp: any[] = [{
      mkodu: 'yek307',
      id:questionId.toString(),
      aciklama:question,
      kategori: categoryId.toString(),
      olcek:scaleId.toString(),
    }]
    return this.requestMethod(sp);
  }


 deleteQuestion(questionId:number){
    var sp: any[] = [{
      mkodu: 'yek308',
      id:questionId.toString()
    }]
    return this.requestMethod(sp);
  }

  draft_i(title:string,explanation:string){
    var sp: any[] = [{
      mkodu: 'yek313',
      baslik:title.toString(),
      aciklama:explanation.toString()
      
    }]
    console.log("draft_i:",sp);
    return this.requestMethod(sp);
  }



  sablon_question(formId:number,questionId:number,catId:number,){
    console.log("formId:",formId,"question",questionId,"CAT",catId);
    var sp: any[] = [{
      mkodu: 'yek318',
      sablonid:formId.toString(),
      soruid:questionId.toString(),
      kategoriid:catId.toString()
    }]
    return this.requestMethod(sp);
  }

  edit_Category(formId:number,catId:number,puan:any){
    var sp: any[] = [{
      mkodu: 'yek320',
      formid:formId.toString(),
      kategoriid:catId.toString(),
      puan:puan.toString()
    }]
    return this.requestMethod(sp);
  }

  edit_Question(formId:number,catId:number,questionId:number,puan:any){
    var sp: any[] = [{
      mkodu: 'yek321',
      formid:formId.toString(),
      kategoriid:catId.toString(),
      soruid:questionId.toString(),
      puan:puan.toString()
    }]
    return this.requestMethod(sp);
  }

  getSicilGroups(){
    var sp: any[] = [{
      mkodu: 'yek326',
    }]
    return this.requestMethod(sp);
  }

  formMatchSicil(formid:number,sicilgrupid:number,as:number,us:number,myself:number,startDate:string,endDate:string){
    var sp: any[] = [{
      mkodu: 'yek333',
      formid:formid.toString(),
      sicilgrupid:sicilgrupid.toString(),
      ast:as.toString(),
      ust:us.toString(),
      kendi:myself.toString(),
      baslangic:startDate.toString(),
      bitis:endDate.toString()
    }]
    return this.requestMethod(sp);
  }

  draftWithQuest_s(id:number){
    var sp: any[] = [{
      mkodu: 'yek423',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  
  draft_s(id:number){
    var sp: any[] = [{
      mkodu: 'yek434',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

  form_s(id:number){
    var sp: any[] = [{
      mkodu: 'yek314',
      id:id.toString()
    }]
    return this.requestMethod(sp);
  }

}
