import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuvenlikcilerComponent } from './guvenlikciler.component';

describe('GuvenlikcilerComponent', () => {
  let component: GuvenlikcilerComponent;
  let fixture: ComponentFixture<GuvenlikcilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuvenlikcilerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuvenlikcilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
