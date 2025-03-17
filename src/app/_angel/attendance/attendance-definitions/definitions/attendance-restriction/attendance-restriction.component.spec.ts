import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRestrictionComponent } from './attendance-restriction.component';

describe('AttendanceRestrictionComponent', () => {
  let component: AttendanceRestrictionComponent;
  let fixture: ComponentFixture<AttendanceRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceRestrictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
