import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnketComponent } from './anket.component';

describe('AnketComponent', () => {
  let component: AnketComponent;
  let fixture: ComponentFixture<AnketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
