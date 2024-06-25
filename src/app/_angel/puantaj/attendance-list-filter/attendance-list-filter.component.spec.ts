import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceListFilterComponent } from './attendance-list-filter.component';

describe('AttendanceListFilterComponent', () => {
  let component: AttendanceListFilterComponent;
  let fixture: ComponentFixture<AttendanceListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceListFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
