import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuPerformanceComponent } from './sidebar-menu-performance.component';

describe('SidebarMenuPerformanceComponent', () => {
  let component: SidebarMenuPerformanceComponent;
  let fixture: ComponentFixture<SidebarMenuPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMenuPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarMenuPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
