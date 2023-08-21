import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bulten',
  templateUrl: './bulten.component.html',
  styleUrls: ['./bulten.component.scss']
})
export class BultenComponent implements OnInit {
  public closedBulletinForm : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  items: any[] = [
    {tarih : '04 Temmuz 2023', foto: './assets/media/illustrations/sigma-1/1.png', aciklama : "28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler.", baslik : 'Test Geliştirme'},
    {tarih : '05 Temmuz 2023', foto: './assets/media/illustrations/sigma-1/2.png', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', baslik : 'Yazılım Geliştirme'},
    {tarih : '06 Temmuz 2023', foto: './assets/media/illustrations/sigma-1/3.png', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', baslik : 'Mobil Geliştirme'},
  ];

  displayAllNews : boolean;
  currentItem: any = this.items[0];
  displayBulletinForm: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  showAllNews(item : any) {
    this.currentItem = item;
    this.displayAllNews = true;
  }

  /* Bülten Form Dialog Penceresi */
  showBulletinFormDialog() {
    this.displayBulletinForm = true;
  }
  bulletinFormIsSend() {
    this.displayBulletinForm = false;
    this.closedBulletinForm.next(false);
  }
  /* --------------------------------- */

}
