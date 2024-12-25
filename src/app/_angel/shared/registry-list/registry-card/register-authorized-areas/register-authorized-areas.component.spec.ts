import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAuthorizedAreasComponent } from './register-authorized-areas.component';

describe('RegisterAuthorizedAreasComponent', () => {
  let component: RegisterAuthorizedAreasComponent;
  let fixture: ComponentFixture<RegisterAuthorizedAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterAuthorizedAreasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterAuthorizedAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
