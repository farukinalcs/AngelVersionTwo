import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftGroupsComponent } from './shift-groups.component';

describe('ShiftGroupsComponent', () => {
  let component: ShiftGroupsComponent;
  let fixture: ComponentFixture<ShiftGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
