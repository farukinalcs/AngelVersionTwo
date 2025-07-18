import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// Bold Reports
import '../../../../globals';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
// ------------

@Component({
    selector: 'app-bold-report',
    standalone: true,
    imports: [
        CommonModule,
        BoldReportViewerModule
    ],
    templateUrl: './bold-report.component.html',
    styleUrls: ['./bold-report.component.scss']
})
export class BoldReportComponent implements OnInit {
    @Input() title = 'reportviewerapp';
    @Input() serviceUrl: string;
    @Input() reportPath: string;
    @Input() cacheKey: any;
    @Input() parameters: any;

    constructor(
    ) { }

    ngOnInit(): void {
    }

}
