import { TanimlamalarService } from './../../profil-tanimlamalar/tanimlamalar.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

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

  _getDailyMenu:any;
  _currentDate:any;
  
  constructor(
    private ref: ChangeDetectorRef,
    public tanimlamalar : TanimlamalarService,) {  
  }
  

  ngOnInit(): void {
    this.getDailyMenu();
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
  
  getDailyMenu(){
    /* Tanımlanmış günlük menüleri getirir*/
    this.tanimlamalar
    .getDailyMenu(this.dateConverter())
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
 
      this._getDailyMenu = response[0].x
        console.log("getDailyMenu:",response[0].x);
        
      this.ref.detectChanges();
    });
    
  }

  dateConverter():any
  { 
    this._currentDate = new Date();
    const yil = this._currentDate.getFullYear();
    const ay = (this._currentDate.getMonth() + 1).toString().padStart(2, '0');
    const gun = this._currentDate.getDate().toString().padStart(2, '0');
    const yeniTarihFormati = `${yil}-${ay}-${gun}`;
    return yeniTarihFormati;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}