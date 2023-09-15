import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-yemek-menu',
  templateUrl: './yemek-menu.component.html',
  styleUrls: ['./yemek-menu.component.scss'],
})
export class YemekMenuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  items: any[] = [
    { tarih: '04 Temmuz Salı', menu: ['Brokoli Çorbası', 'Dana Güveç', 'Roka Salatası', 'Çikolatalı Browni'] },
    { tarih: '05 Temmuz Çarşamba', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
    { tarih: '06 Temmuz Perşembe', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
    { tarih: '07 Temmuz Cuma', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
    { tarih: '08 Temmuz Cumartesi', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
  ];
  currentItemIndex = 0;
  displayAllFoodMenu: boolean;

  constructor(
    public layoutService : LayoutService,
    private ref: ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
  }

  get currentItem(): any {
    return this.items[this.currentItemIndex];
  }

  showAllFoodMenu() {
    this.displayAllFoodMenu = true;
  }

  closeMenuDialog() {
    this.displayAllFoodMenu = false;
  }  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}