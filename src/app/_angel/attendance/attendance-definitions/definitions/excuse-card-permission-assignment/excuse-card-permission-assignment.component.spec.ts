import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcuseCardPermissionAssignmentComponent } from './excuse-card-permission-assignment.component';

describe('ExcuseCardPermissionAssignmentComponent', () => {
  let component: ExcuseCardPermissionAssignmentComponent;
  let fixture: ComponentFixture<ExcuseCardPermissionAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcuseCardPermissionAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcuseCardPermissionAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
