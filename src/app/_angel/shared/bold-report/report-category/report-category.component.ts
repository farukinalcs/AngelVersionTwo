import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-category',
  templateUrl: './report-category.component.html',
  styleUrls: ['./report-category.component.scss']
})
export class ReportCategoryComponent implements OnInit {
  @Input() categories: any[] = [];
  @Input() selectedCategory: any;
  @Output() selectCategory = new EventEmitter<any>();

  ngOnInit(): void {
  }

  constructor() { }

  changeCategory(category: any): void {
    this.selectCategory.emit(category);
  }
}
