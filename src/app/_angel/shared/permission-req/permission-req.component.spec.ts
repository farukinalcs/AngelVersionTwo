import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionReqComponent } from './permission-req.component';

describe('PermissionReqComponent', () => {
  let component: PermissionReqComponent;
  let fixture: ComponentFixture<PermissionReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionReqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
