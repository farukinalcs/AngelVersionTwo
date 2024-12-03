import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedPanelsComponent } from './led-panels.component';

describe('LedPanelsComponent', () => {
  let component: LedPanelsComponent;
  let fixture: ComponentFixture<LedPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LedPanelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LedPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
