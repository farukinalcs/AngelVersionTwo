import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRegistryListComponent } from './attendance-registry-list.component';

describe('AttendanceRegistryListComponent', () => {
  let component: AttendanceRegistryListComponent;
  let fixture: ComponentFixture<AttendanceRegistryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceRegistryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceRegistryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
