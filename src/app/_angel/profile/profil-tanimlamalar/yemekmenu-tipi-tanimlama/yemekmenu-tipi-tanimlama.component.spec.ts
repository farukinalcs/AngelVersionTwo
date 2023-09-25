import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YemekmenuTipiTanimlamaComponent } from './yemekmenu-tipi-tanimlama.component';

describe('YemekmenuTipiTanimlamaComponent', () => {
  let component: YemekmenuTipiTanimlamaComponent;
  let fixture: ComponentFixture<YemekmenuTipiTanimlamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YemekmenuTipiTanimlamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YemekmenuTipiTanimlamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
