import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuantajRaporlarComponent } from './puantaj-raporlar.component';

describe('PuantajRaporlarComponent', () => {
  let component: PuantajRaporlarComponent;
  let fixture: ComponentFixture<PuantajRaporlarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuantajRaporlarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuantajRaporlarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
