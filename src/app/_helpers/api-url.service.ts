import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiUrlService {
    private config: { baseUrl: string } = { baseUrl: '' };

    constructor(private http: HttpClient) { }

    
    loadAppConfig(): Promise<void> {
        const headers = new HttpHeaders({ 'skipInterceptor': 'true' });

        return this.http
            .get('/assets/config.json', { headers })
            .toPromise()
            .then((result: any) => {
                const hostname = window.location.hostname; 
                if (hostname.includes('localhost')) {
                        result.baseUrl = "https://yekgateway.mecloud.com.tr/api"
                    return;
                }
                const parts = hostname.split('.');

                if (parts.length > 0) {
                    const rawSubdomain = parts[0]; 
                    const subdomain = rawSubdomain === 'www' ? 'yek' : rawSubdomain; 
                    const domain = parts.slice(1).join('.'); 
                    result.baseUrl = `https://${subdomain}gateway.${domain}/api`;

                }

                this.config = result;

                console.log('Config Loaded: ', this.config.baseUrl);
            })
            .catch((error) => {
                console.error('Config Load Error: ', error);
                throw error;
            });
    }

    get apiUrl(): string {
        return this.config.baseUrl;
    }
}