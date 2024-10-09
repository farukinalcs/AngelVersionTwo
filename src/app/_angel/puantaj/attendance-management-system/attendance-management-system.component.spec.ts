import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceManagementSystemComponent } from './attendance-management-system.component';

describe('AttendanceManagementSystemComponent', () => {
  let component: AttendanceManagementSystemComponent;
  let fixture: ComponentFixture<AttendanceManagementSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceManagementSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
