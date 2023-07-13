import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-duyurular',
  templateUrl: './duyurular.component.html',
  styleUrls: ['./duyurular.component.scss']
})
export class DuyurularComponent implements OnInit {

  items: any[] = [
    {tarih : '04 Temmuz 2023', aciklama : "28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler.", bolum : 'İnsan Kaynakları'},
    {tarih : '05 Temmuz 2023', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', bolum : 'Yazılım Geliştirme'},
  ];

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
