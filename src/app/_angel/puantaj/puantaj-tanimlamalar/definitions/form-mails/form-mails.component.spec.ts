import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMailsComponent } from './form-mails.component';

describe('FormMailsComponent', () => {
  let component: FormMailsComponent;
  let fixture: ComponentFixture<FormMailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
