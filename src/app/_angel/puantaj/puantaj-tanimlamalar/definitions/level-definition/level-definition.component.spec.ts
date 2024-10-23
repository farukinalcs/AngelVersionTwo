import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDefinitionComponent } from './level-definition.component';

describe('LevelDefinitionComponent', () => {
  let component: LevelDefinitionComponent;
  let fixture: ComponentFixture<LevelDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
