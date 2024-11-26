import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDefinitionsComponent } from './organization-definitions.component';

describe('OrganizationDefinitionsComponent', () => {
  let component: OrganizationDefinitionsComponent;
  let fixture: ComponentFixture<OrganizationDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationDefinitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
