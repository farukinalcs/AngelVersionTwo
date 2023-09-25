import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YemekTipiTanimlamaComponent } from './yemek-tipi-tanimlama.component';

describe('YemekTipiTanimlamaComponent', () => {
  let component: YemekTipiTanimlamaComponent;
  let fixture: ComponentFixture<YemekTipiTanimlamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YemekTipiTanimlamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YemekTipiTanimlamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
