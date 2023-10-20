import { TestBed } from '@angular/core/testing';

import { GuvenlikService } from './guvenlik.service';

describe('GuvenlikService', () => {
  let service: GuvenlikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuvenlikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
