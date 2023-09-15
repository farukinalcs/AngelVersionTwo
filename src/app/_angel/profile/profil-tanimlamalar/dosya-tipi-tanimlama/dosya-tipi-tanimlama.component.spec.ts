import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosyaTipiTanimlamaComponent } from './dosya-tipi-tanimlama.component';

describe('DosyaTipiTanimlamaComponent', () => {
  let component: DosyaTipiTanimlamaComponent;
  let fixture: ComponentFixture<DosyaTipiTanimlamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosyaTipiTanimlamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosyaTipiTanimlamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
