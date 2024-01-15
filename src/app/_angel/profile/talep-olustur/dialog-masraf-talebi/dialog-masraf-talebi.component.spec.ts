import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMasrafTalebiComponent } from './dialog-masraf-talebi.component';

describe('DialogMasrafTalebiComponent', () => {
  let component: DialogMasrafTalebiComponent;
  let fixture: ComponentFixture<DialogMasrafTalebiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMasrafTalebiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMasrafTalebiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
