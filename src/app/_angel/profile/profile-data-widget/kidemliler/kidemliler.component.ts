import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kidemliler',
  templateUrl: './kidemliler.component.html',
  styleUrls: ['./kidemliler.component.scss']
})
export class KidemlilerComponent implements OnInit {

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
    }, 20000); // 5 saniye (5000 milisaniye) aralıkla bir sonraki öğeye geç
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
