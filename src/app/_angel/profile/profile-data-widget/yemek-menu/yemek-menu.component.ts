import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yemek-menu',
  templateUrl: './yemek-menu.component.html',
  styleUrls: ['./yemek-menu.component.scss'],
  // animations: [
  //   trigger('slideInOut', [
  //     state('left', style({ transform: 'translateX(-100%)' })),
  //     state('right', style({ transform: 'translateX(100%)' })),
  //     transition('left => right', animate('300ms ease-out')),
  //     transition('right => left', animate('300ms ease-out'))
  //   ])
  // ]
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class YemekMenuComponent implements OnInit {

  items: any[] = [
    {tarih : '04 Temmuz Salı', menu : ['Brokoli Çorbası', 'Dana Güveç', 'Roka Salatası', 'Çikolatalı Browni']},
    {tarih : '05 Temmuz Çarşamba', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '06 Temmuz Perşembe', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '07 Temmuz Cuma', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
    {tarih : '08 Temmuz Cumartesi', menu : ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni']},
  ];
  currentItemIndex = 0;

  displayAllFoodMenu : boolean;

  weeks: any[] = [];
  currentDate: any;
  currentMenu: any;
  currentMonth: string;

  constructor(
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.generateWeeks();
    this.currentDate = this.getCurrentDate();
    this.currentMenu = this.weeks.find((item) => item.date === this.currentDate);
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

  showAllFoodMenu() {
    this.displayAllFoodMenu = true;
  }

  getDateForMenu(item: any) {
    this.currentDate = item.date;
    this.currentMenu = item;
  }

  getCurrentDate(): number {
    const today = new Date();
    return today.getDate();
  }

  generateWeeks(): void {
    const today = new Date();
    this.currentMonth = today.toLocaleString('default', {month:'long'});
    const startDay = new Date(today.getFullYear(), today.getMonth(), 1); // Ayın başlangıç tarihi
    const endDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ayın son günü

    for (let i = startDay.getDate(); i <= endDay.getDate(); i++) {
      const day = new Date(today.getFullYear(), today.getMonth(), i).toLocaleDateString('tr-TR', { weekday: 'short' });
      const date = new Date(today.getFullYear(), today.getMonth(), i).getDate();
      const menus = ['Menü 1', 'Menü 2', 'Menü 3']; // Örnek menüler, istediğiniz menüleri burada oluşturabilirsiniz

      this.weeks.push({ day, date, menus });
    }
  }
}





