import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassagesComponent } from './passages.component';

describe('PassagesComponent', () => {
  let component: PassagesComponent;
  let fixture: ComponentFixture<PassagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
