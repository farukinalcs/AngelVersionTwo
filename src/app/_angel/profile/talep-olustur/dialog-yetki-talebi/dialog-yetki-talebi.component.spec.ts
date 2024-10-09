import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogYetkiTalebiComponent } from './dialog-yetki-talebi.component';

describe('DialogYetkiTalebiComponent', () => {
  let component: DialogYetkiTalebiComponent;
  let fixture: ComponentFixture<DialogYetkiTalebiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogYetkiTalebiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogYetkiTalebiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
