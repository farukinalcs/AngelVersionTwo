import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdksComponent } from './pdks.component';

describe('PdksComponent', () => {
  let component: PdksComponent;
  let fixture: ComponentFixture<PdksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
