import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTourCalendarComponent } from './security-tour-calendar.component';

describe('SecurityTourCalendarComponent', () => {
  let component: SecurityTourCalendarComponent;
  let fixture: ComponentFixture<SecurityTourCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityTourCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityTourCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
