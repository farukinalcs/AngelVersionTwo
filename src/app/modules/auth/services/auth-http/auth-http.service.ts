import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import * as CryptoJS from "crypto-js";
import { HelperService } from 'src/app/_helpers/helper.service';
import { Buffer } from 'buffer';

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

  // public methods
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
  //     email,
  //     password,
  //   });
  // }

  gate() {
    return this.http.get(API_URL + '/gate');
  }

  cryptoLogin(email : string, password : string) : Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.helperService.gateResponseX,
    });

    var loginOptions = {
      loginName : email,
      password : password,
      point : "login",
      islemTipi : "ctrl",
      SerialNumber : "",
      ldap : "0",
      mkodu : "sysLogin"
    };
    var todayDate = new Date();
    var mm = todayDate.getMonth() + 1;
    var dd = todayDate.getDate();
    
    var keyx = [
      todayDate.getFullYear(),
      mm.toString().padStart(2, '0'),
      dd.toString().padStart(2, '0'),
      mm.toString().padStart(2, '0'),
      todayDate.getFullYear(),
      dd.toString().padStart(2, '0'),
    ].join('');
    console.log("keyxTest : ", keyx);

    console.log("TEST : ", JSON.stringify(loginOptions));
    
    var key = CryptoJS.enc.Utf8.parse(keyx);
    var iv = CryptoJS.enc.Utf8.parse(keyx);
    var encryptedParam = CryptoJS.AES.encrypt(JSON.stringify(loginOptions), key, {
      keySize : 128 / 8,
      iv : iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    });

    // var data = {
    //   securedata: btoa(encryptedParam.toString())
    // };

    var data = {
      securedata: this.convertBase64(encryptedParam.toString())
    };
    console.log("ENCRYPTED DATA: ", data);
  
    var decryptedData = this.decryptData(encryptedParam, keyx, keyx);
    console.log("DECRYPTED DATA: ", JSON.parse(decryptedData));

    let options = {
      headers : headers,
      params: data
    };

    console.log("options : ", options);
    
    return this.http.get<any>(API_URL + '/process', options);
  }

  convertBase64(encryptedParam: string): string {
    const buffer = Buffer.from(encryptedParam.toString());
    return buffer.toString('base64');
  }


  decryptData(encryptedData: any, key: string, iv: string): string {
    var parsedKey = CryptoJS.enc.Utf8.parse(key);
    var parsedIV = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encryptedData, parsedKey, {
      iv: parsedIV,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  login(email:string,password:string): Observable<any>{
  
    var params = {Name :'LoginName='+email+'&Password='+password+'&ldap=0'}
    
      // let headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      // });
      // let options = {headers : headers};
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
