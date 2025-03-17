import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitTypesComponent } from './permit-types.component';

describe('PermitTypesComponent', () => {
  let component: PermitTypesComponent;
  let fixture: ComponentFixture<PermitTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermitTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermitTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
