import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuPatrolComponent } from './sidebar-menu-patrol.component';

describe('SidebarMenuPatrolComponent', () => {
  let component: SidebarMenuPatrolComponent;
  let fixture: ComponentFixture<SidebarMenuPatrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMenuPatrolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarMenuPatrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
