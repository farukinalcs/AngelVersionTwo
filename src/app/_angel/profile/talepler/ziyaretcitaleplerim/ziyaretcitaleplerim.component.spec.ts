import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZiyaretcitaleplerimComponent } from './ziyaretcitaleplerim.component';

describe('ZiyaretcitaleplerimComponent', () => {
  let component: ZiyaretcitaleplerimComponent;
  let fixture: ComponentFixture<ZiyaretcitaleplerimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZiyaretcitaleplerimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZiyaretcitaleplerimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
