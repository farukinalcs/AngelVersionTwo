import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftInfoComponent } from './shift-info.component';

describe('ShiftInfoComponent', () => {
  let component: ShiftInfoComponent;
  let fixture: ComponentFixture<ShiftInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
