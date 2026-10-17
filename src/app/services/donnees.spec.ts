import { TestBed } from '@angular/core/testing';

import { Donnees } from './donnees';

describe('Donnees', () => {
  let service: Donnees;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Donnees);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
