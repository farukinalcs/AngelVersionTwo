import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AllMealMenuComponent } from './all-meal-menu/all-meal-menu.component';
import { TanimlamalarService } from 'src/app/_angel/profile/profile-definitions/tanimlamalar.service';

interface MealItem {
  Id: number;
  Aciklama: string;
  Yemektipi: string;    // ör: "Çorba"
  YemektipiID: number;  // ör: 1
  Menu: number;         // 1..6
}

interface MealGroup {
  key: string;          // "1|Çorba" gibi
  id: number | null;    // YemektipiID
  label: string;        // "Çorba"
  items: MealItem[];
}

interface MealSlide {
  key: number;          // Menu
  label: string;        // "Menü 1"
  items: MealItem[];    // slayttaki tüm öğeler
  groups: MealGroup[];  // Yemektipi grupları
}

@Component({
  selector: 'app-meal-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule, DialogModule, DatePipe, AllMealMenuComponent],
  templateUrl: './meal-menu.component.html',
  styleUrls: ['./meal-menu.component.scss'],
})
export class MealMenuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  currentItemIndex = 0;
  displayAllFoodMenu = false;

  _getDailyMenu: MealItem[] = [];
  slides: MealSlide[] = [];
  _currentDate!: string;

  // Menü etiketleri
  private menuLabelMap: Record<number, string> = {
    1: 'Menü 1',
    2: 'Menü 2',
    3: 'Menü 3',
    4: 'Menü 4',
    5: 'Menü 5',
    6: 'Menü 6',
  };

  constructor(
    private ref: ChangeDetectorRef,
    public tanimlamalar: TanimlamalarService
  ) {}

  ngOnInit(): void {
    this.getDailyMenu();
  }

  // --- TrackBy'lar ---
  trackById = (_: number, item: MealItem) => item?.Id ?? _;
  trackByGroup = (_: number, g: MealGroup) => g.key;
  trackBySlide = (_: number, s: MealSlide) => s.key;

  // --- Yemektipi'ne göre alt gruplar ---
  private groupByYemektipi(items: MealItem[]): MealGroup[] {
    const map = new Map<string, MealGroup>();
    for (const it of items ?? []) {
      const id = it?.YemektipiID ?? null;
      const label = it?.Yemektipi ?? `Tip ${id ?? ''}`.trim();
      const key = `${id}|${label}`;
      if (!map.has(key)) map.set(key, { key, id, label, items: [] });
      map.get(key)!.items.push(it);
    }
    // ID varsa ID'ye göre, yoksa label'a göre sırala
    return Array.from(map.values()).sort((a, b) => {
      if (a.id == null && b.id == null) return a.label.localeCompare(b.label);
      if (a.id == null) return 1;
      if (b.id == null) return -1;
      return a.id - b.id || a.label.localeCompare(b.label);
    });
  }

  // --- Menü'ye göre slaytlar (her slaytta Yemektipi grupları var) ---
  buildSlides(data: MealItem[]) {
    const menuMap = new Map<number, MealItem[]>();
    for (const it of data ?? []) {
      const key = Number(it.Menu) || 0;
      if (!menuMap.has(key)) menuMap.set(key, []);
      menuMap.get(key)!.push(it);
    }

    this.slides = Array
      .from(menuMap, ([key, items]) => {
        const label = this.menuLabelMap[key] ?? `Menü ${key}`;
        return {
          key,
          label,
          items,
          groups: this.groupByYemektipi(items),
        } as MealSlide;
      })
      .sort((a, b) => a.key - b.key);
  }

  showAllFoodMenu() { this.displayAllFoodMenu = true; }
  closeMenuDialog() { this.displayAllFoodMenu = false; }

  getDailyMenu() {
    this.tanimlamalar
      .getDailyMenu(this.dateConverter(), '0', '0')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this._getDailyMenu = response?.[0]?.x ?? [];
          this.buildSlides(this._getDailyMenu);
          this.currentItemIndex = 0; // ilk slayttan başla
          this.ref.detectChanges();
        },
        error: (err) => {
          console.error('getDailyMenu error:', err);
          this.ref.detectChanges();
        },
      });
  }

  dateConverter(): string {
    const d = new Date();
    const yil = d.getFullYear();
    const ay = String(d.getMonth() + 1).padStart(2, '0');
    const gun = String(d.getDate()).padStart(2, '0');
    this._currentDate = `${yil}-${ay}-${gun}`;
    return this._currentDate;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
