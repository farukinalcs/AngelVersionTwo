import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuvenlikdashboardComponent } from './guvenlikdashboard.component';

describe('GuvenlikdashboardComponent', () => {
  let component: GuvenlikdashboardComponent;
  let fixture: ComponentFixture<GuvenlikdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuvenlikdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuvenlikdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
