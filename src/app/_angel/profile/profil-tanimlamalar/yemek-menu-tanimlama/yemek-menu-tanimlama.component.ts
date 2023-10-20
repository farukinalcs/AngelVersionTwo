import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';

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
  // sourceItems: any[] = [];
  // targetItems: any[] = [];
  // vacationReasons: any[] = [];

  anayemekOptions: string []= [];
  corbaOptions: string  []= [];
  arasicakOptions: string [] = [];
  salataOptions: string [] = [];
  tatliOptions: string [] = [];
  digerOptions: string [] = [];
  
  selectedAnaYemek: any;
  selectedCorba: any;
  selectedAraSicak: any;
  selectedSalata: any;
  selectedTatli: any;
  selectedDiger:any;

  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  selected: any;
  demandParam: string = '';
  fileParam: string = '';
  dragDrop : boolean = true; 

  foodType: any[] = [
    { id: 1, name: 'Ana Yemek'},
    { id: 2, name: 'Corba'},
    { id: 3, name: 'Ara Sıcak'},
    { id: 4, name: 'Salata'},
    { id: 5, name: 'Tatlı'},
    { id: 6, name: 'Diğer'},
  ];
  // foodType: string[] = [
  //   'Ana Yemek','Corba','Ara Sıcak','Salata','Tatlı','Diğer'
  // ];
  constructor(
    private formBuilder: FormBuilder,
    private profileService : ProfileService,
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
    // if(selectOptions = this.selectedAnaYemek)
    // { this.anayemekOptions.push(this.selectedAnaYemek)
    //   console.log("anayemekOptions : ", this.anayemekOptions);
    // }else if(selectOptions = this.selectedCorba){
    //   this.corbaOptions.push(this.selectedCorba)
    //   console.log("corbaOptions : ", this.corbaOptions);
    // }else if(selectOptions = this.selectedAraSicak){
    //   this.arasicakOptions.push(this.selectedAraSicak)
    //   console.log("arasicakOptions : ", this.arasicakOptions);
    // }else if (selectOptions = this.selectedTatli){
    //   this.tatliOptions.push(this.selectedTatli)
    //   console.log("tatliOptions : ", this.tatliOptions);
    // }else if (selectOptions = this.selectedSalata){
    //   this.salataOptions.push(this.selectedSalata)
    //   console.log("salataOptions : ", this.salataOptions);
    // }else if (selectOptions = this.selectedDiger){
    //   this.digerOptions.push(this.selectedDiger)
    //   console.log("digerOptions : ", this.digerOptions);
    // }

    switch (category) {
      case 'AnaYemek':
        this.anayemekOptions.push(selectOptions);
        console.log("anayemekOptions : ", this.anayemekOptions);
        break;
      case 'Corba':
        this.corbaOptions.push(selectOptions);
        console.log("corbaOptions : ", this.corbaOptions);
        break;
      case 'AraSicak':
        this.arasicakOptions.push(selectOptions);
        console.log("arasicakOptions : ", this.arasicakOptions);
        break;
      case 'Salata':
        this.salataOptions.push(selectOptions);
        console.log("salataOptions : ", this.salataOptions);
        
        break;
      case 'Tatli':
        this.tatliOptions.push(selectOptions);
        console.log("tatliOptions : ", this.tatliOptions);
        break;
      case 'Diğer':
        this.digerOptions.push(selectOptions);
        console.log("digerOptions : ", this.digerOptions);
        break;
      default:
        break;
    }
  }

  


  getMeals(){
    /* Menu oluşturmak için tanımlanan yemekleri getirir*/
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
