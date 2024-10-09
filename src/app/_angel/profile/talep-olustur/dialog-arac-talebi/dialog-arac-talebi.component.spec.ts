import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAracTalebiComponent } from './dialog-arac-talebi.component';

describe('DialogAracTalebiComponent', () => {
  let component: DialogAracTalebiComponent;
  let fixture: ComponentFixture<DialogAracTalebiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAracTalebiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAracTalebiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
