import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BultenComponent } from './bulten.component';

describe('BultenComponent', () => {
  let component: BultenComponent;
  let fixture: ComponentFixture<BultenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BultenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BultenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
