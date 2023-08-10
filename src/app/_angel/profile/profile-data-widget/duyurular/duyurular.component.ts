import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-duyurular',
  templateUrl: './duyurular.component.html',
  styleUrls: ['./duyurular.component.scss']
})
export class DuyurularComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  items: any[] = [
    {tarih : '04 Temmuz 2023', aciklama : "28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler. 28.06.2019 Cuma günü saat 18:00'dan sonra şirketimizde ilaçlama yapılacaktır. Yapılacak ilaçlamanın insan sağlığına bir etkisi yoktur, mesai yapacak personelimiz mesailerini yapabilirler.", bolum : 'İnsan Kaynakları'},
    {tarih : '05 Temmuz 2023', aciklama : 'Araç Talep Modülü Yayınlanmıştır.', bolum : 'Yazılım Geliştirme'},
  ];

  currentItemIndex = 0;
  displayAllAnnouncements : boolean;

  constructor(
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  get currentItem(): any {
    return this.items[this.currentItemIndex];
  }

  showAllAnnouncements() {
    this.displayAllAnnouncements = true;
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
