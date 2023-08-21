import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidemlilerComponent } from './kidemliler.component';

describe('KidemlilerComponent', () => {
  let component: KidemlilerComponent;
  let fixture: ComponentFixture<KidemlilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KidemlilerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidemlilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
