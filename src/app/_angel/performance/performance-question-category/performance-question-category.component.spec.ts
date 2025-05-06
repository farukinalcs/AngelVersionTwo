import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceQuestionCategoryComponent } from './performance-question-category.component';

describe('PerformanceQuestionCategoryComponent', () => {
  let component: PerformanceQuestionCategoryComponent;
  let fixture: ComponentFixture<PerformanceQuestionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceQuestionCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceQuestionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
