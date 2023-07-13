import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogumGunuComponent } from './dogum-gunu.component';

describe('DogumGunuComponent', () => {
  let component: DogumGunuComponent;
  let fixture: ComponentFixture<DogumGunuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogumGunuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogumGunuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
