import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessInfoComponent } from './access-info.component';

describe('AccessInfoComponent', () => {
  let component: AccessInfoComponent;
  let fixture: ComponentFixture<AccessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
