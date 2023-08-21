import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksikSurelerimComponent } from './eksik-surelerim.component';

describe('EksikSurelerimComponent', () => {
  let component: EksikSurelerimComponent;
  let fixture: ComponentFixture<EksikSurelerimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksikSurelerimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EksikSurelerimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
