import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayTypesComponent } from './holiday-types.component';

describe('HolidayTypesComponent', () => {
  let component: HolidayTypesComponent;
  let fixture: ComponentFixture<HolidayTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolidayTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
