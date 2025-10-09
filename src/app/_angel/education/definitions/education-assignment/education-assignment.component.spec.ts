import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationAssignmentComponent } from './education-assignment.component';

describe('EducationAssignmentComponent', () => {
  let component: EducationAssignmentComponent;
  let fixture: ComponentFixture<EducationAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
