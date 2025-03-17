import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeCausesComponent } from './overtime-causes.component';

describe('OvertimeCausesComponent', () => {
  let component: OvertimeCausesComponent;
  let fixture: ComponentFixture<OvertimeCausesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeCausesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeCausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
