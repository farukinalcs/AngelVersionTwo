import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDurationsComponent } from './missing-durations.component';

describe('MissingDurationsComponent', () => {
  let component: MissingDurationsComponent;
  let fixture: ComponentFixture<MissingDurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingDurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingDurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
