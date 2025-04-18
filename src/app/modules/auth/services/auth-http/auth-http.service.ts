import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import CryptoES from "crypto-es";
import { HelperService } from 'src/app/_helpers/helper.service';
import { environment as prodEnvironment} from 'src/environments/environment.prod';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';


const API_USERS_URL = `${environment.newApiUrl}/Login`;
const API_URL = environment.newApiUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  userkey: string = '';

  constructor(
    private http: HttpClient,
    private helperService : HelperService,
    private apiUrlService: ApiUrlService
  ) {}

  gate() {
    console.log("TESTO :", this.apiUrlService.apiUrl + '/gate');
    const headers = new HttpHeaders({ 'gate': 'true' });
    return this.http.get(this.apiUrlService.apiUrl + '/gate',{headers});
  }

  // generateRandomKey(): string {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let key = '';
  
  //   for (let i = 0; i < 8; i++) {
  //     key += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  
  //   const seconds = new Date().getSeconds().toString().padStart(2, '0');
  
  //   return key + seconds;
  // }

  generateRandomKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
  
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    const now = new Date();
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // 3 haneli salise
  
    return key +  milliseconds;
  }

  // generateRandomKey(): string {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let key = '';
  
  //   for (let i = 0; i < 8; i++) {
  //     key += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  
  //   const milliseconds = new Date().getMilliseconds().toString().padStart(3, '0');
  
  //   // Random bir pozisyon seçip saliseyi oraya yerleştirdim
  //   const insertPosition = Math.floor(Math.random() * key.length);
  //   const newKey = key.slice(0, insertPosition) + milliseconds + key.slice(insertPosition);
  
  //   return newKey;
  // }
  
  

  cryptoLogin(email : string, password : string, lang : any, appList : any) : Observable<any> {
    // let headers = new HttpHeaders({
    //   Authorization: this.helperService.gateResponseX,
    // });
    this.userkey = this.generateRandomKey();
    console.log("Random Key :", this.userkey);
    
    var loginOptions = {
      loginName : email,
      password : password,
      langcode : lang,
      appcode : appList,
      userkey: this.userkey,
      mkodu : 'sysLogin'
    };

    this.helperService.loginOptions = loginOptions;

    var key = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoES.enc.Utf8.parse(this.helperService.gateResponseY);
    console.log("Login Options :", loginOptions);
    
    console.log("this.helperService.loginOptions:", this.helperService.loginOptions);
    
    var encryptedParam = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(loginOptions)), key, {
      iv : iv,
      mode : CryptoES.mode.CBC,
      padding : CryptoES.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    
    };

    let options = {
      // headers : headers,
      params: data
    };

    return this.http.get<any>(this.apiUrlService.apiUrl + '/auth', options);
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  // getUserByToken(token: string): Observable<UserModel> {
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<UserModel>(`${API_USERS_URL}/me`, {
  //     headers: httpHeaders,
  //   });
  // }
  getUserByToken(token: string): Observable<any> {
    return of(true);
  }
}
