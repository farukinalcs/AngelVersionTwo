import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { finalize, Subject, takeUntil } from 'rxjs';
import { meal } from 'src/app/_angel/profile/models/meal';
import { TanimlamalarService } from 'src/app/_angel/profile/profile-definitions/tanimlamalar.service';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

type DayCell = {
  date: Date;
  monthName: string;
  dayName: string;
  day: string;
  isCurrentMonth: boolean;
};

@Component({
  selector: 'app-food-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, DropdownModule],
  templateUrl: './food-menu.component.html',
  styleUrls: ['./food-menu.component.scss'],
})
export class FoodMenuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  @Input() selectedItem: any | null = null;
  @Output() closeAnimationEvent = new EventEmitter<void>();

  form!: FormGroup;
  deviceGroups: Array<{ id: number; ad: string; amac: number }> = [];
  currentDate: Date = new Date();
  currentMonth!: number;
  currentYear!: number;
  currentMonthName!: string;
  piece: any;
  weeks: DayCell[][] = [];
  currentWeekIndex = 0;
  selectDateForMenu!: Date;

  corbaOptions: meal[] = [];
  anayemekOptions: meal[] = [];
  salataOptions: meal[] = [];
  tatliOptions: meal[] = [];
  mezeOptions: meal[] = [];
  arasicakOptions: meal[] = [];
  arasogukOptions: meal[] = [];
  icecekOptions: meal[] = [];
  meyveOptions: meal[] = [];
  kahvaltilikOptions: meal[] = [];

  // Gün için seçilmişler
  corbaMenu: meal[] = [];
  anayemekMenu: meal[] = [];
  salataMenu: meal[] = [];
  tatliMenu: meal[] = [];
  mezeMenu: meal[] = [];
  arasicakMenu: meal[] = [];
  arasogukMenu: meal[] = [];
  icecekMenu: meal[] = [];
  meyveMenu: meal[] = [];
  kahvaltilikMenu: meal[] = [];
  menuItems: number[] = [];
  // ngModel bound değerler
  selectedCorba: meal | null = null;
  selectedAnaYemek: meal | null = null;
  selectedSalata: meal | null = null;
  selectedTatli: meal | null = null;
  selectedMeze: meal | null = null;
  selectedAraSicak: meal | null = null;
  selectedAraSoguk: meal | null = null;
  selectedIcecek: meal | null = null;
  selectedMeyve: meal | null = null;
  selectedKahvaltilik: meal | null = null;
  selectedMenu: number = 1;
  _getDailyMenu: any;
  _newDateFormat: string | null = null;

  dropdownEmptyMessage = '';
  selectedGroupId: number = 0;
  demandParam = '';
  fileParam = '';
  bayrak = true; // loading flag
  dragDrop = true;
  meals: any[] = [];

  constructor(
    private tanimlamalar: TanimlamalarService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.dropdownEmptyMessage =
      this.translateService.instant('Kayıt_Bulunamadı');
    this.getFoodPiece();

    console.log(this.menuItems);

    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.getDeviceGroups();
    this.generateWeeks();
    this.setCurrentIndex();
    this.getMeals();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      this.translateService.instant('Ocak'),
      this.translateService.instant('Şubat'),
      this.translateService.instant('Mart'),
      this.translateService.instant('Nisan'),
      this.translateService.instant('Mayıs'),
      this.translateService.instant('Haziran'),
      this.translateService.instant('Temmuz'),
      this.translateService.instant('Ağustos'),
      this.translateService.instant('Eylül'),
      this.translateService.instant('Ekim'),
      this.translateService.instant('Kasım'),
      this.translateService.instant('Aralık'),
    ];
    return monthNames[monthIndex];
  }

  getDayName(dayIndex: number): string {
    const dayNames = [
      this.translateService.instant('Pzr'),
      this.translateService.instant('Pzt'),
      this.translateService.instant('Sal'),
      this.translateService.instant('Çar'),
      this.translateService.instant('Per'),
      this.translateService.instant('Cum'),
      this.translateService.instant('Cmt'),
    ];
    return dayNames[dayIndex];
  }

  setCurrentIndex() {
    this.weeks.forEach((week, index) => {
      week.forEach((day) => {
        if (
          day.date.getDate() === this.currentDate.getDate() &&
          day.date.getMonth() === this.currentDate.getMonth()
        ) {
          this.currentWeekIndex = index;
          this.selectDateForMenu = day.date;
          this.dateConverter(this.selectDateForMenu);
          this.getDailyMenu1(this.selectDateForMenu);
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
    } else {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.currentMonthName = this.getMonthName(this.currentMonth);
      this.generateWeeks();
      this.currentWeekIndex = this.weeks.length - 1;
    }
  }

  nextWeek(): void {
    if (this.currentWeekIndex < this.weeks.length - 1) {
      this.currentWeekIndex++;
      this.ref.detectChanges();
    } else {
      this.nextMonth();
    }
  }

  generateWeeks(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Pazartesi=0
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    let current = new Date(this.currentYear, this.currentMonth, 1 - dayOfWeek);
    this.weeks = [];

    for (let i = 0; i < Math.ceil((daysInMonth + dayOfWeek) / 7); i++) {
      const week: DayCell[] = [];
      for (let j = 0; j < 7; j++) {
        week.push({
          date: current,
          monthName: this.getMonthName(current.getMonth()).substring(0, 3),
          dayName: this.getDayName(current.getDay()),
          day: current.getDate().toString(),
          isCurrentMonth: current.getMonth() === this.currentMonth,
        });
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
      }
      this.weeks.push(week);
    }
  }

  showMenu(day: DayCell): void {
    this.selectDateForMenu = day.date;
    this.clearSelectList();
    this.getDailyMenu1(this.selectDateForMenu);
    this.dateConverter(this.selectDateForMenu);
  }

  dateConverter(date: Date): string {
    const d = new Date(date);
    const yil = d.getFullYear();
    const ay = (d.getMonth() + 1).toString().padStart(2, '0');
    const gun = d.getDate().toString().padStart(2, '0');
    const s = `${yil}-${ay}-${gun}`;
    this._newDateFormat = s;
    return s;
  }

  trackById = (_: number, it: any) => it?.Id;

  onSelectionChange(selectOptions: meal, category: string) {
    const categoryMenu = this.getMenuForCategory(category);
    const idx = categoryMenu.findIndex((m) =>
      this.areObjectsEqual(m, selectOptions)
    );

    if (idx === -1) {
      categoryMenu.push(selectOptions);
      this.setDailyMenu1(selectOptions.Id, selectOptions.YemektipiID);
    } else {
      categoryMenu.splice(idx, 1);
      this.clearDailyMenu1(selectOptions.Id, selectOptions.YemektipiID);
    }
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getMenuForCategory(category: string): meal[] {
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
        return this.icecekMenu; // DİKKAT: HTML’de de 'Icecekler' gönderiyoruz
      case 'Meyve':
        return this.meyveMenu;
      case 'Kahvaltilik':
        return this.kahvaltilikMenu;
      default:
        return [];
    }
  }

  // ---- API ----
  onSubmit(data: any) {
    console.log('SUBMIT', data);
  }

  setDailyMenu1(yemek: any, yemektipi: any) {
    this.tanimlamalar
      .setDailyMenu(
        this.dateConverter(this.selectDateForMenu),
        yemek,
        yemektipi,
        this.selectedGroupId,
        this.selectedMenu
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => {
          console.log("setDailyMenu':", resp);
          this.ref.detectChanges();
        },
        error: (err) => console.error('setDailyMenu error:', err),
      });
  }

  clearDailyMenu1(yemek: any, yemektipi: any) {
    this.tanimlamalar
      .clearDailyMenu(
        this.dateConverter(this.selectDateForMenu),
        yemek,
        yemektipi,
        this.selectedGroupId,
        this.selectedMenu
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp: any) => {
          console.log("clearDailyMenu':", resp?.[0]?.x);
          this.ref.detectChanges();
        },
        error: (err) => console.error('clearDailyMenu error:', err),
      });
  }

  getDailyMenu1(date: Date) {
    this.bayrak = false;

    this.tanimlamalar
      .getDailyMenu(
        this.dateConverter(date),
        this.selectedGroupId,
        this.selectedMenu
      )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {
          this.bayrak = true;
          this.ref.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          this._getDailyMenu = Array.isArray(data) ? data : [];
          this.menuAyrimi(this._getDailyMenu);
          console.log(
            '[getDailyMenu1] OK, item count:',
            this._getDailyMenu.length
          );
        },
        error: (err) => {
          console.error('[getDailyMenu1] error:', err);
        },
      });
  }

  getMeals() {
    this.tanimlamalar
      .getMeal()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.meals = response?.[0]?.x ?? [];
          this.sperateLists(this.meals);
          this.ref.detectChanges();
        },
        error: (err) => console.error('getMeal error:', err),
      });
  }

  sperateLists(list: any[]) {
    // <= yerine < (off-by-one fix)
    for (let i = 0; i < (list?.length ?? 0); i++) {
      const it = list[i];
      switch (it?.YemektipiID) {
        case 1:
          this.corbaOptions.push(it);
          break;
        case 2:
          this.anayemekOptions.push(it);
          break;
        case 3:
          this.salataOptions.push(it);
          break;
        case 4:
          this.tatliOptions.push(it);
          break;
        case 5:
          this.mezeOptions.push(it);
          break;
        case 6:
          this.arasicakOptions.push(it);
          break;
        case 7:
          this.arasogukOptions.push(it);
          break;
        case 8:
          this.icecekOptions.push(it);
          break;
        case 9:
          this.meyveOptions.push(it);
          break;
        case 10:
          this.kahvaltilikOptions.push(it);
          break;
        default:
          break;
      }
    }
  }

  menuAyrimi(list: any[]) {
    for (let i = 0; i < (list?.length ?? 0); i++) {
      const it = list[i];
      switch (it?.YemektipiID) {
        case 1:
          this.corbaMenu.push(it);
          break;
        case 2:
          this.anayemekMenu.push(it);
          break;
        case 3:
          this.salataMenu.push(it);
          break;
        case 4:
          this.tatliMenu.push(it);
          break;
        case 5:
          this.mezeMenu.push(it);
          break;
        case 6:
          this.arasicakMenu.push(it);
          break;
        case 7:
          this.arasogukMenu.push(it);
          break;
        case 8:
          this.icecekMenu.push(it);
          break;
        case 9:
          this.meyveMenu.push(it);
          break;
        case 10:
          this.kahvaltilikMenu.push(it);
          break;
        default:
          break;
      }
    }
  }

  clearSelectList() {
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

  getDeviceGroups() {
    const sp = [{ mkodu: 'yek190', amac: '3', id: '0' }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response?.[0]?.x ?? [];
        const message = response?.[0]?.z;

        if (message?.islemsonuc === -1) return;

        const normalized = data.map((r: any) => ({
          id: Number(r.id),
          ad: String(r.ad),
          amac: Number(r.amac),
        }));

        const allOption = { id: 0, ad: 'Tüm Terminaller', amac: 3 };

        const withoutAll = normalized.filter((x: any) => x.id !== 0);
        this.deviceGroups = [allOption, ...withoutAll];

        this.selectedGroupId = 0;
      });
  }
  onGroupChange(event: any) {
    console.log('Seçilen id:', event.value); // sadece id gelir
    const selectedObj = this.deviceGroups.find((x) => x.id === event.value);
    console.log('Seçilen obje:', selectedObj);
  }

  getFoodPiece() {
    var sp: any[] = [
      {
        mkodu: 'yek410',
      },
    ];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        this.piece = Number(data[0].sayi);
        this.menuItems = Array.from({ length: this.piece }, (_, i) => i + 1);
        console.log('Terminal Grubu Eklendi : ', data);
      });
  }
  resetMealSelections(detect = true) {
    const keys = [
      'selectedCorba',
      'selectedAnaYemek',
      'selectedSalata',
      'selectedTatli',
      'selectedMeze',
      'selectedAraSicak',
      'selectedAraSoguk',
      'selectedIcecek',
      'selectedMeyve',
      'selectedKahvaltilik',
    ] as const;

    keys.forEach((k) => ((this as any)[k] = null));
    if (detect) this.ref.detectChanges();
  }
  resetMealOptions(detect = true) {
    const optionKeys = [
      'corbaOptions',
      'anayemekOptions',
      'salataOptions',
      'tatliOptions',
      'mezeOptions',
      'arasicakOptions',
      'arasogukOptions',
      'icecekOptions',
      'meyveOptions',
      'kahvaltilikOptions',
    ] as const;

    optionKeys.forEach((k) => ((this as any)[k] = []));
    if (detect) this.ref.detectChanges();
  }
  clearAnaYemekUI(detect = true) {
    this.selectedAnaYemek = null;
    this.anayemekOptions = []; 
    this.anayemekMenu = [];
    if (detect) this.ref.detectChanges();
  }

  private readonly selectionKeys = [
    'selectedCorba',
    'selectedAnaYemek',
    'selectedSalata',
    'selectedTatli',
    'selectedMeze',
    'selectedAraSicak',
    'selectedAraSoguk',
    'selectedIcecek',
    'selectedMeyve',
    'selectedKahvaltilik',
  ] as const;

  private readonly optionKeys = [
    'corbaOptions',
    'anayemekOptions',
    'salataOptions',
    'tatliOptions',
    'mezeOptions',
    'arasicakOptions',
    'arasogukOptions',
    'icecekOptions',
    'meyveOptions',
    'kahvaltilikOptions',
  ] as const;

  // Eğer rozetleri tuttuğun diziler varsa (ör: anayemekMenu) buraya ekle
  private readonly menuKeys = [
    'corbaMenu',
    'anayemekMenu',
    'salataMenu',
    'tatliMenu',
    'mezeMenu',
    'arasicakMenu',
    'arasogukMenu',
    'icecekMenu',
    'meyveMenu',
    'kahvaltilikMenu',
  ] as const;
  resetAllMeals(
    opts = { selections: true, options: true, menus: true, detect: true }
  ) {
    const { selections, options, menus, detect } = opts;

    if (selections)
      this.selectionKeys.forEach((k) => ((this as any)[k] = null));
    if (options) this.optionKeys.forEach((k) => ((this as any)[k] = []));
    if (menus)
      this.menuKeys.forEach((k) => {
        if (k in this) (this as any)[k] = [];
      });

    if (detect) this.ref.detectChanges();
  }

  onMenuClick(id: number) {
    this.selectedMenu = id;
    this.resetAllMeals();
    this.getMeals();
    this.getDailyMenu1(this.selectDateForMenu);
    this.dateConverter(this.selectDateForMenu);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
