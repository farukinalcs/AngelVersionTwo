import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessChangeComponent } from './process-change.component';

describe('ProcessChangeComponent', () => {
  let component: ProcessChangeComponent;
  let fixture: ComponentFixture<ProcessChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
