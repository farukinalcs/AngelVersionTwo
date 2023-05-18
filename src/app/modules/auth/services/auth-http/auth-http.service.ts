import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import * as CryptoJS from "crypto-js";
import { HelperService } from 'src/app/_helpers/helper.service';

const API_USERS_URL = `${environment.apiUrl}/Login`;
const API_URL = environment.newApiUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {

  constructor(
    private http: HttpClient,
    private helperService : HelperService
  ) {}

  gate() {
    return this.http.get(API_URL + '/gate');
  }

  cryptoLogin(email : string, password : string, lang : any, appList : any) : Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.helperService.gateResponseX,
    });

    var loginOptions = {
      loginName : email,
      password : password,
      langcode : lang,
      appcode : appList,
      mkodu : 'sysLogin'
    };

    var key = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    var iv = CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY);
    console.log("Login Options :", loginOptions);
    
    var encryptedParam = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.helperService.gateResponseY + JSON.stringify(loginOptions)), key, {
      keySize : 128 / 8,
      iv : iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    });

    var data = {
      securedata : encryptedParam.toString()
    };
    
    let options = {
      headers : headers,
      params: data
    };

    console.log("options : ", options);
    return this.http.get<any>(API_URL + '/auth', options);
  }


  login(email:string,password:string): Observable<any>{
    var params = {Name :'LoginName='+email+'&Password='+password+'&ldap=0'}

    return this.http.get<AuthModel>(API_USERS_URL,{params});
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
