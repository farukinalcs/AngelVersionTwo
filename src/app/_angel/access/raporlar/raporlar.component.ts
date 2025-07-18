import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseXloginDetail } from 'src/app/modules/auth/models/response-Xlogindetail';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';
import { CommonModule } from '@angular/common';
import { BoldReportComponent } from '../../shared/bold-report/bold-report.component';
import { ReportCategoryComponent } from '../../shared/bold-report/report-category/report-category.component';
import { ReportListComponent } from '../../shared/bold-report/report-list/report-list.component';
import { ReportParamsComponent } from '../../shared/bold-report/report-params/report-params.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-raporlar',
    standalone: true,
    imports: [
        CommonModule,
        BoldReportComponent,
        ReportCategoryComponent,
        ReportListComponent,
        ReportParamsComponent,
        TranslateModule
    ],
    templateUrl: './raporlar.component.html',
    styleUrls: ['./raporlar.component.scss']
})
export class RaporlarComponent implements OnInit, OnDestroy {
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
    reportEndDate: any;
    reportStartDate: any;


    showCard: boolean = true;

    
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
            { mkodu: 'yek256', groupid: '1' }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
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


    // toggleReport(): void {

    //   var sp: any[] = [
    //     {
    //       mkodu: 'yek255',
    //       ad: '' ,
    //       soyad: '',
    //       sicilno: '',
    //       'firma#cbo_firma': '',
    //       'bolum#cbo_bolum': '',
    //       'pozisyon#cbo_pozisyon': '',
    //       'gorev#cbo_gorev': '',
    //       'altfirma#cbo_altfirma': '',
    //       'direktorluk#cbo_direktorluk': '',
    //       'yaka#cbo_yaka': '',
    //     }
    //   ];

    //   this.profileService.requestMethodPost(sp).subscribe((response: ResponseModel<any,ResponseXloginDetail>[]) => {
    //     console.log("Rapor Response: ", response);

    //     this.cacheKey = response[0].x[0].cacheKey;
    //     console.log("Cache Key: ", this.cacheKey);


    //     // this.getReport(cacheKey);
    //     this.serviceUrl = 'http://10.20.27.180:5216/api/Report';
    //     this.reportPath = 'ACY00009';
    //     this.parameters = [{
    //       name: 'Parametre Test Ediyorum',
    //       labels: ['cacheKey'],
    //       values: [this.cacheKey],
    //       }];
    //   });

    // }

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



    toggleCard() {
        this.showCard = !this.showCard;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }


}

