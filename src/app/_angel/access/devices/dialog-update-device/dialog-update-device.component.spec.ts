import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateDeviceComponent } from './dialog-update-device.component';

describe('DialogUpdateDeviceComponent', () => {
  let component: DialogUpdateDeviceComponent;
  let fixture: ComponentFixture<DialogUpdateDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUpdateDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUpdateDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
