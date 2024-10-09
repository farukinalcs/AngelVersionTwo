import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorRequestsComponent } from './visitor-requests.component';

describe('VisitorRequestsComponent', () => {
  let component: VisitorRequestsComponent;
  let fixture: ComponentFixture<VisitorRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
