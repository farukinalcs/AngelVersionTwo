import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePivotListComponent } from './attendance-pivot-list.component';

describe('AttendancePivotListComponent', () => {
  let component: AttendancePivotListComponent;
  let fixture: ComponentFixture<AttendancePivotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancePivotListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePivotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
