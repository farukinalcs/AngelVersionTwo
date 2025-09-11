import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSettingsComponent } from './food-settings.component';

describe('FoodSettingsComponent', () => {
  let component: FoodSettingsComponent;
  let fixture: ComponentFixture<FoodSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
