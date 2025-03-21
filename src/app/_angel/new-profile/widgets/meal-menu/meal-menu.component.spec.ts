import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealMenuComponent } from './meal-menu.component';

describe('MealMenuComponent', () => {
  let component: MealMenuComponent;
  let fixture: ComponentFixture<MealMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
