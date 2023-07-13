import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-profile-data-widget',
  templateUrl: './profile-data-widget.component.html',
  styleUrls: ['./profile-data-widget.component.scss']
})
export class ProfileDataWidgetComponent implements OnInit {

  items: any[] = [
    {tarih : '04 Temmuz Salı', menu : ['Brokoli Çorbası', 'Dana Güveç', 'Roka Salatası', 'Çikolatalı Browni']},
    {tarih : '05 Temmuz Çarşamba', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '06 Temmuz Perşembe', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '07 Temmuz Cuma', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '08 Temmuz Cumartesi', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
  ];
  currentItemIndex = 0;

  constructor(
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.autoNavigate();
  }

  autoNavigate(): void {
    setInterval(() => {
      this.nextItem();
      console.log("İnterval Çalıştı");


      this.ref.detectChanges();      
    }, 5000); // 5 saniye (5000 milisaniye) aralıkla bir sonraki öğeye geç
  }

  get currentItem(): any {
    return this.items[this.currentItemIndex];
  }

  nextItem(): void {
    this.currentItemIndex++;
    if (this.currentItemIndex >= this.items.length) {
      this.currentItemIndex = 0; // Dizinin son elemanıysa başa dön
    }
  }

  previousItem(): void {
    this.currentItemIndex--;
    if (this.currentItemIndex < 0) {
      this.currentItemIndex = this.items.length - 1; // Dizinin ilk elemanıysa sona git
    }
  }
  
}
