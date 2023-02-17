import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuantajdashboardComponent } from './puantajdashboard.component';

describe('PuantajdashboardComponent', () => {
  let component: PuantajdashboardComponent;
  let fixture: ComponentFixture<PuantajdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuantajdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuantajdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
