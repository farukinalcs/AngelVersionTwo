import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModernTableComponent } from './modern-table.component';

describe('ModernTableComponent', () => {
  let component: ModernTableComponent;
  let fixture: ComponentFixture<ModernTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModernTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModernTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
