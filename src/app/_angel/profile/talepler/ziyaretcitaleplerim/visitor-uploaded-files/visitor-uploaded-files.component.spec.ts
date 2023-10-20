import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorUploadedFilesComponent } from './visitor-uploaded-files.component';

describe('VisitorUploadedFilesComponent', () => {
  let component: VisitorUploadedFilesComponent;
  let fixture: ComponentFixture<VisitorUploadedFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorUploadedFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorUploadedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
