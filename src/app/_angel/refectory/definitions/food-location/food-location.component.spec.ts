import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodLocationComponent } from './food-location.component';

describe('FoodLocationComponent', () => {
  let component: FoodLocationComponent;
  let fixture: ComponentFixture<FoodLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
