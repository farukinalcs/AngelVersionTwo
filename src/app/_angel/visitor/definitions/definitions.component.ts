import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-definitions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CarouselModule
  ],
  templateUrl: './definitions.component.html',
  styleUrl: './definitions.component.scss'
})
export class DefinitionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  tabList: any[] = [
    {id: 1, label: this.translateService.instant("Genel"), icon: "fa-solid fa-building", source: "cbo_firma", path: "general"},
    {id: 2, label: this.translateService.instant("Zorunlu Form Alanları"), icon: "fa-solid fa-file-circle-check", source: "cbo_bolum", path: "form-fields"},
    {id: 3, label: this.translateService.instant("Ziyaret Nedeni"), icon: "fa-solid fa-person-walking", source: "cbo_pozisyon", path: "visit-reason"},
    {id: 4, label: this.translateService.instant("Özel Kod"), icon: "fa-solid fa-barcode", source: "cbo_gorev", path: "custom-code"},
    {id: 5, label: this.translateService.instant("Özel Kod Atama"), icon: "fa-solid fa-clipboard-list", source: "cbo_altfirma", path: "custom-code-assignment"}
  ];

  // tabList: any[] = [
  //   {id: 1, label: this.translateService.instant("General"), icon: "fa-solid fa-building", source: "cbo_firma", path: "company"},
  //   {id: 2, label: this.translateService.instant("Mandatory Form Fields"), icon: "fa-solid fa-file-circle-check", source: "cbo_bolum", path: "department"},
  //   {id: 3, label: this.translateService.instant("Visit Reason"), icon: "fa-solid fa-person-walking", source: "cbo_pozisyon", path: "position"},
  //   {id: 4, label: this.translateService.instant("Custom Code"), icon: "fa-solid fa-barcode", source: "cbo_gorev", path: "job"},
  //   {id: 5, label: this.translateService.instant("Custom Code Assignment"), icon: "fa-solid fa-clipboard-list", source: "cbo_altfirma", path: "sub-company"}
  // ];


  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left'; // Animasyon yönü için değişken
  currentPage = 0; // Aktif sayfa numarası
  pageSize = 9; // Her sayfada gösterilecek öğe sayısı
  pages: number[] = []; // Sayfa numaraları dizisi

  constructor(
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.createPages();
    this.changeTab(this.tabList[0]);
  }

  createPages() {
    const totalPages = Math.ceil(this.tabList.length / this.pageSize);
    this.pages = Array(totalPages).fill(0).map((x, i) => i); // Sayfa numaraları oluşturuluyor
  }

  changeTab(tab: any) {
    this.selectedTab = tab;
    console.log("Seçilen menü : ", this.selectedTab);
  }

  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
