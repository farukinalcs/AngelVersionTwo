import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YenicihazComponent } from './yenicihaz.component';

describe('YenicihazComponent', () => {
  let component: YenicihazComponent;
  let fixture: ComponentFixture<YenicihazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YenicihazComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YenicihazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
