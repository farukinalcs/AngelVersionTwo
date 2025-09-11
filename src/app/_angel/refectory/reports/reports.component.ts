import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ProfileService } from '../../profile/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BoldReportComponent } from '../../shared/bold-report/bold-report.component';
import { ReportParamsComponent } from '../../shared/bold-report/report-params/report-params.component';
import { ReportCategoryComponent } from '../../shared/bold-report/report-category/report-category.component';
import { ReportListComponent } from '../../shared/bold-report/report-list/report-list.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BoldReportComponent,
    ReportParamsComponent,
    ReportCategoryComponent,
    ReportListComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, OnDestroy {
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
  reportStartDate: any;
  reportEndDate: any;

  constructor(
    private profileService: ProfileService,
    private apiUrlService: ApiUrlService,
    private ref: ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    var sp: any[] = [
      { mkodu: 'yek256', groupid: '8' }
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

      this.ref.detectChanges(); // Değişiklikleri algıla ve güncelle
    });
  }


  groupByCategory(data: any[]): any[] {
    let result: any[] = [];

    data.map(item => {
      let categoryName = item.Kategori === null ? "Atanmamış" : item.Kategori;

      let category = result.find(r => r.category === categoryName); 

      if (category) {
        category.count++;
      } else {
        result.push({ category: categoryName, count: 1 }); 
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
        labels: ['cacheKey', 'reportName', 'reportStartDate', 'reportEndDate'],
        values: [this.cacheKey, this.selectedReport.ad, this.reportStartDate, this.reportEndDate],
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

  getParameters(event: any): void {
    console.log("Parametreler: ", event);

    const parameters = event;
    let reportStartDate = null;
    let reportEndDate = null;
    const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (parameters.hasOwnProperty('@tarihbas')) {
        reportStartDate = parameters['@tarihbas'].slice(0, 16).replace('T', ' ') || currentDateTime;
    }

    if (parameters.hasOwnProperty('@tarihbit')) {
        reportEndDate = parameters['@tarihbit'].slice(0, 16).replace('T', ' ') || currentDateTime;
    }

    console.log("Report Start Date: ", reportStartDate);
    console.log("Report End Date: ", reportEndDate);

    this.reportStartDate = reportStartDate;
    this.reportEndDate = reportEndDate;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  

}
