import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAvansTalebiComponent } from './dialog-avans-talebi.component';

describe('DialogAvansTalebiComponent', () => {
  let component: DialogAvansTalebiComponent;
  let fixture: ComponentFixture<DialogAvansTalebiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAvansTalebiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAvansTalebiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
