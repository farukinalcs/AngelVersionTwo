import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yemek-menu',
  templateUrl: './yemek-menu.component.html',
  styleUrls: ['./yemek-menu.component.scss'],
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





// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-yemek-menu',
//   templateUrl: './yemek-menu.component.html',
//   styleUrls: ['./yemek-menu.component.scss'],
// })
// export class YemekMenuComponent implements OnInit {

//   items: any[] = [
//     { tarih: '04 Temmuz Salı', menu: ['Brokoli Çorbası', 'Dana Güveç', 'Roka Salatası', 'Çikolatalı Browni'] },
//     { tarih: '05 Temmuz Çarşamba', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '06 Temmuz Perşembe', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '07 Temmuz Cuma', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '08 Temmuz Cumartesi', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//   ];
//   currentItemIndex = 0;

//   displayAllFoodMenu: boolean;

//   carouselItems: any[] = [];
//   currentDate: any;
//   currentMenu: any;
//   currentMonth: string;

//   constructor(
//     private ref: ChangeDetectorRef
//   ) { }

//   ngOnInit(): void {
//     this.generateCarouselItems();
//     this.currentDate = this.getCurrentDate();
//     this.currentMenu = this.carouselItems.find((item) => item.date === this.currentDate);
//   }


//   autoNavigate(): void {
//     setInterval(() => {
//       this.nextItem();
//       this.ref.detectChanges();
//     }, 5000); // 5 saniye (5000 milisaniye) aralıkla bir sonraki öğeye geç
//   }

//   get currentItem(): any {
//     return this.items[this.currentItemIndex];
//   }

//   nextItem(): void {
//     this.currentItemIndex++;
//     if (this.currentItemIndex >= this.items.length) {
//       this.currentItemIndex = 0; // Dizinin son elemanıysa başa dön
//     }
//   }

//   previousItem(): void {
//     this.currentItemIndex--;
//     if (this.currentItemIndex < 0) {
//       this.currentItemIndex = this.items.length - 1; // Dizinin ilk elemanıysa sona git
//     }
//   }

//   showAllFoodMenu() {
//     this.displayAllFoodMenu = true;
//   }

//   getDateForMenu(item: any) {
//     this.currentDate = item.date;
//     this.currentMenu = item;
//   }

//   getCurrentDate(): number {
//     const today = new Date();
//     return today.getDate();
//   }

//   generateCarouselItems(): void {
//     const today = new Date();
//     this.currentMonth = today.toLocaleString('default', { month: 'long' });

//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0);

//     const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
//     const endDay = lastDay.getDay() === 0 ? 7 : lastDay.getDay();
//     const prevMonthDays = prevMonthLastDay.getDate();

//     const carouselItems: any[] = [];

//     for (let i = startDay - 1; i > 0; i--) {
//       const date = prevMonthDays - (i - 1);
//       const day = new Date(today.getFullYear(), today.getMonth() - 1, date).toLocaleDateString('tr-TR', { weekday: 'short' });

//       carouselItems.push({ day, date, menus: [] });
//     }

//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       const date = i;
//       const day = new Date(today.getFullYear(), today.getMonth(), i).toLocaleDateString('tr-TR', { weekday: 'short' });

//       carouselItems.push({ day, date, menus: ['Menü 1', 'Menü 2', 'Menü 3'] });
//     }

//     for (let i = 1; i <= 7 - endDay; i++) {
//       const date = i;
//       const day = new Date(today.getFullYear(), today.getMonth() + 1, date).toLocaleDateString('tr-TR', { weekday: 'short' });

//       carouselItems.push({ day, date, menus: [] });
//     }

//     this.carouselItems = carouselItems;
//   }
// }




// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-yemek-menu',
//   templateUrl: './yemek-menu.component.html',
//   styleUrls: ['./yemek-menu.component.scss'],
// })
// export class YemekMenuComponent implements OnInit {
//   items: any[] = [
//     { tarih: '04 Temmuz Salı', menu: ['Brokoli Çorbası', 'Dana Güveç', 'Roka Salatası', 'Çikolatalı Browni'] },
//     { tarih: '05 Temmuz Çarşamba', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '06 Temmuz Perşembe', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '07 Temmuz Cuma', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//     { tarih: '08 Temmuz Cumartesi', menu: ['Mercimek Çorbası', 'Tavuk', 'Salata', 'Browni'] },
//   ];
//   currentItemIndex = 0;

//   displayAllFoodMenu: boolean;

//   carouselItems: any[] = [];
//   currentDate: any;
//   currentMenu: any;
//   currentMonth: string;

//   constructor(private ref: ChangeDetectorRef) { }

//   ngOnInit() {
//     this.setupCarousel();
//   }

//   setupCarousel() {
//     const today = new Date();
//     const currentMonth = this.getMonthName(today.getMonth());
//     this.currentMonth = currentMonth;
  
//     // Calculate the start and end dates for the range of days
//     const startDate = this.getStartDateForCarousel(today);
//     const endDate = this.getEndDateForCarousel(today);
  
//     // Generate the carousel items
//     const days = this.getDaysInRange(startDate, endDate);
//     this.carouselItems = days.map((day, index) => {
//       const formattedDate = this.formatDate(day);
//       const menu = this.getMenuForDate(day);
//       const dayIndex = (index + 1) % 7; // Pazartesi'den başlamak için indeks + 1 mod 7
//       return { date: formattedDate, day: this.getShortDayName(dayIndex), menu: menu };
//     });
  
//     // Set the initial current menu
//     this.currentMenu = this.carouselItems[this.currentItemIndex];
//   }
  
//   getStartDateForCarousel(currentDate: Date): Date {
//     const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); // Önceki ayın başlangıcı
//     const startDayIndex = startDate.getDay(); // Başlangıç gününün indeksi
//     const daysToSubtract = startDayIndex > 0 ? startDayIndex - 1 : 6; // Pazartesi'ye gelene kadar çıkartılacak gün sayısı
//     startDate.setDate(startDate.getDate() - daysToSubtract);
//     return startDate;
//   }
  
//   getEndDateForCarousel(currentDate: Date): Date {
//     const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0); // Sonraki ayın son günü
//     const endDayIndex = endDate.getDay(); // Bitiş gününün indeksi
//     const daysToAdd = endDayIndex > 0 ? 7 - endDayIndex + 1 : 0; // Son güne kadar eklenmesi gereken gün sayısı
//     endDate.setDate(endDate.getDate() + daysToAdd);
//     return endDate;
//   }
  
  
//   getDayName(dayIndex: number): string {
//     const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
//     return days[dayIndex];
//   }
  
//   getShortDayName(dayIndex: number): string {
//     const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
//     return days[dayIndex];
//   }
  

//   formatDate(date: Date): string {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const formattedDay = day < 10 ? `0${day}` : day;
//     const formattedMonth = month < 10 ? `0${month}` : month;
//     return `${formattedDay} ${this.getShortMonthName(month)}`;
//   }
  
//   getMonthName(monthIndex: number): string {
//     const months = [
//       'Ocak',
//       'Şubat',
//       'Mart',
//       'Nisan',
//       'Mayıs',
//       'Haziran',
//       'Temmuz',
//       'Ağustos',
//       'Eylül',
//       'Ekim',
//       'Kasım',
//       'Aralık',
//     ];
//     return months[monthIndex];
//   }
  
//   getShortMonthName(monthIndex: number): string {
//     const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
//     return months[monthIndex];
//   }
  

//   getDaysInRange(startDate: Date, endDate: Date): Date[] {
//     const days: Date[] = [];
//     let currentDate = startDate;
//     while (currentDate <= endDate) {
//       days.push(currentDate);
//       currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Increment by 1 day
//     }
//     return days;
//   }

//   getMenuForDate(date: Date): string[] {
//     const matchingItem = this.items.find((item) => item.tarih.includes(this.formatDate(date)));
//     return matchingItem ? matchingItem.menu : [];
//   }

//   getDateForMenu(item: any) {
//     const index = this.carouselItems.indexOf(item);
//     if (index !== -1) {
//       this.currentItemIndex = index;
//       this.currentMenu = item;
//       this.ref.detectChanges();
//     }
//   }

//   showAllFoodMenu() {
//     this.displayAllFoodMenu = true;
//   }
// }





