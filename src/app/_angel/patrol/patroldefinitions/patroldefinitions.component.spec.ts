import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatroldefinitionsComponent } from './patroldefinitions.component';

describe('PatroldefinitionsComponent', () => {
  let component: PatroldefinitionsComponent;
  let fixture: ComponentFixture<PatroldefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatroldefinitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatroldefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
