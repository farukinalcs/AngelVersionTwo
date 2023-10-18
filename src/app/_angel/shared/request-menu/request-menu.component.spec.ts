import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMenuComponent } from './request-menu.component';

describe('RequestMenuComponent', () => {
  let component: RequestMenuComponent;
  let fixture: ComponentFixture<RequestMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
