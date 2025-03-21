import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJoinersComponent } from './new-joiners.component';

describe('NewJoinersComponent', () => {
  let component: NewJoinersComponent;
  let fixture: ComponentFixture<NewJoinersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJoinersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJoinersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
