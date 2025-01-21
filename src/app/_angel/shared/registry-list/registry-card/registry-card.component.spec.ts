import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryCardComponent } from './registry-card.component';

describe('RegistryCardComponent', () => {
  let component: RegistryCardComponent;
  let fixture: ComponentFixture<RegistryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
