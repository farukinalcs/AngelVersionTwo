import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardDetailComponent } from './dashboard-card-detail.component';

describe('DashboardCardDetailComponent', () => {
  let component: DashboardCardDetailComponent;
  let fixture: ComponentFixture<DashboardCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCardDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
