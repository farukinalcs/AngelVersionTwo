import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YemekMenuTanimlamaComponent } from './yemek-menu-tanimlama.component';

describe('YemekMenuTanimlamaComponent', () => {
  let component: YemekMenuTanimlamaComponent;
  let fixture: ComponentFixture<YemekMenuTanimlamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YemekMenuTanimlamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YemekMenuTanimlamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
