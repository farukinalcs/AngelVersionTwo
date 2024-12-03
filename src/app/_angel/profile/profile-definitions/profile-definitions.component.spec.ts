import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDefinitionsComponent } from './profile-definitions.component';

describe('ProfileDefinitionsComponent', () => {
  let component: ProfileDefinitionsComponent;
  let fixture: ComponentFixture<ProfileDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDefinitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
