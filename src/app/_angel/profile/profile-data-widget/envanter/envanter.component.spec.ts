import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvanterComponent } from './envanter.component';

describe('EnvanterComponent', () => {
  let component: EnvanterComponent;
  let fixture: ComponentFixture<EnvanterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvanterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvanterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
