import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilTanimlamalarComponent } from './profil-tanimlamalar.component';

describe('ProfilTanimlamalarComponent', () => {
  let component: ProfilTanimlamalarComponent;
  let fixture: ComponentFixture<ProfilTanimlamalarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilTanimlamalarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilTanimlamalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
