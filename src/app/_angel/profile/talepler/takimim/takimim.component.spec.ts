import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakimimComponent } from './takimim.component';

describe('TakimimComponent', () => {
  let component: TakimimComponent;
  let fixture: ComponentFixture<TakimimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakimimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakimimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
