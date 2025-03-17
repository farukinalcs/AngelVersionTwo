import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPlanningComponent } from './shift-planning.component';

describe('ShiftPlanningComponent', () => {
  let component: ShiftPlanningComponent;
  let fixture: ComponentFixture<ShiftPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftPlanningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
