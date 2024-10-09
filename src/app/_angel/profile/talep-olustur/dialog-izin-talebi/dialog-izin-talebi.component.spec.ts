import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIzinTalebiComponent } from './dialog-izin-talebi.component';

describe('DialogIzinTalebiComponent', () => {
  let component: DialogIzinTalebiComponent;
  let fixture: ComponentFixture<DialogIzinTalebiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIzinTalebiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogIzinTalebiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
