import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTempCardComponent } from './add-temp-card.component';

describe('AddTempCardComponent', () => {
  let component: AddTempCardComponent;
  let fixture: ComponentFixture<AddTempCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTempCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTempCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
