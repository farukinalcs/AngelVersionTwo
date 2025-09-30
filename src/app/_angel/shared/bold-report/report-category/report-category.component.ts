import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-report-category',
    standalone: true,
    imports: [
        CommonModule
    ],
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

    onItemClick(ev: MouseEvent, item: any) {
  // Ripple için tıklama koordinatını hesapla
  const el = ev.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * 100;
  const y = ((ev.clientY - rect.top) / rect.height) * 100;

  // CSS değişkenleri setle
  el.style.setProperty('--rx', `${x}%`);
  el.style.setProperty('--ry', `${y}%`);

  // Ripple class'ını kısa süreli ekle
  el.classList.remove('ripple');       // ardışık tıklamalarda reset
  // reflow için:
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;
  el.classList.add('ripple');

  // Dışarıya item’ı gönder
  this.selectCategory.emit(item);
}
}
