import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDefinitionsComponent } from './access-definitions.component';

describe('AccessDefinitionsComponent', () => {
  let component: AccessDefinitionsComponent;
  let fixture: ComponentFixture<AccessDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessDefinitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
