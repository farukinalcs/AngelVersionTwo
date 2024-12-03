import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGuardsComponent } from './security-guards.component';

describe('SecurityGuardsComponent', () => {
  let component: SecurityGuardsComponent;
  let fixture: ComponentFixture<SecurityGuardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityGuardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
