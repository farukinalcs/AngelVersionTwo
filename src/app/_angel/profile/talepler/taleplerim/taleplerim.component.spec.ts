import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaleplerimComponent } from './taleplerim.component';

describe('TaleplerimComponent', () => {
  let component: TaleplerimComponent;
  let fixture: ComponentFixture<TaleplerimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaleplerimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaleplerimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
