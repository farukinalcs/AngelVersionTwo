import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityStationsComponent } from './security-stations.component';

describe('SecurityStationsComponent', () => {
  let component: SecurityStationsComponent;
  let fixture: ComponentFixture<SecurityStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityStationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
