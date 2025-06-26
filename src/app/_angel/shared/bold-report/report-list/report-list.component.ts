import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent {
    @Input() reports: any[] = [];
    @Input() selectedCategory: any;
    @Output() selectReportEvent = new EventEmitter<any>();
    searchText: string = '';

    showReportList(): any[] {
        return this.reports.filter(report => report.Kategori === this.selectedCategory.category || (report.Kategori === null && this.selectedCategory.category === "Atanmamış"));
    }

    selectReport(report: any): void {
        this.selectReportEvent.emit(report);
    }

    filterReports(): any[] {
        if (!this.searchText) {
            return this.showReportList();
        }
        return this.showReportList().filter(report =>
            report.ad.toLowerCase().includes(this.searchText.toLowerCase()) ||
            report.Aciklama.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    resetSearch(): void {
        this.searchText = '';
    }
}
