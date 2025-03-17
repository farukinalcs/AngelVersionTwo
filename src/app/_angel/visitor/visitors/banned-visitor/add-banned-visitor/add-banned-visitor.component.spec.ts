import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBannedVisitorComponent } from './add-banned-visitor.component';

describe('AddBannedVisitorComponent', () => {
  let component: AddBannedVisitorComponent;
  let fixture: ComponentFixture<AddBannedVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBannedVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBannedVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
