import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingRequestsComponent } from './ongoing-requests.component';

describe('OngoingRequestsComponent', () => {
  let component: OngoingRequestsComponent;
  let fixture: ComponentFixture<OngoingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
