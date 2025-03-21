import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RatingModule } from 'primeng/rating';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-all-meal-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RatingModule
  ],
  templateUrl: './all-meal-menu.component.html',
  styleUrl: './all-meal-menu.component.scss'
})
export class AllMealMenuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  currentDate: Date = new Date();
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;
  weeks: any[][] = [];
  currentWeekIndex: any = 0;
  selectedMenu: any;
  rating: number = 0;
 
  constructor(
    private profileService : ProfileService,
    private translateService : TranslateService,
    public layoutService : LayoutService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.generateWeeks();
    this.setCurrentIndex();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      this.translateService.instant("Ocak"),
      this.translateService.instant("Şubat"),
      this.translateService.instant("Mart"),
      this.translateService.instant("Nisan"),
      this.translateService.instant("Mayıs"),
      this.translateService.instant("Haziran"),
      this.translateService.instant("Temmuz"),
      this.translateService.instant("Ağustos"),
      this.translateService.instant("Eylül"),
      this.translateService.instant("Ekim"),
      this.translateService.instant("Kasım"),
      this.translateService.instant("Aralık")
    ];
    
    return monthNames[monthIndex];
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.currentWeekIndex = 0;

    this.generateWeeks();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.currentWeekIndex = 0;

    this.generateWeeks();
  }

  generateWeeks(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    let currentDate = new Date(this.currentYear, this.currentMonth, 1 - dayOfWeek);

    this.weeks = [];
    for (let i = 0; i < Math.ceil((daysInMonth + dayOfWeek) / 7); i++) {
      const week: any[] = [];
      for (let j = 0; j < 7; j++) {
        const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
        const dayMenu = [{rating : '', name :'menü 1', joinType : '0'}, {rating : '', name : 'menü 2', joinType : '0'} , {rating : '', name : 'menü 3', joinType : '0'}];
        week.push({
          date: currentDate,
          monthName: this.getMonthName(currentDate.getMonth()).substring(0, 3),
          // dayName: currentDate.toLocaleDateString('en-EN', { weekday : 'short' }),
          dayName: this.getDayName(currentDate.getDay()),
          day: currentDate.getDate().toString(),
          isCurrentMonth: isCurrentMonth,
          menu: dayMenu
        });
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }
      this.weeks.push(week);
    }

    console.log("Weeks : ", this.weeks);
    console.log("Weeks : ", this.weeks[this.currentWeekIndex]);
  }

  getDayName(dayIndex: number): string {
    const dayNames = [
      this.translateService.instant("Pzr"),
      this.translateService.instant("Pzt"),
      this.translateService.instant("Sal"),
      this.translateService.instant("Çar"),
      this.translateService.instant("Per"),
      this.translateService.instant("Cum"),
      this.translateService.instant("Cmt"),
    ];
    return dayNames[dayIndex];
  }

  previousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.ref.detectChanges();
      
    } else if (this.currentWeekIndex == 0) {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.currentMonthName = this.getMonthName(this.currentMonth);
      this.currentWeekIndex = this.weeks.length - 1;
      this.generateWeeks();

    }
  }

  nextWeek(): void {
    if (this.currentWeekIndex < this.weeks.length - 1) {
      this.currentWeekIndex++;
      this.ref.detectChanges();
    } else if (this.currentWeekIndex == this.weeks.length - 1) {
      this.nextMonth();
    }
  }

  showMenu(day: any): void {
    // this.getSelectedDayMenus();
    this.selectedMenu = day;
    console.log("Selected Date : ", day);
    
  }

  setCurrentIndex() {
    this.weeks.forEach((week : any, index : any) => {
      week.forEach((day : any) => {
        if (day.date.getDate() == this.currentDate.getDate() && day.date.getMonth() == this.currentDate.getMonth()) {
          this.currentWeekIndex = index;
          this.selectedMenu = day;
          console.log("Selected Date : ", day);

          this.ref.detectChanges();
        }
      });
    });
  }

  getSelectedDayMenus() {
    this.profileService.getSelectedDayMenus().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      const data = response[0].x[0];

      this.selectedMenu = data;

      this.ref.detectChanges();
    });
  }
  
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
