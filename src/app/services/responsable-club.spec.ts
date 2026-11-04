import { TestBed } from '@angular/core/testing';

import { ResponsableClub } from './responsable-club';

describe('ResponsableClub', () => {
  let service: ResponsableClub;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsableClub);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
