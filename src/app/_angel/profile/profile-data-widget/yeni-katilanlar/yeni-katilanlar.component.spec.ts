import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeniKatilanlarComponent } from './yeni-katilanlar.component';

describe('YeniKatilanlarComponent', () => {
  let component: YeniKatilanlarComponent;
  let fixture: ComponentFixture<YeniKatilanlarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeniKatilanlarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YeniKatilanlarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
