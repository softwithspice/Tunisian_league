import { TestBed } from '@angular/core/testing';

import { JoueurService } from './joueur-service';

describe('JoueurService', () => {
  let service: JoueurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoueurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
