import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject } from 'rxjs';
import { BulletinComponent as Form } from '../../request-forms/bulletin/bulletin.component';

@Component({
  selector: 'app-bulletin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    CarouselModule,
    TranslateModule,
    Form
  ],
  templateUrl: './bulletin.component.html',
  styleUrl: './bulletin.component.scss'
})
export class BulletinComponent implements OnInit {
  public closedBulletinForm : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  items: any[] = [
    {tarih : '04 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/6.svg', aciklama : "28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler.", baslik : 'Test Geliştirme'},
    {tarih : '05 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/1.svg', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', baslik : 'Yazılım Geliştirme'},
    {tarih : '06 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/2.svg', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', baslik : 'Mobil Geliştirme'},
    {tarih : '06 Temmuz 2023', foto: './assets/media/illustrations/storyset-1/3.svg', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', baslik : 'Mobil Geliştirme'},
  ];

  displayAllNews : boolean;
  currentItem: any = this.items[0];
  displayBulletinForm: boolean = false;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  showAllNews(item : any) {
    this.currentItem = item;
    this.displayAllNews = true;
  }

  /* Bülten Form Dialog Penceresi */
  // showBulletinFormDialog() {
  //   this.displayBulletinForm = true;
  // }
  // bulletinFormIsSend() {
  //   this.displayBulletinForm = false;
  //   this.closedBulletinForm.next(false);
  // }

  displayBulletin() {
    this.displayBulletinForm = !this.displayBulletinForm;
  }
  /* --------------------------------- */

}
