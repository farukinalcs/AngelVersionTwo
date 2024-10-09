import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnerilerComponent } from './oneriler.component';

describe('OnerilerComponent', () => {
  let component: OnerilerComponent;
  let fixture: ComponentFixture<OnerilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnerilerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnerilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
