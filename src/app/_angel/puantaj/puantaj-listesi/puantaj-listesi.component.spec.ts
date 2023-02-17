import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuantajListesiComponent } from './puantaj-listesi.component';

describe('PuantajListesiComponent', () => {
  let component: PuantajListesiComponent;
  let fixture: ComponentFixture<PuantajListesiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuantajListesiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuantajListesiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
