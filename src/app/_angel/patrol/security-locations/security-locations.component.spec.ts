import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLocationsComponent } from './security-locations.component';

describe('SecurityLocationsComponent', () => {
  let component: SecurityLocationsComponent;
  let fixture: ComponentFixture<SecurityLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityLocationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
