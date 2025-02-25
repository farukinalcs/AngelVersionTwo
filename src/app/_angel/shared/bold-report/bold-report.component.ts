import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bold-report',
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
  ) {}
  
  ngOnInit(): void {
  }

}
