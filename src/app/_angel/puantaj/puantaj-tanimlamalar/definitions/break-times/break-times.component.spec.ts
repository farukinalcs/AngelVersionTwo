import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakTimesComponent } from './break-times.component';

describe('BreakTimesComponent', () => {
  let component: BreakTimesComponent;
  let fixture: ComponentFixture<BreakTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreakTimesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
