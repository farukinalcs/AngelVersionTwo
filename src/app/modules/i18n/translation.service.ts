import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
  private langIds: any = [];
  
  langObs = new Subject();

  constructor(private translate: TranslateService, private http: HttpClient, private apiUrlService: ApiUrlService) {
    // add new langIds to the list
    this.translate.addLangs(['tr']);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('tr');
  }

  getApiUrl() {
    return this.apiUrlService.apiUrl;
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
    this.translate.use(this.getSelectedLanguage());
  }

  loadTranslationsFromApi(lang: string): void {
    setTimeout(() => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'skipInterceptor': 'true',
      });

      const params = new HttpParams().set('langcode', lang);

      this.http.get(`${this.getApiUrl()}/language`, { headers, params, responseType: 'json' }).subscribe(
        (translations: any) => {
          this.translate.setTranslation(translations.lang, translations.data, true);
          this.langIds.push(translations.lang);

          this.translate.addLangs(this.langIds);
          this.translate.use(this.getSelectedLanguage());
        },
        (error) => {
          console.error('Error loading translations:', error);
        }
      );
    }, 100);
  }

  setLanguage(lang: string) {
    if (lang) {
      this.loadTranslationsFromApi(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      this.langObs.next(lang);
    }
  }

  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}