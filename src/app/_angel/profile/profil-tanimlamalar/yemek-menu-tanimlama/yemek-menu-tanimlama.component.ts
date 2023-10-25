import { TanimlamalarService } from './../tanimlamalar.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map, Subject, takeUntil, Subscription, of } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';

import { _ } from 'ag-grid-community';
import { meal } from '../../models/meal';


@Component({
  selector: 'app-yemek-menu-tanimlama',
  templateUrl: './yemek-menu-tanimlama.component.html',
  styleUrls: ['./yemek-menu-tanimlama.component.scss']
})
export class YemekMenuTanimlamaComponent implements OnInit {
  private ngUnsubscribe = new Subject()
  @Input() selectedItem: any; 
  @Output() closeAnimationEvent = new EventEmitter<void>();

  form : FormGroup;
  currentDate: Date = new Date();
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;
  weeks: any[][] = [];
  currentWeekIndex: any = 0;  
  selectedMenu: any;
  selectedValue : any[] = []

  corbaOptions: meal  []= [];
  anayemekOptions: meal []= [];
  salataOptions: meal [] = [];
  tatliOptions: meal [] = [];
  mezeOptions:meal [] = [];
  arasicakOptions: meal [] = [];
  arasogukOptions: meal [] = [];
  icecekOptions: meal [] = [];
  meyveOptions: meal [] = [];
  kahvaltilikOptions: meal [] = [];
 
  corbaMenu: meal  []= [];
  anayemekMenu: meal []= [];
  salataMenu: meal [] = [];
  tatliMenu: meal [] = [];
  mezeMenu:meal [] = [];
  arasicakMenu: meal [] = [];
  arasogukMenu: meal [] = [];
  icecekMenu: meal [] = [];
  meyveMenu: meal [] = [];
  kahvaltilikMenu: meal [] = [];
  
 
  
  selectedCorba: meal;
  selectedAnaYemek: meal;
  selectedSalata: meal;
  selectedTatli: meal;
  selectedMeze: meal;
  selectedAraSicak: meal;
  selectedAraSoguk: meal;
  selectedIcecek: meal;
  selectedMeyve:meal;
  selectedKahvaltilik:meal;
  
  selectedDiger  : any;
  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  selected: any;
  demandParam: string = '';
  fileParam: string = '';
  dragDrop : boolean = true; 
  meals:any;

  constructor(
    private formBuilder: FormBuilder,
    private tanimlamalar : TanimlamalarService,
    private translateService : TranslateService,
    private helperService : HelperService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.generateWeeks();
    this.setCurrentIndex();
    this.getMeals();
  }

  onSubmit(data :any){
    console.log("SUBMİT",data)
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      this.translateService.instant("PUBLIC.AYLAR.OCAK"),
      this.translateService.instant("PUBLIC.AYLAR.SUBAT"),
      this.translateService.instant("PUBLIC.AYLAR.MART"),
      this.translateService.instant("PUBLIC.AYLAR.NISAN"),
      this.translateService.instant("PUBLIC.AYLAR.MAYIS"),
      this.translateService.instant("PUBLIC.AYLAR.HAZIRAN"),
      this.translateService.instant("PUBLIC.AYLAR.TEMMUZ"),
      this.translateService.instant("PUBLIC.AYLAR.AGUSTOS"),
      this.translateService.instant("PUBLIC.AYLAR.EYLUL"),
      this.translateService.instant("PUBLIC.AYLAR.EKIM"),
      this.translateService.instant("PUBLIC.AYLAR.KASIM"),
      this.translateService.instant("PUBLIC.AYLAR.ARALIK")
    ];
    
    return monthNames[monthIndex];
  }

  setCurrentIndex() {
    this.weeks.forEach((week : any, index : any) => {
      week.forEach((day : any) => {
        if (day.date.getDate() == this.currentDate.getDate() && day.date.getMonth() == this.currentDate.getMonth()) {
          this.currentWeekIndex = index;
          this.selectedMenu = day;
          console.log("Selected Date CURRENT?: ", day);

          this.ref.detectChanges();
        }
      });
    });
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
        // const dayMenu = [{rating : '', name :'menü 1', joinType : '0'}, {rating : '', name : 'menü 2', joinType : '0'} , {rating : '', name : 'menü 3', joinType : '0'}];
        week.push({
          date: currentDate,
          monthName: this.getMonthName(currentDate.getMonth()).substring(0, 3),
          // dayName: currentDate.toLocaleDateString('en-EN', { weekday : 'short' }),
          dayName: this.getDayName(currentDate.getDay()),
          day: currentDate.getDate().toString(),
          isCurrentMonth: isCurrentMonth,
          // menu: dayMenu
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
      this.translateService.instant("PUBLIC.GUNLER.PAZAR"),
      this.translateService.instant("PUBLIC.GUNLER.PAZARTESI"),
      this.translateService.instant("PUBLIC.GUNLER.SALI"),
      this.translateService.instant("PUBLIC.GUNLER.CARSAMBA"),
      this.translateService.instant("PUBLIC.GUNLER.PERSEMBE"),
      this.translateService.instant("PUBLIC.GUNLER.CUMA"),
      this.translateService.instant("PUBLIC.GUNLER.CUMARTESI"),
    ];
    return dayNames[dayIndex];
  }


  showMenu(day: any): void {
    // this.getSelectedDayMenus();
    this.selectedMenu = day;
    console.log("Selected Date : ", day);
    
  }

  onSelectionChange(selectOptions : any, category: string){
    const categoryMenu = this.getMenuForCategory(category);
    const isDuplicate = categoryMenu.some(menuItem => this.areObjectsEqual(menuItem, selectOptions));
    if (!isDuplicate) {
      categoryMenu.push(selectOptions);
      console.log(`${category} Menu:`, categoryMenu);
    } else {
      console.log('Bu öğe zaten menüde var.');
      const index = categoryMenu.indexOf(selectOptions)
      if(index > -1){
        categoryMenu.splice(index,1);
        console.log(`${category} Menu:`, categoryMenu);
      }
    }
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getMenuForCategory(category: string): any[] {
    switch (category) {
      case 'Corba':
        return this.corbaMenu;
      case 'AnaYemek':
        return this.anayemekMenu;
      case 'Salata':
        return this.salataMenu;
      case 'Tatli':
        return this.tatliMenu;
      case 'Meze':
        return this.mezeMenu;
      case 'AraSicak':
        return this.arasicakMenu;
      case 'AraSoguk':
        return this.arasogukMenu;
      case 'Icecekler':
        return this.icecekMenu;
      case 'Meyve':
        return this.meyveMenu;
      case 'Kahvaltilik':
        return this.kahvaltilikMenu;
      default:
        return [];
    }
  }




  onSelectionChange3(selectOptions : any, category: string){
    switch (category) {
    
      case 'Corba':
        this.corbaMenu.push(selectOptions);
        console.log("corbaMenu : ", this.corbaMenu);
        break;
      case 'AnaYemek':
        this.anayemekMenu.push(selectOptions);
        console.log("anayemekMenu : ", this.anayemekMenu);
        break;
      case 'Salata':
        this.salataMenu.push(selectOptions);
        console.log("salataMenu : ", this.salataMenu); 
        break;
      case 'Tatli':
        this.tatliMenu.push(selectOptions);
        console.log("tatliMenu : ", this.tatliMenu);
        break;
      case 'Meze':
        this.mezeMenu.push(selectOptions);
        console.log("mezeMenu : ", this.mezeMenu);
        break;
      case 'AraSicak':
        this.arasicakMenu.push(selectOptions);
        console.log("arasicakMenu : ", this.arasicakMenu);
        break;
      case 'AraSoguk':
        this.arasogukMenu.push(selectOptions);
        console.log("arasogukMenu : ", this.arasogukMenu);
        break;
      case 'icecekler':
        this.icecekMenu.push(selectOptions);
        console.log("icecekMenu : ", this.icecekMenu);
        break;
      case 'Meyve':
        this.meyveMenu.push(selectOptions);
        console.log("meyveMenu : ", this.meyveMenu);
        break;
      case 'Kahvaltilik':
        this.kahvaltilikMenu.push(selectOptions);
        console.log("kahvaltilikMenu : ", this.kahvaltilikMenu);
        break;
      default:
        break;
    }
  }

  onSelectionChange2(yemektip:number) {
    const gruplar = new Map<number, typeof this.meals>();


    

 }

  


  getMeals(){
    /* Menu oluşturmak için tanımlanan yemekleri getirir*/
    this.tanimlamalar
    .getMeal()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      this.meals = response[0].x;
     this.sperateLists(this.meals)
 
   console.log("getMeal'S:",this.meals);
      
      this.ref.detectChanges();
    });

    // this.meals.forEach((item:any) => {
    //   if(item.YemektipiID == 1){
    //     this.corbaOptions.push(item)
    //     console.log("this.corbaOptions", this.corbaOptions);
    //   }
    // });
   
  }

  sperateLists(_list:any){
    for(let i=0; i <= _list.length; i++){
      if(_list[i]?.YemektipiID == 1)
      {
        this.corbaOptions.push(_list[i])
        
      } else if (_list[i]?.YemektipiID == 2){
        this.anayemekOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 3){
        this.salataOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 4){
        this.tatliOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 5){
        this.mezeOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 6){
        this.arasicakOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 7){
        this.arasogukOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 8){
        this.icecekOptions.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 9){
        this.meyveOptions.push(_list[i])
        
      }else{
        this.kahvaltilikOptions.push(_list[i])
      }
    }
  }

  onCloseButtonClick() {
    this.fileParam = '';
    this.demandParam = '';
    this.closeAnimationEvent.emit();

    this.ref.detectChanges();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
