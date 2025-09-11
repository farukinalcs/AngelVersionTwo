import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { TanimlamalarService } from 'src/app/_angel/profile/profile-definitions/tanimlamalar.service';

export type MealType = { Id: number; Ad: string };
export type NewMealPayload = { yemektipi: number | null; yemekadi: string };

@Injectable({ providedIn: 'root' })
export class FoodTypeStore {
  private api = inject(TanimlamalarService);

  readonly mealTypes = signal<MealType[]>([]);
  readonly loading   = signal<boolean>(false);
  readonly error     = signal<string | null>(null);
  loadMealTypes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getMealType().pipe(take(1)).subscribe({
      next: (resp: any) => {
        const list = resp?.[0]?.x ?? [];
        const arr: MealType[] = Array.isArray(list) ? list.filter(Boolean) : [];
        this.mealTypes.set(arr);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Bilinmeyen hata');
        this.mealTypes.set([]);
        this.loading.set(false);
      }
    });
  }

  setMeal(payload: NewMealPayload) {
    return this.api.setMeal(payload).pipe(take(1));
  }

  reset(): void {
    this.mealTypes.set([]);
    this.loading.set(false);
    this.error.set(null);
  }
}
