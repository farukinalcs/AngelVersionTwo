import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorEmployeesComponent } from './senior-employees.component';

describe('SeniorEmployeesComponent', () => {
  let component: SeniorEmployeesComponent;
  let fixture: ComponentFixture<SeniorEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
