import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-definitions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CarouselModule],
  templateUrl: './definitions.component.html',
  styleUrl: './definitions.component.scss',
})
export class DefinitionsComponent {
  private ngUnsubscribe = new Subject();
  tabList: any[] = [
    {
      id: 1,
      label: this.translateService.instant('Genel'),
      icon: 'fa-solid fa-building',
      source: 'cbo_firma',
      path: 'general',
    },
    {
      id: 2,
      label: this.translateService.instant('Kategori Yönetimi'),
      icon: 'fa-solid fa-layer-group',
      source: 'cbo_kategori',
      path: 'education-category',
    },
    {
      id: 3,
      label: this.translateService.instant('Eğitim Tanımlama'),
      icon: 'fa-solid fa-award',
      source: 'cbo_tanimlama',
      path: 'education-create',
    },
    {
      id: 4,
      label: this.translateService.instant('Eğitim Atama'),
      icon: 'fa-solid fa-people-arrows',
      source: 'cbo_atama',
      path: 'education-assignment',
    },
  ];
  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left'; // Animasyon yönü için değişken
  currentPage = 0; // Aktif sayfa numarası
  pageSize = 9; // Her sayfada gösterilecek öğe sayısı
  pages: number[] = []; // Sayfa numaraları dizisi

  constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    this.createPages();
    this.changeTab(this.tabList[0]);
  }

  createPages() {
    const totalPages = Math.ceil(this.tabList.length / this.pageSize);
    this.pages = Array(totalPages)
      .fill(0)
      .map((x, i) => i); // Sayfa numaraları oluşturuluyor
  }

  changeTab(tab: any) {
    this.selectedTab = tab;
    console.log('Seçilen menü : ', this.selectedTab);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
