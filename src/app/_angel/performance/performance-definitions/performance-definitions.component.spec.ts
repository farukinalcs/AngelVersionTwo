import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDefinitionsComponent } from './performance-definitions.component';

describe('PerformanceDefinitionsComponent', () => {
  let component: PerformanceDefinitionsComponent;
  let fixture: ComponentFixture<PerformanceDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDefinitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
