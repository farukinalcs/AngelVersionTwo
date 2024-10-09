import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationColumnFilterComponent } from './organization-column-filter.component';

describe('OrganizationColumnFilterComponent', () => {
  let component: OrganizationColumnFilterComponent;
  let fixture: ComponentFixture<OrganizationColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationColumnFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationColumnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
