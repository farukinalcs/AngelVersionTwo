import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class DefinitionsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  tabList: any[] = [
    {
      id: 1,
      label: this.translateService.instant('Genel Tanımlar'),
      icon: 'fa-solid fa-gears',
      path: 'settings',
    },
        {
      id: 2,
      label: this.translateService.instant('Saat Tanımları'),
      icon: 'fa-solid fa-clock',
      path: 'general',
    },
    {
      id: 3,
      label: this.translateService.instant('Yemek Menüsü'),
      icon: 'fa-solid fa-utensils',
      path: 'food-menu',
    },
    {
      id: 4,
      label: this.translateService.instant('Yemek Tipi'),
      icon: 'fa-solid fa-burger',
      path: 'food-type',
    },
    {
      id: 5,
      label: this.translateService.instant('Lokasyon'),
      icon: 'fa-solid fa-people-group',
      path: 'food-location',
    },
  ];
  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left';
  currentPage = 0;
  pageSize = 9;
  pages: number[] = [];

  constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    this.createPages();
    this.changeTab(this.tabList[0]);
  }

  createPages() {
    const totalPages = Math.ceil(this.tabList.length / this.pageSize);
    this.pages = Array(totalPages)
      .fill(0)
      .map((x, i) => i);
  }

  changeTab(tab: any) {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
