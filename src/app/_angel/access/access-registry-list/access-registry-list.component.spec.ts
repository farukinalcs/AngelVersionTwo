import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRegistryListComponent } from './access-registry-list.component';

describe('AccessRegistryListComponent', () => {
  let component: AccessRegistryListComponent;
  let fixture: ComponentFixture<AccessRegistryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessRegistryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessRegistryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
