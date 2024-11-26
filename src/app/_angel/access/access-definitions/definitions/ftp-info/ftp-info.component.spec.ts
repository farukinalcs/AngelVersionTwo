import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpInfoComponent } from './ftp-info.component';

describe('FtpInfoComponent', () => {
  let component: FtpInfoComponent;
  let fixture: ComponentFixture<FtpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FtpInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
