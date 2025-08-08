import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'app-definitions',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CarouselModule
    ],
    templateUrl: './definitions.component.html',
    styleUrl: './definitions.component.scss'
})
export class DefinitionsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    tabList: any[] = [
        { id: 1, label: this.translateService.instant("Sicil Grubu"), icon: "fa-solid fa-building", path: "access-group" }
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
    ) { }

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