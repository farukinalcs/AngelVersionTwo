import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodTypeDefinitionComponent } from './food-type-definition.component';

describe('FoodTypeDefinitionComponent', () => {
  let component: FoodTypeDefinitionComponent;
  let fixture: ComponentFixture<FoodTypeDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodTypeDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodTypeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
