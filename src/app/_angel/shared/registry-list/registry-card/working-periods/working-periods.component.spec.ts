import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPeriodsComponent } from './working-periods.component';

describe('WorkingPeriodsComponent', () => {
  let component: WorkingPeriodsComponent;
  let fixture: ComponentFixture<WorkingPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingPeriodsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkingPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
