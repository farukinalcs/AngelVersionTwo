import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryFilterComponent } from './registry-filter.component';

describe('RegistryFilterComponent', () => {
  let component: RegistryFilterComponent;
  let fixture: ComponentFixture<RegistryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistryFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
