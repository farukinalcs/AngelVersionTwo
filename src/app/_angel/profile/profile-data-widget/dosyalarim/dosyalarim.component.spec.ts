import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosyalarimComponent } from './dosyalarim.component';

describe('DosyalarimComponent', () => {
  let component: DosyalarimComponent;
  let fixture: ComponentFixture<DosyalarimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosyalarimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosyalarimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
