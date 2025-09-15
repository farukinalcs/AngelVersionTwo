import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutComponent } from './in-out.component';

describe('InOutComponent', () => {
  let component: InOutComponent;
  let fixture: ComponentFixture<InOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
