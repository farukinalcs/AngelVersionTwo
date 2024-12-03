import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTypeDefinitionComponent } from './file-type-definition.component';

describe('FileTypeDefinitionComponent', () => {
  let component: FileTypeDefinitionComponent;
  let fixture: ComponentFixture<FileTypeDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTypeDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileTypeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
