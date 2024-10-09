import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDuyuruFormuComponent } from './dialog-duyuru-formu.component';

describe('DialogDuyuruFormuComponent', () => {
  let component: DialogDuyuruFormuComponent;
  let fixture: ComponentFixture<DialogDuyuruFormuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDuyuruFormuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDuyuruFormuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
