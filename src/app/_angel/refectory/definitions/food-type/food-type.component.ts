import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FoodTypeStore, MealType, NewMealPayload } from './food-type.store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './food-type.component.html',
  styleUrls: ['./food-type.component.scss'],
})
export class FoodTypeComponent implements OnInit, OnDestroy {
  // Store
  readonly store = inject(FoodTypeStore);
  readonly toastrService = inject(ToastrService);
  @Input() selectedItem: any | null = null;
  @Output() closeAnimationEvent = new EventEmitter<void>();

  demandParam = signal<string>('');
  fileParam = signal<string>('');

  mealType = this.store.mealTypes;

  ngOnInit(): void {
    this.store.loadMealTypes();
  }

  onSubmit(formValue: any) {
    const payload: NewMealPayload = {
      yemektipi: formValue?.yemektipi ? Number(formValue.yemektipi) : null,
      yemekadi: formValue?.yemekadi ?? '',
    };

    this.store.setMeal(payload).subscribe({
      next: (response: any) => {
        const data = response?.[0]?.x;
        console.log('setMeal ok:', data, response);
        this.toastrService.success('Başarılı');
        this.store.loadMealTypes();
      },
      error: (err) => console.error('setMeal error:', err),
    });
  }

  onCloseButtonClick() {
    this.fileParam.set('');
    this.demandParam.set('');
    this.closeAnimationEvent.emit();
  }

  trackById = (_: number, it: MealType) => it?.Id;

ngOnDestroy(): void {}
}
