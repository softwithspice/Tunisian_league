import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { PlayerStatisticsService } from './player-statistics-service';

describe('PlayerStatisticsService', () => {
  let service: PlayerStatisticsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PlayerStatisticsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads public statistics for the selected championship', () => {
    const rows = [{ playerId: 5, playerName: 'Ali', playerFirstName: 'Sami', clubId: 2,
      clubName: 'Club A', goals: 3, assists: 1, yellowCards: 0, redCards: 0 }];
    service.getByChampionship(7).subscribe(result => expect(result).toEqual(rows));

    const request = http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`);
    expect(request.request.method).toBe('GET');
    request.flush(rows);
  });
});
