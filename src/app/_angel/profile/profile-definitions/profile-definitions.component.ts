import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-profile-definitions',
  templateUrl: './profile-definitions.component.html',
  styleUrls: ['./profile-definitions.component.scss']
})
export class ProfileDefinitionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();


  definitions: any[] = [
    { id: 1, name: 'İzin Tipleri Dosya Gereklilik Tanımı', tip : 'İzin Tipi', demandParam : 'cbo_izintipleri', fileParam : 'izin' },
    { id: 2, name: 'FM Nedenleri Dosya Gereklilik Tanımı', tip : 'Fazla Mesai Nedeni', demandParam : 'cbo_fmnedenleri', fileParam : 'fm' },
    { id: 3, name: 'Ziyaret Tipleri Dosya Gereklilik Tanımı', tip : 'Ziyaret Tipi', demandParam : 'cbo_ziyaretnedeni', fileParam : 'ziyaretci' },
    { id: 4, name: 'Yemek Tipleri Tanımı', tip : 'Yemek Tipi'},
    { id: 5, name: 'Yemek Menü Tanımı', tip : 'Menu Tipi'},
    { id: 6, name: 'Avans Talep Dosya Gereklilik Tanımı', tip : '', demandParam : '', fileParam : 'avans' },
    { id: 7, name: 'Araç Talep Dosya Gereklilik Tanımı', tip : '', demandParam : '', fileParam : 'arac' },
  ];






  tabList: any[] = [
    {id: 1, label: this.translateService.instant('İzin_Tipi'), icon: "fa-solid fa-person-skiing", demandParam : 'cbo_izintipleri', fileParam : 'izin'},
    {id: 2, label: this.translateService.instant('FM_Nedeni'), icon: "fa-solid fa-business-time", demandParam : 'cbo_fmnedenleri', fileParam : 'fm'},
    {id: 3, label: this.translateService.instant('Ziyaret_Tipi'), icon: "fa-solid fa-person-walking", demandParam : 'cbo_ziyaretnedeni', fileParam : 'ziyaretci'},
    {id: 4, label: this.translateService.instant('Avans_Nedeni'), icon: "fa-solid fa-sack-dollar", demandParam : '', fileParam : 'avans'},
    {id: 5, label: this.translateService.instant('Araç_Nedeni'), icon: "fa-solid fa-car-side", demandParam : '', fileParam : 'arac'},
    {id: 6, label: this.translateService.instant('Yemek_Tipi'), icon: "fa-solid fa-burger"},
    {id: 7, label: this.translateService.instant('Yemek_Menü'), icon: "fa-solid fa-utensils"},
  ];

  visibleTabs: any[] = [];
  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left'; // Animasyon yönü için değişken
  currentPage = 0; // Aktif sayfa numarası
  pageSize = 9; // Her sayfada gösterilecek öğe sayısı
  pages: number[] = []; // Sayfa numaraları dizisi


  constructor(
    private helperService : HelperService,
    public layoutService : LayoutService,
    private translateService: TranslateService
  ) {}
  

  ngOnInit(): void {
    this.updateVisibleTabs();
    this.createPages();
    this.changeTab(this.tabList[0]);
  }

  updateVisibleTabs() {
    this.visibleTabs = this.tabList.slice(this.startIndex, this.startIndex + this.pageSize);
  }

  createPages() {
    const totalPages = Math.ceil(this.tabList.length / this.pageSize);
    this.pages = Array(totalPages).fill(0).map((x, i) => i); // Sayfa numaraları oluşturuluyor
  }

  moveLeft() {
    if (this.startIndex > 0) {
      this.startIndex -= this.pageSize;
      this.slideDirection = 'left';
      this.currentPage = Math.floor(this.startIndex / this.pageSize);
      this.updateVisibleTabs();
    }
  }

  moveRight() {
    if (this.startIndex + this.pageSize < this.tabList.length) {
      this.startIndex += this.pageSize;
      this.slideDirection = 'right';
      this.currentPage = Math.floor(this.startIndex / this.pageSize);
      this.updateVisibleTabs();
    }
  }

  goToPage(pageIndex: number) {
    this.startIndex = pageIndex * this.pageSize;
    this.slideDirection = pageIndex > this.currentPage ? 'right' : 'left';
    this.currentPage = pageIndex;
    this.updateVisibleTabs();
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
