import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oneriler',
  templateUrl: './oneriler.component.html',
  styleUrls: ['./oneriler.component.scss']
})
export class OnerilerComponent implements OnInit {

  items: any[] = [
    {anaBaslik : 'Sosyal Aktivite', altBaslik : 'Kahvaltı Etkinliği', onay : '113', red : '7'},
    {anaBaslik : 'Teknik İhtiyaç', altBaslik : 'Drone ile Sulama Projesi ve...', onay : '45', red : '12'},
    {anaBaslik : 'Eğitim', altBaslik : 'UI/UX Eğitimi', onay : '98', red : '27'},
  ];
  currentItemIndex = 0;

  constructor(
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.autoNavigate();
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
