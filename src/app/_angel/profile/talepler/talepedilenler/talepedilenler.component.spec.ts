import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalepedilenlerComponent } from './talepedilenler.component';

describe('TalepedilenlerComponent', () => {
  let component: TalepedilenlerComponent;
  let fixture: ComponentFixture<TalepedilenlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalepedilenlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalepedilenlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
