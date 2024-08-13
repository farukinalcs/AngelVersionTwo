import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedCellComponentComponent } from './customized-cell-component.component';

describe('CustomizedCellComponentComponent', () => {
  let component: CustomizedCellComponentComponent;
  let fixture: ComponentFixture<CustomizedCellComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizedCellComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomizedCellComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
