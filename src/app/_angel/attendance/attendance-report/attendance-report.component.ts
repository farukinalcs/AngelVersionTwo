import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
  title = 'reportviewerapp';
  public serviceUrl: string;
  public reportPath: string;
  cacheKey: any;
  public parameters: any;
  reports: any[] = [];
  categories: any[] = [];
  selectedCategory: any;
  selectedReport: any;

  constructor(
    private profileService: ProfileService,
    private apiUrlService: ApiUrlService,
  ) { }
  

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    var sp: any[] = [
      { mkodu: 'yek256', groupid: '5' }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any,ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      console.log("Rapor Response: ", data);
      if (message.islemsonuc == -1) {
        return;
      }

      this.reports = [...data];

      this.categories = this.groupByCategory(this.reports);
      console.log("Kategoriler: ", this.categories);
      this.selectedCategory = this.categories[0];
    });
  }

  // Kategorilere göre gruplama yapmak için kullanılan metot
  groupByCategory(data: any[]): any[] {
    let result: any[] = [];

    // Kategoriler üzerinden geçiyoruz
    data.map(item => {
      // Kategori adı null ise, "Unassigned" olarak değiştiriyoruz
      let categoryName = item.Kategori === null ? "Atanmamış" : item.Kategori;

      // Kategoriyi kontrol et, eğer daha önce eklenmemişse result'a ekle
      let category = result.find(r => r.category === categoryName);  // 'category' olarak kontrol ediyoruz

      // Eğer kategori bulunmuşsa, count değerini artır
      if (category) {
        category.count++;
      } else {
        // Yeni kategori ekle
        result.push({ category: categoryName, count: 1 });  // 'category' olarak ekliyoruz
      }
    });

    return result;
  }

  changeCategory(category: any): void {
    this.selectedCategory = category;
  }


  selectReport(report: any): void {
    this.selectedReport = report;
    console.log("Seçilen Rapor: ", this.selectedReport); 
  }
  

  getCacheKey(cacheKey: string): void {
    console.log("Cache Key Geldi: ", cacheKey);
    this.cacheKey = cacheKey;
    this.serviceUrl = this.getApiUrl() + '/BoldReport';
    this.reportPath = this.selectedReport.id;
    this.parameters = [
      {
        name: 'Parametre Test Ediyorum',
        labels: ['cacheKey', 'lang'],
        values: [this.cacheKey, 'en'],
      }
    ];
  }

  getApiUrl() {
    return this.apiUrlService.apiUrl;
  }

  resetReport(): void {
    this.selectedReport = null;
    this.cacheKey = null;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  

}
