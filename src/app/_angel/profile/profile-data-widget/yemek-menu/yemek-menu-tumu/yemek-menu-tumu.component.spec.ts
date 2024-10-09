import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YemekMenuTumuComponent } from './yemek-menu-tumu.component';

describe('YemekMenuTumuComponent', () => {
  let component: YemekMenuTumuComponent;
  let fixture: ComponentFixture<YemekMenuTumuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YemekMenuTumuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YemekMenuTumuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
