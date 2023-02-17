import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobillokasyonComponent } from './mobillokasyon.component';

describe('MobillokasyonComponent', () => {
  let component: MobillokasyonComponent;
  let fixture: ComponentFixture<MobillokasyonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobillokasyonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobillokasyonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
