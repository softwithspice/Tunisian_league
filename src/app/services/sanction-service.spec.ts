import { TestBed } from '@angular/core/testing';

import { SanctionService } from './sanction-service';

describe('SanctionService', () => {
  let service: SanctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
