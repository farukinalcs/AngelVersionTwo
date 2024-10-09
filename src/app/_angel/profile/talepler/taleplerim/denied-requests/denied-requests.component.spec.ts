import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedRequestsComponent } from './denied-requests.component';

describe('DeniedRequestsComponent', () => {
  let component: DeniedRequestsComponent;
  let fixture: ComponentFixture<DeniedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeniedRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
