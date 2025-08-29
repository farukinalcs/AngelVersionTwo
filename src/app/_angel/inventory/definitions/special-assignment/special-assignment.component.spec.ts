import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialAssignmentComponent } from './special-assignment.component';

describe('SpecialAssignmentComponent', () => {
  let component: SpecialAssignmentComponent;
  let fixture: ComponentFixture<SpecialAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
