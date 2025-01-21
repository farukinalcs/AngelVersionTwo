import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationUseComponent } from './application-use.component';

describe('ApplicationUseComponent', () => {
  let component: ApplicationUseComponent;
  let fixture: ComponentFixture<ApplicationUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationUseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
