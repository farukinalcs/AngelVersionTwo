import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-performance-definitions',

  templateUrl: './performance-definitions.component.html',
  styleUrls: ['./performance-definitions.component.scss']
})
export class PerformanceDefinitionsComponent implements OnInit, OnDestroy {
  activeTab: number = 1;
  private ngUnsubscribe = new Subject();
    constructor(
      private ref : ChangeDetectorRef,
       private translateService: TranslateService
    ) { }

  ngOnInit(): void {

    this.ref.markForCheck();
    this.changeContent(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }
  
  changeContent(tabId: number) {
    this.activeTab = tabId;
  }

  widgets = [
    { title: 'Değerlendirme Kategorileri', value: 1},
    { title: 'Cevap Ölçekleri', value: 2},
    { title: 'Değerlendirme Soruları', value: 3},

  ];

  tabList: any[] = [
    {id: 1, label: this.translateService.instant("Değerlendirme Kategorileri"), icon: "fa-solid fa-building"},
    {id: 2, label: this.translateService.instant("Cevap Ölçekleri"), icon: "fa-solid fa-helmet-safety"},
    {id: 3, label: this.translateService.instant("Değerlendirme Soruları"), icon: "fa-solid fa-clipboard-user"},
  ];

  ngOnDestroy(){

  }
}
