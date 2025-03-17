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

  showReportList(): any[] {
    return this.reports.filter(report => report.Kategori === this.selectedCategory.category || (report.Kategori === null && this.selectedCategory.category === "Atanmamış"));
  }

  selectReport(report: any): void {
    this.selectReportEvent.emit(report);
  }
}
