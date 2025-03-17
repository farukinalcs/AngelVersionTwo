import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedVisitorComponent } from './banned-visitor.component';

describe('BannedVisitorComponent', () => {
  let component: BannedVisitorComponent;
  let fixture: ComponentFixture<BannedVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannedVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
