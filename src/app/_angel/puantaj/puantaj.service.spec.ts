import { TestBed } from '@angular/core/testing';

import { PuantajService } from './puantaj.service';

describe('PuantajService', () => {
  let service: PuantajService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuantajService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
