import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMealMenuComponent } from './all-meal-menu.component';

describe('AllMealMenuComponent', () => {
  let component: AllMealMenuComponent;
  let fixture: ComponentFixture<AllMealMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMealMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMealMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
