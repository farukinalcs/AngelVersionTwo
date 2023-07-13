import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dogum-gunu',
  templateUrl: './dogum-gunu.component.html',
  styleUrls: ['./dogum-gunu.component.scss']
})
export class DogumGunuComponent implements OnInit {

  items : any[] = [
    {isim : 'Ekrem', soyisim : 'Işık', img : './assets/media/avatars/300-17.jpg', tarih : '11-07-2023', gun : 'Sali'},
    {isim : 'Işık', soyisim : 'Ekrem', img : './assets/media/avatars/300-5.jpg', tarih : '11-07-2023', gun : 'Sali'},
  ]
  currentItemIndex = 0;

  displayAllBirthdays : boolean;
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
    }, 15000); // 5 saniye (5000 milisaniye) aralıkla bir sonraki öğeye geç
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

  showAllBirthdays() {
    this.displayAllBirthdays = true;
  }
}
