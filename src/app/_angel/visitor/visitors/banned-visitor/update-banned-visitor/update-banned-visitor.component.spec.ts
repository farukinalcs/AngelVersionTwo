import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBannedVisitorComponent } from './update-banned-visitor.component';

describe('UpdateBannedVisitorComponent', () => {
  let component: UpdateBannedVisitorComponent;
  let fixture: ComponentFixture<UpdateBannedVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBannedVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBannedVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
