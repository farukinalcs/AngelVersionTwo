import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInfoComponent } from './custom-info.component';

describe('CustomInfoComponent', () => {
  let component: CustomInfoComponent;
  let fixture: ComponentFixture<CustomInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
