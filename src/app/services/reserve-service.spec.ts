import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';

import { ReserveService } from './reserve-service';
import { API_BASE_URL } from '../api-config';

describe('ReserveService', () => {

  let service: ReserveService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ReserveService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should submit a reserve', () => {

    service.deposerReserve(2, 'Joueur non qualifié')
      .subscribe(result => {
        expect(result.matchId).toBe(2);
        expect(result.statut).toBe('EN_ATTENTE');
      });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/reserve`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      matchId: 2,
      motif: 'Joueur non qualifié'
    });

    req.flush({
      id: 1,
      matchId: 2,
      clubId: 1,
      motif: 'Joueur non qualifié',
      statut: 'EN_ATTENTE'
    });
  });

  it('should retrieve club matches', () => {

    service.getMesMatches().subscribe(matches => {
      expect(matches.length).toBe(1);
      expect(matches[0].id).toBe(2);
    });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/reserve/matches`
    );

    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 2,
        championnatId: 1,
        journee: 1,
        clubDomicileId: 1,
        clubExterieurId: 2,
        dateMatch: '2026-11-18'
      }
    ]);
  });
});