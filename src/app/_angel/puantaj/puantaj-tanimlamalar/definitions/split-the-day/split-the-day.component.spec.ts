import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitTheDayComponent } from './split-the-day.component';

describe('SplitTheDayComponent', () => {
  let component: SplitTheDayComponent;
  let fixture: ComponentFixture<SplitTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SplitTheDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SplitTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
