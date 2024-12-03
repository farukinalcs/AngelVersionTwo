import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityRolesComponent } from './authority-roles.component';

describe('AuthorityRolesComponent', () => {
  let component: AuthorityRolesComponent;
  let fixture: ComponentFixture<AuthorityRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorityRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorityRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
