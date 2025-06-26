import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyInHouseComponent } from './survey-in-house.component';

describe('SurveyInHouseComponent', () => {
  let component: SurveyInHouseComponent;
  let fixture: ComponentFixture<SurveyInHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyInHouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyInHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
