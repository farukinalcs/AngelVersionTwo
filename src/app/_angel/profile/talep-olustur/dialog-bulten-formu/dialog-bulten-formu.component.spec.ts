import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBultenFormuComponent } from './dialog-bulten-formu.component';

describe('DialogBultenFormuComponent', () => {
  let component: DialogBultenFormuComponent;
  let fixture: ComponentFixture<DialogBultenFormuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBultenFormuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBultenFormuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
