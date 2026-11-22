import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../api-config';
import { PlayerStatistics } from '../../interfaces/PlayerStatistics';
import { PlayerLeaders } from './player-leaders';

describe('PlayerLeaders', () => {
  let fixture: ComponentFixture<PlayerLeaders>;
  let page: PlayerLeaders;
  let http: HttpTestingController;

  const scorer: PlayerStatistics = { playerId: 1, playerName: 'Ali', playerFirstName: 'Sami',
    clubId: 10, clubName: 'Club A', goals: 2, assists: 0, yellowCards: 0, redCards: 0 };
  const passer: PlayerStatistics = { playerId: 2, playerName: 'Ben', playerFirstName: 'Karim',
    clubId: 10, clubName: 'Club A', goals: 0, assists: 3, yellowCards: 0, redCards: 0 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PlayerLeaders);
    page = fixture.componentInstance;
    http.expectOne(`${API_BASE_URL}/championnats`).flush([
      { id: 7, nom: 'Ligue 1', saison: '2026', clubIds: [10] },
      { id: 8, nom: 'Ligue 2', saison: '2026', clubIds: [20] }
    ]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('shows separate scorer and assister rankings for the chosen championship', () => {
    page.championnatId = 7;
    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`).flush([scorer, passer]);
    fixture.detectChanges();

    const boards = fixture.nativeElement.querySelectorAll('.board');
    expect(boards[0].textContent).toContain('Sami Ali');
    expect(boards[0].textContent).not.toContain('Karim Ben');
    expect(boards[1].textContent).toContain('Karim Ben');
    expect(boards[1].textContent).not.toContain('Sami Ali');
  });

  it('ignores a stale response when another championship is selected', () => {
    page.championnatId = 7;
    page.choisirChampionnat();
    const stale = http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`);
    page.championnatId = 8;
    page.choisirChampionnat();
    stale.flush([scorer]);
    http.expectOne(`${API_BASE_URL}/championnats/8/player-statistics`).flush([passer]);

    expect(page.scorers).toEqual([]);
    expect(page.assistProviders[0].playerId).toBe(2);
  });

  it('handles no recorded goals or assists', () => {
    page.championnatId = 7;
    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aucun but enregistré');
    expect(fixture.nativeElement.textContent).toContain('Aucune passe décisive');
  });

  it('shows an error and can retry after the API fails', () => {
    page.championnatId = 7;
    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`)
      .flush(null, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Impossible de charger');

    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`).flush([scorer]);
    expect(page.scorers[0].goals).toBe(2);
  });

  it('refreshes statistics after a corrected result', () => {
    page.championnatId = 7;
    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`).flush([scorer]);
    page.choisirChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/player-statistics`).flush([{ ...scorer, goals: 1 }]);
    expect(page.scorers[0].goals).toBe(1);
  });
});
