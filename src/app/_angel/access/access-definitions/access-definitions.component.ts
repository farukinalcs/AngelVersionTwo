import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-access-definitions',
  templateUrl: './access-definitions.component.html',
  styleUrls: ['./access-definitions.component.scss']
})
export class AccessDefinitionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  tabList: any[] = [
    {id: 1, label: this.translateService.instant("Firma"), icon: "fa-solid fa-building", source: "cbo_firma", path: "company"},
    {id: 2, label: this.translateService.instant("Bölüm"), icon: "fa-solid fa-helmet-safety", source: "cbo_bolum", path: "department"},
    {id: 3, label: this.translateService.instant("Pozisyon"), icon: "fa-solid fa-clipboard-user", source: "cbo_pozisyon", path: "position"},
    {id: 4, label: this.translateService.instant("Görev"), icon: "fa-solid fa-list-check", source: "cbo_gorev", path: "job"},
    {id: 5, label: this.translateService.instant("Alt_Firma"), icon: "fa-solid fa-handshake", source: "cbo_altfirma", path: "sub-company"},
    {id: 6, label: this.translateService.instant("Direktörlük"), icon: "fa-solid fa-people-group", source: "cbo_direktorluk", path: "directorship"},
    {id: 7, label: this.translateService.instant("Yaka"), icon: "fa-brands fa-black-tie", source: "cbo_yaka", path: "collar"},
    {id: 8, label: this.translateService.instant("Terminal_Grupları"), icon: "fa-solid fa-gears", path: "device-groups"},
    {id: 9, label: this.translateService.instant("Time_Zone"), icon: "fa-solid fa-hourglass-half", path: "time-zone"},
    {id: 10, label: this.translateService.instant("Parmak_İzi"), icon: "fa-solid fa-fingerprint", path: "fingerprint"},
    {id: 11, label: this.translateService.instant("Belge_Tipi"), icon: "fa-solid fa-file", source: "cbo_belgetipi", path: "doc-type"},
    {id: 12, label: this.translateService.instant("Puantaj"), icon: "fa-solid fa-clock", source: "cbo_puantaj", path: "time-attendance"},
    {id: 13, label: this.translateService.instant("Mail_Servis"), icon: "fa-solid fa-envelope", path: "mail-service"},
    {id: 14, label: this.translateService.instant("FTP_Bilgileri"), icon: "fa-solid fa-server", path: "ftp-info"},
    {id: 15, label: this.translateService.instant("Ayrılış_Nedeni"), icon: "fa-solid fa-clipboard-question", source: "sys_ayrilisnedeni", path: "leave-reason"},
    {id: 16, label: this.translateService.instant("Güvenlik"), icon: "fa-solid fa-shield-halved", path: "security"},
    {id: 17, label: this.translateService.instant("Olay_Kodları"), icon: "fa-solid fa-list-ol", path: "event-codes"},
    {id: 18, label: this.translateService.instant("Yazıcılar"), icon: "fa-solid fa-print", path: "printers"},
    {id: 19, label: this.translateService.instant("Led_Panalor"), icon: "fa-solid fa-tachograph-digital", path: "led-panels"},
    {id: 20, label: this.translateService.instant("Yetki_Rolleri"), icon: "fa-solid fa-key", path: "authority-roles"},
    {id: 21, label: this.translateService.instant("Ben_Sayfası"), icon: "fa-solid fa-user", path: "my-page"}
  ];

  visibleTabs: any[] = [];
  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left'; // Animasyon yönü için değişken
  currentPage = 0; // Aktif sayfa numarası
  pageSize = 9; // Her sayfada gösterilecek öğe sayısı
  pages: number[] = []; // Sayfa numaraları dizisi

  constructor(
    private profileService: ProfileService,
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