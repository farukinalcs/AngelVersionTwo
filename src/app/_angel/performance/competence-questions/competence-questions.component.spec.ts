import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenceQuestionsComponent } from './competence-questions.component';

describe('CompetenceQuestionsComponent', () => {
  let component: CompetenceQuestionsComponent;
  let fixture: ComponentFixture<CompetenceQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenceQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenceQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
