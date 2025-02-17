import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkRegistryChangeComponent } from './bulk-registry-change.component';

describe('BulkRegistryChangeComponent', () => {
  let component: BulkRegistryChangeComponent;
  let fixture: ComponentFixture<BulkRegistryChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkRegistryChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkRegistryChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
