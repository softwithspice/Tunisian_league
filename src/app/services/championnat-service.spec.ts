import { TestBed } from '@angular/core/testing';

import { ChampionnatService } from './championnat-service';

describe('ChampionnatService', () => {
  let service: ChampionnatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampionnatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
