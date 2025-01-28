import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { environment as prodEnvironment} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  private config: { baseUrl: string } = { baseUrl: '' };

  constructor(private http: HttpClient) {}

  // Config.json'u yükler
  loadAppConfig(): Promise<void> {
    const headers = new HttpHeaders({ 'skipInterceptor': 'true' });
        // return this.httpClient.get<any>(API_DynamicPlus,{params,headers});
    return this.http
      .get('/assets/config.json',{headers})
      .toPromise()
      .then((result: any) => {
        this.config = result;
        console.log('Config Loaded: ', this.config.baseUrl);
      })
      .catch((error) => {
        console.error('Config Load Error: ', error);
        throw error;
      });
  }
  

  // API URL'sini döner
  get apiUrl(): string {
    return this.config.baseUrl;
  }
}
