import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationCategoryComponent } from './education-category.component';

describe('EducationCategoryComponent', () => {
  let component: EducationCategoryComponent;
  let fixture: ComponentFixture<EducationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
