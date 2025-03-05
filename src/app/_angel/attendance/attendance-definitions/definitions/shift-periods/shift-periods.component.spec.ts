import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPeriodsComponent } from './shift-periods.component';

describe('ShiftPeriodsComponent', () => {
  let component: ShiftPeriodsComponent;
  let fixture: ComponentFixture<ShiftPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftPeriodsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
