import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../api-config';
import { MatchDetails } from '../../interfaces/MatchDetails';
import { SaisieResultat } from './saisie-resultat';

describe('SaisieResultat', () => {
  let http: HttpTestingController;
  let page: SaisieResultat;
  let fixture: ReturnType<typeof TestBed.createComponent<SaisieResultat>>;

  const details: MatchDetails = {
    id: 12, championnatId: 7, journee: 3,
    clubDomicileId: 1, clubDomicileNom: 'Club A',
    clubExterieurId: 2, clubExterieurNom: 'Club B',
    dateMatch: '2026-11-01T15:00:00', butsDomicile: 1, butsExterieur: 0,
    evenements: [{ joueurId: 10, clubId: 1, type: 'BUT', minute: 40, passeurId: 11,
      joueurNom: 'Ali', joueurPrenom: 'Sami', clubNom: 'Club A',
      passeurNom: 'Ben', passeurPrenom: 'Karim' }]
  };
  const currentPlayer = { id: 20, nom: 'Nouveau', prenom: 'Hedi', dateNaissance: '2000-01-01', poste: 'ATTAQUANT', nationalite: 'Tunisienne', clubId: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SaisieResultat);
    page = fixture.componentInstance;
    http.expectOne(`${API_BASE_URL}/championnats`).flush([{ id: 7, nom: 'Ligue 1', saison: '2026', clubIds: [1, 2] }]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function selectMatch(matchDetails = details): void {
    page.championnatId = 7;
    page.changerChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/journees`).flush([3]);
    page.journee = 3;
    page.changerJournee();
    http.expectOne(`${API_BASE_URL}/championnats/7/matches?page=0&size=20&journee=3`)
      .flush({ content: [matchDetails], page: 0, size: 20, hasNext: false });
    page.matchId = 12;
    page.changerMatch();
    http.expectOne(`${API_BASE_URL}/matches/12`).flush(matchDetails);
    http.expectOne(`${API_BASE_URL}/clubs/1/joueurs`).flush([currentPlayer]);
    http.expectOne(`${API_BASE_URL}/clubs/2/joueurs`).flush([]);
    fixture.detectChanges();
  }

  it('loads existing events and keeps transferred players available for a correction', () => {
    selectMatch();
    expect(page.matchId).toBe(12);
    expect(page.evenements).toEqual([{ clubId: 1, joueurId: 10, type: 'BUT', minute: 40, passeurId: 11 }]);
    expect(page.joueursDuClub(1).map(player => player.id).sort((a, b) => a - b)).toEqual([10, 11, 20]);
    expect(fixture.nativeElement.textContent).toContain('Club A');
    expect(fixture.nativeElement.textContent).toContain('Sami Ali');
  });

  it('submits the complete corrected event list and reports asynchronous projection updates', () => {
    selectMatch();
    page.butsDomicile = 2;
    page.evenements.push({ clubId: 1, joueurId: 20, type: 'BUT', minute: 80, passeurId: null });
    page.enregistrer();

    const request = http.expectOne(`${API_BASE_URL}/matches/12`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ butsDomicile: 2, butsExterieur: 0, evenements: [
      { clubId: 1, joueurId: 10, type: 'BUT', minute: 40, passeurId: 11 },
      { clubId: 1, joueurId: 20, type: 'BUT', minute: 80, passeurId: null }
    ] });
    request.flush(null);
    fixture.detectChanges();
    expect(page.notice).toContain('en cours de mise à jour');
    expect(page.matches[0].butsDomicile).toBe(2);
  });

  it('blocks a score that does not agree with goal events', () => {
    selectMatch();
    page.butsDomicile = 2;
    page.enregistrer();
    expect(page.error).toContain('correspondre au score');
    http.expectNone(`${API_BASE_URL}/matches/12`);
  });

  it('counts an own goal for the opponent when validating the score', () => {
    selectMatch({ ...details, butsDomicile: 0, butsExterieur: 1,
      evenements: [{ ...details.evenements[0], type: 'BUT_CONTRE_SON_CAMP', passeurId: null }] });
    page.enregistrer();
    const request = http.expectOne(`${API_BASE_URL}/matches/12`);
    expect(request.request.body.butsDomicile).toBe(0);
    expect(request.request.body.butsExterieur).toBe(1);
    request.flush(null);
  });

  it('does not apply a stale matchday response after changing championships', () => {
    page.championnatId = 7;
    page.changerChampionnat();
    const stale = http.expectOne(`${API_BASE_URL}/championnats/7/journees`);
    page.championnatId = 8;
    page.changerChampionnat();
    stale.flush([3]);
    http.expectOne(`${API_BASE_URL}/championnats/8/journees`).flush([1]);
    expect(page.journees).toEqual([1]);
  });

  it('keeps submission unavailable when player lookup fails', () => {
    page.championnatId = 7;
    page.changerChampionnat();
    http.expectOne(`${API_BASE_URL}/championnats/7/journees`).flush([3]);
    page.journee = 3;
    page.changerJournee();
    http.expectOne(`${API_BASE_URL}/championnats/7/matches?page=0&size=20&journee=3`)
      .flush({ content: [details], page: 0, size: 20, hasNext: false });
    page.matchId = 12;
    page.changerMatch();
    http.expectOne(`${API_BASE_URL}/matches/12`).flush(details);
    http.expectOne(`${API_BASE_URL}/clubs/2/joueurs`);
    http.expectOne(`${API_BASE_URL}/clubs/1/joueurs`).flush('Erreur', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(page.playersReady).toBe(false);
    expect(page.error).toContain('Impossible de charger les joueurs');
    page.enregistrer();
    http.expectNone(`${API_BASE_URL}/matches/12`);
  });
});
