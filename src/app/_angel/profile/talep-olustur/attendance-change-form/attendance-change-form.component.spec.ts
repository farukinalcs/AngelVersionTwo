import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceChangeFormComponent } from './attendance-change-form.component';

describe('AttendanceChangeFormComponent', () => {
  let component: AttendanceChangeFormComponent;
  let fixture: ComponentFixture<AttendanceChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceChangeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceChangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
