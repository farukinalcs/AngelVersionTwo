import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempCardComponent } from './temp-card.component';

describe('TempCardComponent', () => {
  let component: TempCardComponent;
  let fixture: ComponentFixture<TempCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
