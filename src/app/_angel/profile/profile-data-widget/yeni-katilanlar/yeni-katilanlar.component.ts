import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yeni-katilanlar',
  templateUrl: './yeni-katilanlar.component.html',
  styleUrls: ['./yeni-katilanlar.component.scss']
})
export class YeniKatilanlarComponent implements OnInit {

  // items: any[] = [
  //   {tarih : '04 Temmuz 2023', aciklama : 'Şirketimizde ilaçlama yapılacaktır.', bolum : 'İnsan Kaynakları'},
  //   {tarih : '05 Temmuz 2023', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', bolum : 'Yazılım Geliştirme'},
  // ];

  items : any[] = [
    {isim : 'Işık', soyisim : 'Ekrem', img : './assets/media/avatars/300-5.jpg'},
    {isim : 'Ekrem', soyisim : 'Işık', img : './assets/media/avatars/300-17.jpg'},
  ]
  currentItemIndex = 0;

  constructor(
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.autoNavigate();
  }

  autoNavigate(): void {
    setInterval(() => {
      this.nextItem();
      this.ref.detectChanges();      
    }, 10000); // 5 saniye (5000 milisaniye) aralıkla bir sonraki öğeye geç
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
