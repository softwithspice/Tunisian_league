import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { MatchService } from './match-service';

describe('MatchService', () => {
  let service: MatchService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(MatchService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the match and its stored events for editing', () => {
    const details = {
      id: 12, championnatId: 7, journee: 3,
      clubDomicileId: 1, clubDomicileNom: 'A', clubExterieurId: 2, clubExterieurNom: 'B',
      dateMatch: '2026-11-01T15:00:00', butsDomicile: 1, butsExterieur: 0,
      evenements: [{ joueurId: 10, clubId: 1, type: 'BUT', minute: 40, passeurId: null,
        joueurNom: 'Ali', joueurPrenom: 'Sami', clubNom: 'A', passeurNom: null, passeurPrenom: null }]
    };
    service.getMatchDetails(12).subscribe(match => expect(match).toEqual(details));

    const req = http.expectOne(`${API_BASE_URL}/matches/12`);
    expect(req.request.method).toBe('GET');
    req.flush(details);
  });

  it('sends both scores and the complete replacement event list', () => {
    const update = { butsDomicile: 2, butsExterieur: 0,
      evenements: [{ joueurId: 10, clubId: 1, type: 'BUT' as const, minute: 40 }] };
    service.updateResult(12, update).subscribe();

    const req = http.expectOne(`${API_BASE_URL}/matches/12`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(null);
  });
});
