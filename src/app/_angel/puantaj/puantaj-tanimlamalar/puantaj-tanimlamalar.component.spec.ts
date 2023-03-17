import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuantajTanimlamalarComponent } from './puantaj-tanimlamalar.component';

describe('PuantajTanimlamalarComponent', () => {
  let component: PuantajTanimlamalarComponent;
  let fixture: ComponentFixture<PuantajTanimlamalarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuantajTanimlamalarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuantajTanimlamalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
