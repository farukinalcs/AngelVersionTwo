import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCodesComponent } from './event-codes.component';

describe('EventCodesComponent', () => {
  let component: EventCodesComponent;
  let fixture: ComponentFixture<EventCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventCodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
