import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedCellComponent } from './customized-cell.component';

describe('CustomizedCellComponent', () => {
  let component: CustomizedCellComponent;
  let fixture: ComponentFixture<CustomizedCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizedCellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomizedCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
