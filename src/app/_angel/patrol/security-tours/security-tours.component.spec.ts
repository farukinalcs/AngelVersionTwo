import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityToursComponent } from './security-tours.component';

describe('SecurityToursComponent', () => {
  let component: SecurityToursComponent;
  let fixture: ComponentFixture<SecurityToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityToursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
