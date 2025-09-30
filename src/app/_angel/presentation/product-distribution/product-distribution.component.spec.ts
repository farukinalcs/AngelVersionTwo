import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDistributionComponent } from './product-distribution.component';

describe('ProductDistributionComponent', () => {
  let component: ProductDistributionComponent;
  let fixture: ComponentFixture<ProductDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
