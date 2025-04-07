import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolreportComponent } from './patrolreport.component';

describe('PatrolreportComponent', () => {
  let component: PatrolreportComponent;
  let fixture: ComponentFixture<PatrolreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatrolreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatrolreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
