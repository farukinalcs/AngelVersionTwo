import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YemekMenuComponent } from './yemek-menu.component';

describe('YemekMenuComponent', () => {
  let component: YemekMenuComponent;
  let fixture: ComponentFixture<YemekMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YemekMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YemekMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
