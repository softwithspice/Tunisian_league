import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { ChampionnatService } from './championnat-service';
import { API_BASE_URL } from '../api-config';

describe('ChampionnatService', () => {

  let service: ChampionnatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ChampionnatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve match results', () => {

    const response = {
      content: [
        {
          journee: 1,
          clubDomicileId: 1,
          clubExterieurId: 2,
          clubDomicileNom: 'test',
          clubExterieurNom: 'EST',
          dateMatch: '2026-11-01T00:00:00',
          butsDomicile: 2,
          butsExterieur: 1
        }
      ],
      page: 0,
      size: 20,
      hasNext: false
    };

    service.getResults(1, 0).subscribe(data => {
      expect(data).toEqual(response);
      expect(data.content[0].butsDomicile).toBe(2);
      expect(data.content[0].butsExterieur).toBe(1);
    });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/championnats/1/results?page=0&size=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('should send the correct page number', () => {

    service.getResults(1, 1).subscribe(data => {
      expect(data.page).toBe(1);
      expect(data.hasNext).toBe(false);
    });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/championnats/1/results?page=1&size=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      content: [],
      page: 1,
      size: 20,
      hasNext: false
    });
  });

  it('should return an empty list when no results exist', () => {

    service.getResults(1, 0).subscribe(data => {
      expect(data.content).toEqual([]);
      expect(data.hasNext).toBe(false);
    });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/championnats/1/results?page=0&size=20`
    );

    req.flush({
      content: [],
      page: 0,
      size: 20,
      hasNext: false
    });
  });

});