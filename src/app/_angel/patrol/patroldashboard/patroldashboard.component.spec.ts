import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatroldashboardComponent } from './patroldashboard.component';

describe('PatroldashboardComponent', () => {
  let component: PatroldashboardComponent;
  let fixture: ComponentFixture<PatroldashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatroldashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatroldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
