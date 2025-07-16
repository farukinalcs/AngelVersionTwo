import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAndmapComponent } from './device-andmap.component';

describe('DeviceAndmapComponent', () => {
  let component: DeviceAndmapComponent;
  let fixture: ComponentFixture<DeviceAndmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceAndmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceAndmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
