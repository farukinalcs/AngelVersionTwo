import { TanimlamalarService } from './../tanimlamalar.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil} from 'rxjs';



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
  // public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  bayrak:boolean=true;
  form : FormGroup;
  currentDate: Date = new Date();
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;
  weeks: any[][] = [];
  currentWeekIndex: any = 0;  
  selectDateForMenu: any;


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

  _getDailyMenu:any;
  _newDateFormat:any

  
 
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');

  demandParam: string = '';
  fileParam: string = '';
  dragDrop : boolean = true; 
  meals:any;

  constructor(
    private tanimlamalar : TanimlamalarService,
    private translateService : TranslateService,
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

  setCurrentIndex() {
    this.weeks.forEach((week : any, index : any) => {
      week.forEach((day : any) => {
        if (day.date.getDate() == this.currentDate.getDate() && day.date.getMonth() == this.currentDate.getMonth()) {
          this.currentWeekIndex = index;
          this.selectDateForMenu = day.date;
          console.log("Selected Date CURRENT?: ", this.selectDateForMenu);
          this.dateConverter(this.selectDateForMenu);
          this.getDailyMenu(this.selectDateForMenu);

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


  showMenu(day: any): void {
    // this.getSelectedDayMenus();
    this.selectDateForMenu = day.date;
    console.log("Selected Date : ", this.selectDateForMenu); 
    this.clearSelectList();
    this.getDailyMenu(this.selectDateForMenu);
    this.dateConverter(this.selectDateForMenu);
  }

  dateConverter(date:any):any
  { console.log("date",date);
    const newDate = new Date(date);
    console.log("newDate",newDate);
    const yil = newDate.getFullYear();
    console.log("yil",yil);
    const ay = (newDate.getMonth() + 1).toString().padStart(2, '0');
    console.log("ay",ay);
    const gun = newDate.getDate().toString().padStart(2, '0');
    console.log("gun",gun);
    const yeniTarihFormati = `${yil}-${ay}-${gun}`;
    this._newDateFormat = yil+"-"+ay+"-"+gun;
    console.log("_newDateFormat",this._newDateFormat);
    return yeniTarihFormati;
  }

  onSelectionChange(selectOptions : any, category: string){
    console.log('İTEEEM.',selectOptions);
    const categoryMenu = this.getMenuForCategory(category);
    const isDuplicate = categoryMenu.some(menuItem => this.areObjectsEqual(menuItem, selectOptions));
    console.log("isDuplicate", isDuplicate);
    console.log("categoryMenu", categoryMenu);
    if (!isDuplicate) {
      categoryMenu.push(selectOptions);
      this.setDailyMenu(selectOptions.Id,selectOptions.YemektipiID);
      console.log(`${category} Menu:`, categoryMenu);
      console.log("selectOptions Menu", selectOptions);
    } else {
      console.log('Bu öğe zaten menüde var.');
      const index = categoryMenu.indexOf(selectOptions)
      if(index > -1){
        categoryMenu.splice(index,1);
        this.clearDailyMenu(selectOptions.Id,selectOptions.YemektipiID);
        
        console.log(`${category} Menu:`, categoryMenu);
      }
    }

  }



  setDailyMenu(yemek:any,yemektipi:any){
    /* Günlük menü oluşturma talebi*/
    this.tanimlamalar
    .setDailyMenu(this.dateConverter(this.selectDateForMenu),yemek,yemektipi)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
        console.log("setDailyMenu'S:",response);
      this.ref.detectChanges();
    });
  }

  clearDailyMenu(yemek:any,yemektipi:any)
  {
    /* Tanımlanmış günlük menüleri iptal eder*/
    this.tanimlamalar
    .clearDailyMenu(this.dateConverter(this.selectDateForMenu),yemek,yemektipi)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
        console.log("clearDailyMenu'S:",response[0].x);
      this.ref.detectChanges();
    });
  }

  getDailyMenu(date:any){
    /* Tanımlanmış günlük menüleri getirir*/
    console.log("getDailyMenu:",date);
    this.bayrak = false;
    console.log("this.isLoading111:",this.bayrak);
    this.tanimlamalar
    .getDailyMenu(this.dateConverter(date))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
 
      this._getDailyMenu = response[0].x
        console.log("getDailyMenu:",response[0].x);
        this.bayrak = true;
        console.log("this.isLoading:",this.bayrak);
      this.menuAyrimi(this?._getDailyMenu);
      this.ref.detectChanges();
    });
    
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    console.log("obj1:",obj1);
    console.log("obj2:",obj2);
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getMenuForCategory(category: string): any[] {
    switch (category) {
      case 'Corba':
        console.log("switch corbaMENU:",this.corbaMenu)
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


  getMeals(){
    /* Menu oluşturmak için tanımlanan yemekleri getirir*/
    this.tanimlamalar
    .getMeal()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      this.meals = response[0].x;
     this.sperateLists(this.meals) /* Yemekleri türlerine göre gruplama yapar*/
 
   console.log("getMeal'S:",this.meals);
      
      this.ref.detectChanges();
    });

  }

  deneme(_list:any){
    for(let i=0; i <= _list.length; i++)
    {
      const yemekTipi = _list[i]?.Yemektipi;
      this.corbaMenu.indexOf(yemekTipi)
    }
  }

  sperateLists(_list:any){
    for(let i=0; i <= _list.length; i++){
      if(_list[i]?.YemektipiID == 1)
      {
        this.corbaOptions.push(_list[i]) 
        console.log("corbaMENU:",this.corbaMenu)     
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
        
      }else if (_list[i]?.YemektipiID == 10){
        this.kahvaltilikOptions.push(_list[i])
      }
    }
  }

  menuAyrimi(_list:any){
    console.log("_list menuAyrimi:",_list)
    for(let i=0; i <= _list?.length; i++){
      if(_list[i]?.YemektipiID == 1)
      {
        this.corbaMenu.push(_list[i])
        console.log("getDailyMenu corbaMENU:",this.corbaMenu)
      } else if (_list[i]?.YemektipiID == 2){
        this.anayemekMenu.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 3){
        this.salataMenu.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 4){
        this.tatliMenu.push(_list[i])
       
      }else if (_list[i]?.YemektipiID == 5){
        this.mezeMenu.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 6){
        this.arasicakMenu.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 7){
        this.arasogukMenu.push(_list[i])
        
      }else if (_list[i]?.YemektipiID == 8){
        this.icecekMenu.push(_list[i])
       
        
      }else if (_list[i]?.YemektipiID == 9){
        this.meyveMenu.push(_list[i]);
        
      }else if(_list[i]?.YemektipiID == 10){
        this.kahvaltilikMenu.push(_list[i]);
      }
    }
  }
  clearSelectList(){
    this.corbaMenu = [];
    this.anayemekMenu = [];
    this.salataMenu = [];
    this.tatliMenu = [];
    this.mezeMenu = [];
    this.arasicakMenu = [];
    this.arasogukMenu = [];
    this.icecekMenu = [];
    this.meyveMenu = [];
    this.kahvaltilikMenu = [];
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
