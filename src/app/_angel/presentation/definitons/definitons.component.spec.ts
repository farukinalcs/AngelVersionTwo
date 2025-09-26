import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitonsComponent } from './definitons.component';

describe('DefinitonsComponent', () => {
  let component: DefinitonsComponent;
  let fixture: ComponentFixture<DefinitonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
